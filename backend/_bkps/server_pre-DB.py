# -*- coding: utf-8 -*-

import os
import flask
import requests
from flask import request
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text, column


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


def compare_words(list, sentence):
	sent_list = sentence.lower().split(' ')
	greater = 1
	greater_val = 0
	for item in list:
		equals = 0
		item_list = item['phrase'].lower().split(' ')
		for word in sent_list:
			if word in item_list:
				item_list.remove(word)
				equals += 1
		# equals -= len(item_list)
		if equals > greater_val:
			greater_val = equals
			greater = item['id']
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
		result_id = compare_words(commands, sentence)
		res_cmd = get_cmd_by_id(result_id)
		return flask.jsonify({'best_match': res_cmd})

	else:
		return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/get_commands')
def get_commands():
    return flask.jsonify(commands)


@app.route('/set_command', methods=['GET', 'POST'])
def set_command():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        phrase = request.json['phrase']

        return flask.jsonify({'id': id, 'name': name, 'phrase': phrase})

    else:
        return flask.jsonify({'result': 'nothing to show here!'})


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
    app.run('localhost', 8080, debug=True)
