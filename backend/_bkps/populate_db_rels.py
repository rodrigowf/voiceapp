from server import db, Relation

vlcPlay = Relation(command_id=3, control_id=1)
chromePlay = Relation(command_id=9, control_id=2)

db.session.add(vlcPlay)
db.session.add(chromePlay)

db.session.commit()
