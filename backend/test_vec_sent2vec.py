from sent2vec.vectorizer import Vectorizer

sentences = [
    "ligar a luz",
    "desligar a luz",
    "acender luz",
]
vectorizer = Vectorizer(pretrained_weights='distilbert-base-multilingual-cased')
vectorizer.run(sentences)
vectors = vectorizer.vectors
print(vectors)

from scipy import spatial

dist_1 = spatial.distance.cosine(vectors[0], vectors[1])
dist_2 = spatial.distance.cosine(vectors[0], vectors[2])
print('dist_1: {0}, dist_2: {1}'.format(dist_1, dist_2))
assert dist_1 < dist_2
