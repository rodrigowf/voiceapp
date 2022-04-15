from server import db, Speech, Action, Association
from core import calculate_vectors, vector2string

db.create_all()


# Phrases --------

spc1 = Speech(id=1, name='Acender Luz', phrase='acenda a luz, ligar luz, acenda a lampada', vector='', order=1)
spc2 = Speech(id=2, name='Apagar Luz', phrase='apague a luz, desligar luz, apague a lampada', vector='', order=2)
spc3 = Speech(id=3, name='Play', phrase='tocar música, play', vector='', order=3)
spc4 = Speech(id=4, name='Pause', phrase='pausar música, parar música, pause', vector='', order=4)
spc5 = Speech(id=5, name='Abrir Minha Playlis', phrase='tocar minha playlist, abrir playlist', vector='', order=5)
spc6 = Speech(id=6, name='Adicionar Comando', phrase='adicionar comando', vector='', order=6)
spc7 = Speech(id=7, name='Play Video', phrase='tocar video', vector='', order=7)
spc8 = Speech(id=8, name='Teste MQTT', phrase='testar mqtt', vector='', order=8)
spc9 = Speech(id=9, name='Teste Genérico', phrase='teste simples', vector='', order=9)
spc10 = Speech(id=10, name='Ligar TV', phrase='ligue a tv', vector='', order=10)

spc1.vector = vector2string(calculate_vectors(spc1.phrase))
spc2.vector = vector2string(calculate_vectors(spc2.phrase))
spc3.vector = vector2string(calculate_vectors(spc3.phrase))
spc4.vector = vector2string(calculate_vectors(spc4.phrase))
spc5.vector = vector2string(calculate_vectors(spc5.phrase))
spc6.vector = vector2string(calculate_vectors(spc6.phrase))
spc7.vector = vector2string(calculate_vectors(spc7.phrase))
spc8.vector = vector2string(calculate_vectors(spc8.phrase))
spc9.vector = vector2string(calculate_vectors(spc9.phrase))
spc10.vector = vector2string(calculate_vectors(spc10.phrase))


db.session.add(spc1)
db.session.add(spc2)
db.session.add(spc3)
db.session.add(spc4)
db.session.add(spc5)
db.session.add(spc6)
db.session.add(spc7)
db.session.add(spc8)
db.session.add(spc9)
db.session.add(spc10)


# Actions --------

act1 = Action(id=1, name='Lamp On', icon='', type='MQTT', target='/devices/onoff', value='L', order=1)
act2 = Action(id=2, name='Lamp Off', icon='', type='MQTT', target='/devices/onoff', value='D', order=2)
act3 = Action(id=3, name='Play/Pause Musica', icon='', type='HotKey', target='rhythmbox, youtube, vlc', value='space', order=3)
act4 = Action(id=4, name='Play video', icon='', type='HotKey', target='youtube', value='space', order=4)
act5 = Action(id=5, name='Abrir Musicas', icon='', type='Console', target='rythmbox', value='', order=5)
act6 = Action(id=6, name='Teste MQTT', icon='', type='MQTT', target='device1', value='teste mqtt!!', order=6)


db.session.add(act1)
db.session.add(act2)
db.session.add(act3)
db.session.add(act4)
db.session.add(act5)
db.session.add(act6)


# Associations -------

assoc1 = Association(id=1, speech_id=1, action_id=1, order=1)
assoc2 = Association(id=2, speech_id=2, action_id=2, order=2)
assoc3 = Association(id=3, speech_id=3, action_id=3, order=3)
assoc4 = Association(id=4, speech_id=4, action_id=3, order=4)
assoc5 = Association(id=5, speech_id=10, action_id=1, order=5)

db.session.add(assoc1)
db.session.add(assoc2)
db.session.add(assoc3)
db.session.add(assoc4)
db.session.add(assoc5)


# -----------------

db.session.commit()

print("============== DONE! ==============")