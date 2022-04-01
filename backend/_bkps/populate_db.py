from server import db, Command

light = Command(name='Acender Luz', phrase='acenda a luz')
tvon = Command(name='Ligar TV', phrase='liga a tv')
play = Command(name='Play', phrase='dê o play')

db.session.add(light)
db.session.add(tvon)
db.session.add(play)

db.session.commit()
