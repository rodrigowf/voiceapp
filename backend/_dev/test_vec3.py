from core import *
from collections import namedtuple

sent = ['testando arrays aleatoriamente']
vectorizer.run(sent)
vec = vectorizer.vectors
stri = vector2string(vec)
vect = string2vector(stri)

dist_1 = spatial.distance.cosine(vec, vect)

# dist_1 = spatial.distance.cosine(vect, vec)
# compare_vectors([{'vector':stri}], sent)
# compare_vectors([{'vector':stri}], sent[0])

dic = {'vector': stri, 'phrase': sent[0]}
tupl = namedtuple("Item", dic.keys())(*dic.values())

comp = compare_vectors([tupl], sent[0])

print(comp.phrase)

# import readline; print('\n'.join([str(readline.get_history_item(i + 1)) for i in range(readline.get_current_history_length())]))
