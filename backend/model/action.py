import flask
import requests
from flask import request
from init import app, db


# Model --------------------------------

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    type = db.Column(db.String(15), nullable=False)
    program = db.Column(db.String(120), nullable=False)
    parameters = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Action %r>' % self.name


def createData(id, name, type, program, parameters, order):
	return {
		'id': id,
		'name': name,
		'type': type,
		'program': program,
		'parameters': parameters,
		'order': order
	}

# CRUD ---------------------------------

@app.route('/get_actions')
def get_actions():
	acts = Action.query.order_by(Action.order).all()
	ret = [createData(act.id, act.name, act.type, act.program, act.parameters, act.order) for act in acts]
	return flask.jsonify(ret)


@app.route('/set_action', methods=['GET', 'POST'])
def set_action():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        type = request.json['type']
        program = request.json['program']
        parameters = request.json['parameters']
        order = request.json['order']

        if id is None or id == 0:
            action = Action()
            action.name = name
            action.type = type
            action.program = program
            action.parameters = parameters
            action.order = order
            db.session.add(action)
        else:
            action = Action.query.get(id)
            action.name = name
            action.type = type
            action.program = program
            action.parameters = parameters
            action.order = order

        db.session.commit()

        return flask.jsonify(createData(action.id, name, type, program, parameters, order))
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_action', methods=['GET', 'POST'])
def delete_action():
	if request.method == 'POST':
		id = request.json['id']
		action = Action.query.get(id)
		db.session.delete(action)
		db.session.commit()

		shift = False
		prev = 0
		actions = Action.query.order_by(Action.order).all()
		for act in actions:
			if act.order != prev + 1:
				act.order = prev + 1
			prev = prev + 1

		db.session.commit()

		ret = [createData(act.id, act.name, act.type, act.program, act.parameters, act.order) for act in actions]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})


@app.route('/reorder_actions', methods=['GET', 'POST'])
def reorder_actions():
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

		actions = Action.query.order_by(Action.order).all()

		for action in actions:
			if action.order in originals:
				idx = originals.index(action.order)
				action.order = result[idx]

		db.session.commit()

		ret = [createData(act.id, act.name, act.type, act.program, act.parameters, act.order) for act in actions]
		return flask.jsonify({'result': 'success', 'retrows': ret})
	else:
		return flask.jsonify({'result': 'error'})

