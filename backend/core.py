import os
import time
import pyautogui
from mqtt import publish as mqtt_publish

from model.action import Action
from model.association import Association


def compare_words(list, sentence):
	sent_list = sentence.lower().split(' ')
	greater = None
	greater_val = 0
	for item in list:
		equals = 0
		item_list = item.phrase.lower().split(' ')
		for word in sent_list:
			if word in item_list:
				item_list.remove(word)
				equals += 1
		# equals -= len(item_list)
		if equals > greater_val:
			greater_val = equals
			greater = item
	return greater


# https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
def execute_association(phrase_id):
	assoc = Association.query.filter_by(phrase_id=phrase_id).first()
	action = Action.query.get(assoc.action_id)
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
