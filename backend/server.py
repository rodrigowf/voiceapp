# -*- coding: utf-8 -*-

import os
import flask
import requests
from flask import request
from sqlalchemy.sql import text, column

from init import app, db
from model.action import *
from model.speech import *
from model.association import *
from core import fuzz_compare, compare_vectors, process_association, process_action


#TODO resolver o compare_vector

@app.route('/send_phrase', methods=['GET', 'POST'])
def send_phrase():
	if request.method == 'POST':
		input_phrase = request.json['phrase']
		database = Speech.query.all()
		match = compare_vectors(database, input_phrase)
		process_association(match.id)
		res = {'id': match.id, 'name': match.name, 'phrase': match.phrase}
		return flask.jsonify({'best_match': res})
	else:
		return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/execute_action', methods=['GET', 'POST'])
def execute_action():
	if request.method == 'POST':
		action_id = request.json['id']
		process_action(action_id)
		return flask.jsonify({'result': 'success'})
	else:
		return flask.jsonify({'result': 'nothing to show here!'})


# Para testar o servidor
@app.route('/')
def index():
	try:
		db.session.query(column('1')).from_statement(text('SELECT 1')).all()
		return '<h1>It works.</h1>'
	except Exception as e:
		# see Terminal for description of the error
		print("\nThe error:\n" + str(e) + "\n")
		return '<h1>Something is broken.</h1>'


# =========================================================


if __name__ == '__main__':
	# When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    # Specify a hostname and port that are set as a valid redirect URI
    # for your API project in the Google API Console.
    app.run('localhost', 8000, debug=True)
