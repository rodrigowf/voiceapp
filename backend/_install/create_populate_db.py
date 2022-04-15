from server import db, Speech, Action, Association

db.create_all()



# Phrases --------

light = Speech(id=1, name='Acender Luz', phrase='acenda a luz', vector='', order=1)
tvon = Speech(id=2, name='Ligar TV', phrase='liga a tv', vector='', order=2)
play = Speech(id=3, name='Play', phrase='tocar música', vector='', order=3)
vlc = Speech(id=4, name='Abrir Musicas', phrase='abrir musicas', vector='', order=4)
pause = Speech(id=5, name='Pause', phrase='pausar música', vector='', order=5)
com = Speech(id=6, name='Adicionar Comando', phrase='adicionar comando', vector='', order=6)
video = Speech(id=7, name='Play Video', phrase='tocar video', vector='', order=7)
mqtt = Speech(id=8, name='Teste MQTT', phrase='testar mqtt', vector='', order=8)
tst = Speech(id=9, name='Teste Genérico', phrase='teste simples', vector='', order=9)
lightoff = Speech(id=10, name='Apagar Luz', phrase='apague a luz', vector='', order=10)


db.session.add(light)
db.session.add(tvon)
db.session.add(play)
db.session.add(vlc)
db.session.add(pause)
db.session.add(com)
db.session.add(video)
db.session.add(mqtt)
db.session.add(tst)
db.session.add(lightoff)


# Actions --------

lightsOn = Action(id=1, name='Lamp On', icon='', type='MQTT', program='/devices/onoff', parameters='L', order=1)
lightsOff = Action(id=2, name='Lamp Off', icon='', type='MQTT', program='/devices/onoff', parameters='D', order=2)
vlcPlay = Action(id=3, name='Play Musica', icon='', type='HotKey', program='rythmbox', parameters='space', order=3)
chromePlay = Action(id=4, name='Play video', icon='', type='HotKey', program='youtube', parameters='space', order=4)
vlcOpen = Action(id=5, name='Abrir Musicas', icon='', type='Console', program='rythmbox', parameters='', order=5)
mqtTest = Action(id=6, name='Teste MQTT', icon='', type='MQTT', program='device1', parameters='teste mqtt!!', order=6)


db.session.add(lightsOn)
db.session.add(lightsOff)
db.session.add(vlcPlay)
db.session.add(chromePlay)
db.session.add(vlcOpen)
db.session.add(mqtTest)


# Associations -------

assoc1 = Association(id=1, speech_id=1, action_id=1, order=1)
assoc2 = Association(id=2, speech_id=10, action_id=2, order=2)
assoc3 = Association(id=3, speech_id=4, action_id=5, order=3)
assoc4 = Association(id=4, speech_id=3, action_id=3, order=4)

db.session.add(assoc1)
db.session.add(assoc2)
db.session.add(assoc3)
db.session.add(assoc4)


# -----------------

db.session.commit()
