from thefuzz import fuzz
from Levenshtein import *

s1 = "asdfghjkl"
s2 = "asdffghjkl"

# s3 = "apaga a luz"
# s4 = "apagar luz"

def sim(s1, s2):
    lensum = (len(s1) + len(s2)) / 2
    print(lensum)
    ldist = distance(s1, s2)
    print(ldist)
    return (lensum - ldist) / lensum

print(sim(s1, s2))
print(ratio(s1, s2))
print(fuzz.token_sort_ratio(s1, s2))