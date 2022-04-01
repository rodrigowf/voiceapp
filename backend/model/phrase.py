import flask
import requests
from flask import request
from sqlalchemy import bindparam, engine
from sqlalchemy.sql import text, column, update, values

from init import app, db


# Model --------------------------------------

class Phrase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    phrase = db.Column(db.String(120), unique=True, nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Phrase %r>' % self.name


# CRUD ---------------------------------------

@app.route('/get_phrases')
def get_phrases():
	phrs = Phrase.query.order_by(Phrase.order).all()
	ret = [{'id': phr.id, 'name': phr.name, 'phrase': phr.phrase, 'order': phr.order} for phr in phrs]
	return flask.jsonify(ret)


@app.route('/set_phrase', methods=['GET', 'POST'])
def set_phrase():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        phrase = request.json['phrase']
        order = request.json['order']

        if id is None or id == 0:
            phr = Phrase()
            phr.name = name
            phr.phrase = phrase
            phr.order = order
            db.session.add(phr)
        else:
            phr = Phrase.query.get(id)
            phr.name = name
            phr.phrase = phrase
            phr.order = order

        db.session.commit()

        return flask.jsonify({'id': phr.id, 'name': name, 'phrase': phrase, 'order': order})
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_phrase', methods=['GET', 'POST'])
def delete_phrase():
	if request.method == 'POST':
		id = request.json['id']
		phr = Phrase.query.get(id)
		db.session.delete(phr)
		db.session.commit()

		shift = False
		prev = 0
		phrases = Phrase.query.order_by(Phrase.order).all()
		for phr in phrases:
			if phr.order != prev + 1:
				phr.order = prev + 1
			prev = prev + 1

		db.session.commit()

		ret = [{'id': phr.id, 'name': phr.name, 'phrase': phr.phrase, 'order': phr.order} for phr in phrases]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})


@app.route('/reorder_phrases', methods=['GET', 'POST'])
def reorder_phrases():
	if request.method == 'POST':
		interval = request.json['interval']
		dropOrder = request.json['dropOrder']
		a = interval[0]
		b = interval[1]
		originals = list(range(a, b+1))
		result = []
		if dropOrder == a:
			result = originals[1 : b-a+1] + [a]
		elif dropOrder == b:
			result = [b] + originals[0 : b-a]

		phrases = Phrase.query.order_by(Phrase.order).all()

		for phrase in phrases:
			if phrase.order in originals:
				idx = originals.index(phrase.order)
				phrase.order = result[idx]

		db.session.commit()

		ret = [{'id': phr.id, 'name': phr.name, 'phrase': phr.phrase, 'order': phr.order} for phr in phrases]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})
