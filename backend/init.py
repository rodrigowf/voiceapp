# -*- coding: utf-8 -*-

import os
import flask
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy_caching import CachingQuery
from flask_caching import Cache


basedir = os.path.abspath(os.path.dirname(__file__))

app = flask.Flask(__name__)
app = flask.Flask(__name__,
            static_folder='frontend')
app.secret_key = b'5oZW6\n$#^#3w3FE3'

# Session config
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# CORS - cross domain config
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Database configuration

# username = 'voiceapp'
# password = 'vcaPPas$!13123'
# userpass = 'mysql+pymysql://' + username + ':' + password + '@'
# server  = '127.0.0.1'
# dbname   = '/voiceapp'
#
# app.config['SQLALCHEMY_DATABASE_URI'] = userpass + server + dbname

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

app.config['CACHE_TYPE'] = "SimpleCache"  # Flask-Caching related configs
app.config['CACHE_DEFAULT_TIMEOUT'] = 3600

db = SQLAlchemy(app, query_class=CachingQuery)

cache = Cache(app)
