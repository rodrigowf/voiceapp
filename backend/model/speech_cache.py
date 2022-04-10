import flask
import requests
from flask import request
from sqlalchemy import bindparam, engine
from sqlalchemy.sql import text, column, update, values

from init import app, db
from core import calculate_vectors, vector2string


# Model --------------------------------------

class Speech(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    phrase = db.Column(db.String(1024), unique=True, nullable=False)
    vector = db.Column(db.UnicodeText, nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Speech %r>' % self.name

# A whrapper class for caching
class Speeches():
	speeches = Speech.query.order_by(Speech.order).all()

	def get_all():
		return speeches

	def get(id):
		for spc in speeches: if spc.id == id: return spc

	def add(speech):
		db.session.add(speech)
		db.session.commit()
		speeches.append(speech)

	def delete(id):
        spch = get(id)
        db.session.delete(spch)
        db.session.commit()
        speeches.remove(spch)

	def sort(originals, results):
        for speech in speeches:
            if speech.order in originals:
                idx = originals.index(speech.order)
                speech.order = result[idx]
        db.session.commit()
		speeches.sort(key=lambda d: d.order)
		return speeches


# CRUD API -----------------------------------



@app.route('/get_speeches')
def get_speeches():
	spchs Speeches.get_all()
    ret = [{'id': spch.id, 'name': spch.name, 'phrase': spch.phrase, 'order': spch.order} for spch in spchs]
    return flask.jsonify(ret)


@app.route('/set_speech', methods=['GET', 'POST'])
def set_speech():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        phrase = request.json['phrase']
        order = request.json['order']
        vect = vector2string(calculate_vectors(phrase))

        if id is None or id == 0:
            spch = Speech(name = name, phrase = phrase, vector = vect, order = order)
            Speeches.add(spch)
        else:
            spch = Speeches.get(id)
            spch.name = name
            spch.phrase = phrase
            spch.vector = vect
            spch.order = order
            db.session.commit()

        return flask.jsonify({'id': spch.id, 'name': name, 'phrase': phrase, 'order': order})
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_speech', methods=['GET', 'POST'])
def delete_speech():
    if request.method == 'POST':
        id = request.json['id']
        Speeches.delete(id)

        speeches = Speeches.get_all()
        prev = 0
        for spch in speeches:
            if spch.order != prev + 1:
                spch.order = prev + 1
            prev = prev + 1

        db.session.commit()

        ret = [{'id': spch.id, 'name': spch.name, 'phrase': spch.phrase, 'order': spch.order} for spch in speeches]
        return flask.jsonify({'result': 'success', 'retrows': ret})
    else:
        return flask.jsonify({'result': 'error'})


@app.route('/reorder_speeches', methods=['GET', 'POST'])
def reorder_speeches():
    if request.method == 'POST':
        interval = request.json['interval']
        dropOrder = request.json['dropOrder']
        a = interval[0]
        b = interval[1]
        originals = list(range(a, b + 1))
        results = []
        if dropOrder == a:
            results = originals[1: b - a + 1] + [a]
        elif dropOrder == b:
            results = [b] + originals[0: b - a]

        speeches = Speeches.sort(originals, results)

        ret = [{'id': spch.id, 'name': spch.name, 'phrase': spch.phrase, 'order': spch.order} for spch in speeches]
        return flask.jsonify({'result': 'success', 'retrows': ret})
    else:
        return flask.jsonify({'result': 'error'})
