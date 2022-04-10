import os
import re
import time
import numpy as np
import pyautogui
from mqtt import publish as mqtt_publish
from thefuzz import fuzz
from sent2vec.vectorizer import Vectorizer
from scipy import spatial

from model.action import Action
from model.association import Association

vectorizer = Vectorizer(pretrained_weights='distilbert-base-multilingual-cased')


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
	# print(sentence)
	for speech in speech_list:
		vectors = string2vector(speech.vector)
		for vect in vectors:
			dist = spatial.distance.cosine(vect, sentence_vector)
			# print(speech.phrase, dist, len(vectors))
			if dist < minor_dist:
				minor_dist = dist
				minor = speech
	# print(minor_dist)
	# print(minor)
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
				for word1 in sent_words:
					if word2 in phrase_words:
						phrase_words.remove(word2)
						matches += 1
				if matches > greater_val:
					greater_val = matches
					greater = speech
		else:
			phrase_words = speech.phrase.lower().split(' ')
			for word1 in sent_words:
				if word2 in phrase_words:
					phrase_words.remove(word2)
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


# https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
def process_action(action_id):
	action = Action.query.get(action_id)
	print(f'Processing Action: {action.name}, of type: {action.type} on program: {action.program}, with parameters: {action.parameters}')
	if action.type == 'Console':
		os.system(f'{action.program} {action.parameters}')
	elif action.type == 'HotKey':
		os.system(f'wmctrl -a {action.program}')
		time.sleep(1)
		if ' ' in action.parameters:
			hotkey = action.parameters.split(' ')
			pyautogui.hotkey(*hotkey)
		else:
			pyautogui.press(action.parameters)
		# activate window for windows:
		#window = gw.getWindowsWithTitle(action.window)[0]
		#window.restore()
		#window.activate()
	elif action.type == 'Browser':
		os.system(f'{action.program} {action.parameters}')
	elif action.type == 'MQTT':
		mqtt_publish(action.program, action.parameters)


def process_association(speech_id):
	assocs = Association.query.filter_by(speech_id=speech_id).order_by(Association.order).all()
	for assoc in assocs:
		process_action(assoc.action_id)
