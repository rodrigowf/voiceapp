# -*- coding: utf-8 -*-

import os
import time
import flask
import requests
from flask import request
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text, column
import pyautogui


app = flask.Flask(__name__)
app.secret_key = b'5oZW6\n$#^#3w3FE3'

# Session config
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

# CORS - cross domain config
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Database configuration
username = 'voiceapp'
password = 'vcaPPas$!13123'
userpass = 'mysql+pymysql://' + username + ':' + password + '@'
server  = '127.0.0.1'
dbname   = '/voiceapp'

app.config['SQLALCHEMY_DATABASE_URI'] = userpass + server + dbname
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)


commands = [
    {'id': 1, 'name': 'Acender Luz', 'phrase': 'acenda a luz'},
    {'id': 2, 'name': 'Ligar TV', 'phrase': 'liga a tv'},
    {'id': 3, 'name': 'Play', 'phrase': 'dê o play'},
    {'id': 4, 'name': 'Despertador Matinal', 'phrase': 'programe meu despertador para me acordar amanhã de manhã'}
]

class Command(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    phrase = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<Command %r>' % self.name


class Control(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    window = db.Column(db.String(120), nullable=False)
    key = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return '<Control %r>' % self.name


class Relation(db.Model):
    command_id = db.Column(db.Integer, db.ForeignKey('command.id'), primary_key=True)
    control_id = db.Column(db.Integer, db.ForeignKey('control.id'), primary_key=True)

    def __repr__(self):
        return '<Relation %r>' % self.name



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


def get_cmd_by_id(id):
	for cmd in commands:
		if cmd['id'] == id:
			return cmd
	return False



@app.route('/')
def index():
    try:
        db.session.query(column('1')).from_statement(text('SELECT 1')).all()
        return '<h1>It works.</h1>'
    except Exception as e:
        # see Terminal for description of the error
        print("\nThe error:\n" + str(e) + "\n")
        return '<h1>Something is broken.</h1>'


@app.route('/send_command', methods=['GET', 'POST'])
def send_command():
	if request.method == 'POST':
		sentence = request.json['sentence']
		cmds = Command.query.all()
		res_cmd = compare_words(cmds, sentence)
		res = {'id': res_cmd.id, 'name': res_cmd.name, 'phrase': res_cmd.phrase}
		resolve_command(res_cmd.id)
		return flask.jsonify({'best_match': res})

	else:
		return flask.jsonify({'result': 'nothing to show here!'})


def resolve_command(command_id):
	rel = Relation.query.filter_by(command_id=command_id).first()
	ctrl = Control.query.get(rel.control_id)
	print(ctrl.window)
	print(ctrl.key)
	#window = gw.getWindowsWithTitle(ctrl.window)[0]
	#window.restore()
	#window.activate()
	os.system(f'wmctrl -a {ctrl.window}')
	time.sleep(1)
	pyautogui.press(ctrl.key)



# Commands CRUD =======================================

@app.route('/get_commands')
def get_commands():
	cmds = Command.query.all()
	ret = [{'id': com.id, 'name': com.name, 'phrase': com.phrase} for com in cmds]
	return flask.jsonify(ret)


@app.route('/set_command', methods=['GET', 'POST'])
def set_command():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        phrase = request.json['phrase']

        if id is None:
            cmd = Command()
            cmd.name = name
            cmd.phrase = phrase
            db.session.add(cmd)
        else:
            cmd = Command.query.get(id)
            cmd.name = name
            cmd.phrase = phrase

        db.session.commit()

        return flask.jsonify({'id': id, 'name': name, 'phrase': phrase})
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_command', methods=['GET', 'POST'])
def delete_command():
    if request.method == 'POST':
        id = request.json['id']
        cmd = Command.query.get(id)
        db.session.delete(cmd)
        db.session.commit()
        return flask.jsonify({'result': 'success'})
    else:
        return flask.jsonify({'result': 'error'})


# Controls ============================================

@app.route('/get_controls')
def get_controls():
	ctrls = Control.query.all()
	ret = [{'id': ctrl.id, 'name': ctrl.name, 'window': ctrl.window, 'key': ctrl.key} for ctrl in ctrls]
	return flask.jsonify(ret)


@app.route('/set_control', methods=['GET', 'POST'])
def set_control():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        window = request.json['window']
        key = request.json['key']

        if id is None:
            ctrl = Control()
            ctrl.name = name
            ctrl.window = window
            ctrl.key = key
            db.session.add(ctrl)
        else:
            ctrl = Control.query.get(id)
            ctrl.name = name
            ctrl.window = window
            ctrl.key = key

        db.session.commit()

        return flask.jsonify({'id': id, 'name': name, 'window': window, 'key': key})
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_control', methods=['GET', 'POST'])
def delete_control():
    if request.method == 'POST':
        id = request.json['id']
        ctrl = Control.query.get(id)
        db.session.delete(ctrl)
        db.session.commit()
        return flask.jsonify({'result': 'success'})
    else:
        return flask.jsonify({'result': 'error'})


# Relations ============================================

@app.route('/get_relations')
def get_relations():
	rels = Relation.query.all()
	ret = [{'command_id': rel.command_id, 'control_id': rel.control_id} for rel in rels]
	return flask.jsonify(ret)


@app.route('/set_relation', methods=['GET', 'POST'])
def set_relation():
    if request.method == 'POST':
        rel = Relation()
        if request.json['command_id'] is None or request.json['control_id'] is None:
        	return flask.jsonify({'result': 'nothing to show here!'})
        rel.command_id = request.json['command_id']
        rel.control_id = request.json['control_id']
        db.session.add(rel)
        db.session.commit()

        return flask.jsonify({'command_id': rel.command_id, 'control_id': rel.control_id})
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_relation', methods=['GET', 'POST'])
def delete_relation():
    if request.method == 'POST':
        command_id = request.json['command_id']
        control_id = request.json['control_id']
        rel = Relation.query.filter_by(command_id=command_id, control_id=control_id).first()
        db.session.delete(rel)
        db.session.commit()
        return flask.jsonify({'result': 'success'})
    else:
        return flask.jsonify({'result': 'error'})

# =========================================================


def print_index_page():
    return ('<h1>' +
            'Primeiro teste do servidor!' +
            '</h1>')


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    # Specify a hostname and port that are set as a valid redirect URI
    # for your API project in the Google API Console.
    app.run('localhost', 8000, debug=True)
