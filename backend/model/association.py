import flask
import requests
from flask import request
from init import app, db


# Model --------------------------------------

class Association(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phrase_id = db.Column(db.Integer, db.ForeignKey('phrase.id'))
    action_id = db.Column(db.Integer, db.ForeignKey('action.id'))
    order = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Association %r>' % self.name


# CRUD ---------------------------------------

@app.route('/get_associations')
def get_associations():
	assocs = Association.query.order_by(Association.order).all()
	ret = [{'id': assoc.id, 'phrase_id': assoc.phrase_id, 'action_id': assoc.action_id, 'order': assoc.order} for assoc in assocs]
	return flask.jsonify(ret)


@app.route('/set_association', methods=['GET', 'POST'])
def set_association():
	if request.method == 'POST':
		id = request.json['id']
		if id is None or id == 0:
			if request.json['phrase_id'] is None or request.json['action_id'] is None:
				return flask.jsonify({'result': 'nothing to show here!'})
			assoc = Association()
			assoc.phrase_id = request.json['phrase_id']
			assoc.action_id = request.json['action_id']
			assoc.order = request.json['order']
			db.session.add(assoc)
			db.session.commit()
		else:
			assoc = Association.query.get(id)
			assoc.phrase_id = request.json['phrase_id']
			assoc.action_id = request.json['action_id']
			assoc.order = request.json['order']
			db.session.commit()
		return flask.jsonify({'id': assoc.id, 'phrase_id': assoc.phrase_id, 'action_id': assoc.action_id, 'order': assoc.order})
	else:
		return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_association', methods=['GET', 'POST'])
def delete_association():
	if request.method == 'POST':
		id = request.json['id']
		assoc = Association.query.get(id)
		db.session.delete(assoc)
		db.session.commit()

		shift = False
		prev = 0
		associations = Association.query.order_by(Association.order).all()
		for assc in associations:
			if assc.order != prev + 1:
				assc.order = prev + 1
			prev = prev + 1

		db.session.commit()

		ret = [{'id': assc.id, 'phrase_id': assc.phrase_id, 'action_id': assc.action_id, 'order': assc.order} for assc in associations]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})


@app.route('/reorder_associations', methods=['GET', 'POST'])
def reorder_associations():
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

		assocs = Association.query.order_by(Association.order).all()

		for assoc in assocs:
			if assoc.order in originals:
				idx = originals.index(assoc.order)
				assoc.order = result[idx]

		db.session.commit()

		ret = [{'id': assoc.id, 'phrase_id': assoc.phrase_id, 'action_id': assoc.action_id, 'order': assoc.order} for assoc in assocs]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})
