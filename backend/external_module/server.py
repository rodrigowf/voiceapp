# -*- coding: utf-8 -*-

import os
import flask
from flask import request
from flask_cors import CORS, cross_origin
import pyautogui
import shlex
import subprocess


server_ip = '192.168.0.110'
server_port = 8000
server_debug = True



# init ----------------------

app = flask.Flask(__name__)
app.secret_key = b'5h3445$%6\n$#^w3sfgFE3'

# CORS - cross domain config
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# ---------------------------

@app.route('/execute_action', methods=['GET', 'POST'])
def execute_action():
    if request.method == 'POST':
        actype = request.json['type']
        target = request.json['target']
        value = request.json['value']
        
        if actype == 'Console':
        	execute_console(target, value)
        elif actype == 'HotKey':
        	execute_hotkey(target, value)
        elif actype == 'Browser':
        	execute_browser(target, value)
        
        return flask.jsonify({'result': 'success'})
    else:
        return flask.jsonify({'result': 'error'})



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
			pyautogui.hotkey(*hotkey)
		else:
			pyautogui.press(value)


def execute_browser(target, value):
	os.system(f'{target} {value}')



# =========================================================


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    # Specify a hostname and port that are set as a valid redirect URI
    # for your API project in the Google API Console.
    app.run(server_ip, server_port, debug=server_debug)

