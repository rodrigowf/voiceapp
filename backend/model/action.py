import flask
from flask import request
from flask_sqlalchemy_caching import FromCache

from init import app, db, cache


# Model --------------------------------

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    icon = db.Column(db.String(50))
    type = db.Column(db.String(15), nullable=False)
    target = db.Column(db.String(120), nullable=False)
    value = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Action %r>' % self.name


def createData(id, name, icon, type, target, value, order):
    return {
        'id': id,
        'name': name,
        'icon': icon,
        'type': type,
        'target': target,
        'value': value,
        'order': order
    }


# CRUD API -----------------------------------

@app.route('/get_actions')
def get_actions():
    acts = Action.query.options(FromCache(cache)).order_by(Action.order).all()
    ret = [createData(act.id, act.name, act.icon, act.type, act.target, act.value, act.order) for act in acts]
    return flask.jsonify(ret)


@app.route('/set_action', methods=['GET', 'POST'])
def set_action():
    if request.method == 'POST':
        id = request.json['id']
        name = request.json['name']
        icon = request.json['icon']
        type = request.json['type']
        target = request.json['target']
        value = request.json['value']
        order = request.json['order']

        if id is None or id == 0:
            action = Action(name=name, icon=icon, type=type, target=target, value=value, order=order)
            db.session.add(action)
        else:
            action = Action.query.options(FromCache(cache)).get(id)
            action.name = name
            action.icon = icon
            action.type = type
            action.target = target
            action.value = value
            action.order = order

        db.session.commit()

        return flask.jsonify(createData(action.id, name, icon, type, target, value, order))
    else:
        return flask.jsonify({'result': 'nothing to show here!'})


@app.route('/delete_action', methods=['GET', 'POST'])
def delete_action():
    if request.method == 'POST':
        id = request.json['id']
        action = Action.query.options(FromCache(cache)).get(id)
        db.session.delete(action)
        db.session.commit()

        prev = 0
        actions = Action.query.options(FromCache(cache)).order_by(Action.order).all()
        for act in actions:
            if act.order != prev + 1:
                act.order = prev + 1
            prev = prev + 1

        db.session.commit()

        ret = [createData(act.id, act.name, act.icon, act.type, act.target, act.value, act.order) for act in actions]
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
        originals = list(range(a, b + 1))
        results = []
        if dropOrder == a:
            results = originals[1: b - a + 1] + [a]
        elif dropOrder == b:
            results = [b] + originals[0: b - a]

        actions = Action.query.options(FromCache(cache)).order_by(Action.order).all()

        for action in actions:
            if action.order in originals:
                idx = originals.index(action.order)
                action.order = results[idx]

        db.session.commit()

        ret = [createData(act.id, act.name, act.icon, act.type, act.target, act.value, act.order) for act in actions]
        return flask.jsonify({'result': 'success', 'retrows': ret})
    else:
        return flask.jsonify({'result': 'error'})
