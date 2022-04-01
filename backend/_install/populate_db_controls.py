from server import db, Control

db.create_all()

vlcPlay = Control(name='Play Musica', type=2, program='vlc', parameters='space')
chromePlay = Control(name='Play video', type=2, program='chrome', parameters='space')

db.session.add(vlcPlay)
db.session.add(chromePlay)

db.session.commit()
