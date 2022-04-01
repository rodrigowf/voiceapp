# python 3.6

import random
import time
from paho.mqtt import client as mqtt_client


broker = 'localhost'
port = 1883
#topic = "python/mqtt"
# generate client ID with pub prefix randomly
client_id = f'voiceapp-mqtt-{random.randint(0, 1000)}'

username = 'werneck'
password = 'public'


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    # client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    client.loop_start()
    return client


def publish(topic, msg):
    result = client.publish(topic, msg)
    status = result[0] # result: [0, 1]
    if status == 0:
        print(f"Send `{msg}` to topic `{topic}`")
        return True
    else:
        print(f"Failed to send message to topic {topic}")
        return False


client = connect_mqtt()
