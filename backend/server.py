# -*- coding: utf-8 -*-

import os
import flask
import requests
from flask import request
from sqlalchemy.sql import text, column

from init import app, db
from model.action import *
from model.phrase import *
from model.association import *
from core import compare_words, execute_association


@app.route('/send_phrase', methods=['GET', 'POST'])
def send_phrase():
	if request.method == 'POST':
		input = request.json['phrase']
		database = Phrase.query.all()
		match = compare_words(database, input)
		res = {'id': match.id, 'name': match.name, 'phrase': match.phrase}
		execute_association(match.id)
		return flask.jsonify({'best_match': res})
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
