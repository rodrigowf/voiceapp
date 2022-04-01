# -*- coding: utf-8 -*-

import os
import time
import flask
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy


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
