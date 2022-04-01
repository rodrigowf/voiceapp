from server import db, Phrase, Action, Association

db.create_all()


# Phrases --------

light = Phrase(id=1, name='Acender Luz', phrase='acenda a luz', order=1)
tvon = Phrase(id=2, name='Ligar TV', phrase='liga a tv', order=2)
play = Phrase(id=3, name='Play', phrase='tocar música', order=3)
vlc = Phrase(id=4, name='Abrir VLC', phrase='abrir vlc', order=4)
pause = Phrase(id=5, name='Pause', phrase='pausar música', order=5)
com = Phrase(id=6, name='Adicionar Comando', phrase='adicionar comando', order=6)
video = Phrase(id=7, name='Play Video', phrase='tocar video', order=7)
mqtt = Phrase(id=8, name='Teste MQTT', phrase='testar mqtt', order=8)
tst = Phrase(id=9, name='Teste Genérico', phrase='teste simples', order=9)


db.session.add(light)
db.session.add(tvon)
db.session.add(play)
db.session.add(vlc)
db.session.add(pause)
db.session.add(com)
db.session.add(video)
db.session.add(mqtt)
db.session.add(tst)


# Actions --------

vlcPlay = Action(id=1, name='Play Musica', type='HotKey', program='vlc', parameters='space', order=1)
chromePlay = Action(id=2, name='Play video', type='HotKey', program='chrome', parameters='space', order=2)
vlcOpen = Action(id=3, name='Abrir VLC', type='Console', program='vlc', parameters='', order=3)
mqtTest = Action(id=4, name='Teste MQTT', type='MQTT', program='device1', parameters='teste mqtt!!', order=4)


db.session.add(vlcPlay)
db.session.add(chromePlay)
db.session.add(vlcOpen)
db.session.add(mqtTest)


# Associations -------

assoc1 = Association(id=1, phrase_id=1, action_id=4, order=1)
assoc2 = Association(id=2, phrase_id=2, action_id=4, order=2)
assoc3 = Association(id=3, phrase_id=3, action_id=1, order=3)
assoc4 = Association(id=4, phrase_id=7, action_id=2, order=4)
assoc5 = Association(id=5, phrase_id=4, action_id=3, order=5)

db.session.add(assoc1)
db.session.add(assoc2)
db.session.add(assoc3)
db.session.add(assoc4)
db.session.add(assoc5)


# -----------------

db.session.commit()
