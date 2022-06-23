import random
import flask
from flask import request
from init import app, db, cache


server_ip = '192.168.0.110'
server_port = 8000
server_debug = True

mqtt_broker = 'localhost'
mqtt_port = 1883
mqtt_client_id = f'voiceapp-mqtt-{random.randint(0, 1000)}'  # generate client ID with pub prefix randomly
mqtt_username = ''
mqtt_password = ''

string_comparison_mode = 'str2vec'  # 'words', 'fuzz', 'str2vec'

detection_keyword = 'computador'
detection_silence_interval = 2300

external_host = 'http://192.168.0.110'


@app.route('/get_configs')
def get_configs():
    return flask.jsonify({
        'result': 'success',

        'server_ip': server_ip,
        'server_port': server_port,
        'server_debug': server_debug,

        'mqtt_broker': mqtt_broker,
        'mqtt_port': mqtt_port,
        'mqtt_client_id': mqtt_client_id,
        'mqtt_username': mqtt_username,
        'mqtt_password': mqtt_password,

        'string_comparison_mode': string_comparison_mode,

        'detection_keyword': detection_keyword,
        'detection_silence_interval': detection_silence_interval
    })


@app.route('/set_configs', methods=['GET', 'POST'])
def set_configs():
    if request.method == 'POST':
        global server_ip
        global server_port
        global server_debug

        global mqtt_broker
        global mqtt_port
        global mqtt_client_id
        global mqtt_username
        global mqtt_password

        global string_comparison_mode
        global detection_keyword
        global detection_silence_interval

        server_ip = request.json['server_ip']
        server_port = request.json['server_port']
        server_debug = request.json['server_debug']

        mqtt_broker = request.json['mqtt_broker']
        mqtt_port = request.json['mqtt_port']
        mqtt_client_id = request.json['mqtt_client_id']
        mqtt_username = request.json['mqtt_username']
        mqtt_password = request.json['mqtt_password']

        string_comparison_mode = request.json['string_comparison_mode']
        detection_keyword = request.json['detection_keyword']
        detection_silence_interval = request.json['detection_silence_interval']

        return flask.jsonify({'result': 'success'})
    else:
        return flask.jsonify({'result': 'error'})
