import os
import re
import time
import numpy as np
#import pyautogui
import shlex
import subprocess
import requests
# from selenium import webdriver
from mqtt import publish as mqtt_publish
from thefuzz import fuzz
from sent2vec.vectorizer import Vectorizer
from scipy import spatial
from flask_sqlalchemy_caching import FromCache

from init import cache
from model.action import Action
from model.association import Association


vectorizer = Vectorizer(pretrained_weights='distilbert-base-multilingual-cased')
# driver = webdriver.Chrome()


def calculate_vectors(phrase):
	phrases = re.split(' , |, | ,|,| ; |; | ;|;', phrase)
	vectorizer.vectors = []
	vectorizer.run(phrases)
	vectors = vectorizer.vectors
	vectorizer.vectors = []
	return vectors


def vector2string(vectors):
	string_list = [",".join([str(num)for num in vec]) for vec in vectors]
	return ";".join(string_list)


def string2vector(vec_string):
	string_list = vec_string.split(";")
	return [ np.array(stri.split(','), np.float32) for stri in string_list ]


def compare_vectors(speech_list, sentence):
	vectorizer.vectors = []
	vectorizer.run([sentence])
	sentence_vector = vectorizer.vectors[0]
	vectorizer.vectors = []
	minor = None
	minor_dist = 100
	for speech in speech_list:
		vectors = string2vector(speech.vector)
		for vect in vectors:
			# dist = spatial.distance.cosine(vect, sentence_vector)
			dist = spatial.distance.euclidean(vect, sentence_vector)
			if dist < minor_dist:
				minor_dist = dist
				minor = speech
		if len(vectors) > 1:
			mean = sum(vectors) / len(vectors)
			# dist = spatial.distance.cosine(mean, sentence_vector)
			dist = spatial.distance.euclidean(mean, sentence_vector)
			if dist < minor_dist:
				minor_dist = dist
				minor = speech
	return minor


def compare_words(speech_list, sentence):
	sent_words = sentence.lower().split(' ')
	greater = None
	greater_val = 0
	for speech in speech_list:
		matches = 0
		if ',' in speech.phrase or ';' in speech.phrase:
			phrases = re.split(' , |, | ,|,| ; |; | ;|;', speech.phrase)
			for phrase in phrases:
				phrase_words = phrase.lower().split(' ')
				for word in sent_words:
					if word in phrase_words:
						phrase_words.remove(word)
						matches += 1
				if matches > greater_val:
					greater_val = matches
					greater = speech
		else:
			phrase_words = speech.phrase.lower().split(' ')
			for word in sent_words:
				if word in phrase_words:
					phrase_words.remove(word)
					matches += 1
			if matches > greater_val:
				greater_val = matches
				greater = speech
	return greater


def fuzz_compare(speech_list, sentence):
	greater = None
	greater_ratio = 0
	for speech in speech_list:
		if ',' in speech.phrase or ';' in speech.phrase:
			phrases = re.split(' , |, | ,|,| ; |; | ;|;', speech.phrase)
			for phrase in phrases:
				ratio = fuzz.token_sort_ratio(phrase, sentence)
				if ratio > greater_ratio:
					greater_ratio = ratio
					greater = speech
		else:
			phrase = speech.phrase
			ratio = fuzz.token_sort_ratio(phrase, sentence)
			if ratio > greater_ratio:
				greater_ratio = ratio
				greater = speech
	return greater


########################################################


def execute_console(target, value):
	args = shlex.split(value)
	subprocess.run([target, *args])


def execute_hotkey(target, value):
	# activate window for windows:
	# window = gw.getWindowsWithTitle(target)[0]
	# window.restore()
	# window.activate()

	running_app = None
	apps_list = str(subprocess.check_output("wmctrl -l", shell=True)).lower()
	apps = re.split(' , |, | ,|,| ; |; | ;|;', target)
	for app in apps:
		if app.lower() in apps_list:
			running_app = app
			break

	if running_app:
		subprocess.run(['wmctrl', '-a', running_app])
		time.sleep(0.5)
		if ' ' in value:
			hotkey = value.split(' ')
		#	pyautogui.hotkey(*hotkey)
		else:
		#	pyautogui.press(value)


def execute_browser(target, value):
	os.system(f'{target} {value}')


# https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
def process_action(action_id):
	action = Action.query.options(FromCache(cache)).get(action_id)
	print(f'Processing Action: {action.name}, of type: {action.type} on target: {action.target}, with value: {action.value}')
	if action.type == 'Console':
		execute_console(action.target, action.value)
	elif action.type == 'HotKey':
		execute_hotkey(action.target, action.value)
	elif action.type == 'Browser':
		execute_browser(action.target, action.value)
	elif action.type == 'MQTT':
		mqtt_publish(action.target, action.value)


def process_external_action(action_id):
	action = Action.query.options(FromCache(cache)).get(action_id)
	print(f'Processing Action: {action.name}, of type: {action.type} on target: {action.target}, with value: {action.value}')
	if action.type == 'MQTT':
		mqtt_publish(action.target, action.value)
	else:
		url = 'http://192.168.0.110/execute_action'
		myobj = {'type': action.type, 'target': action.target, 'value': action.value}

		x = requests.post(url, data = myobj)
		
		return x.text


def process_association(speech_id):
	assocs = Association.query.options(FromCache(cache)).filter_by(speech_id=speech_id).order_by(Association.order).all()
	for assoc in assocs:
		process_external_action(assoc.action_id)

