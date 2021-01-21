matches = []

def kmermatch(seq):
    for sub in kmerlibrary:
        if sub in seq:
            matches.append(seq)
