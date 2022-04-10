from server import db, Speech, Action, Association

db.create_all()




# Associations -------

assoc1 = Association(id=1, speech_id=1, action_id=4, order=1)
assoc2 = Association(id=2, speech_id=2, action_id=4, order=2)
assoc3 = Association(id=3, speech_id=3, action_id=1, order=5)
assoc4 = Association(id=4, speech_id=7, action_id=2, order=9)

assoc5 = Association(id=5, speech_id=8, action_id=12, order=3)
assoc6 = Association(id=6, speech_id=16, action_id=3, order=4)
assoc7 = Association(id=7, speech_id=17, action_id=13, order=6)
assoc8 = Association(id=8, speech_id=18, action_id=14, order=7)
assoc9 = Association(id=9, speech_id=19, action_id=15, order=8)

db.session.add(assoc1)
db.session.add(assoc2)
db.session.add(assoc3)
db.session.add(assoc4)

db.session.add(assoc5)
db.session.add(assoc6)
db.session.add(assoc7)
db.session.add(assoc8)
db.session.add(assoc9)


# -----------------

db.session.commit()
