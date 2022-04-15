# python 3.6

from paho.mqtt import client as mqtt_client
from config import mqtt_broker, mqtt_port, mqtt_client_id, mqtt_password, mqtt_username


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(mqtt_client_id)
    # client.username_pw_set(mqtt_username, mqtt_password)
    client.on_connect = on_connect
    client.connect(mqtt_broker, mqtt_port)
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
