import numpy as np 

ex_kmer = "GAATCCAATCAGATT"
def sliding_window(k, seq):
    '''
    Scans read using a sliding window of size k and appends them to an array until the last character in the read is reached
    '''
    kmer_record = []
    while k > len(seq):
        kmer_record.append(seq[:k]) 
    # Resets k value so we don't have to re-instantiate the class
    k = k 

def kmer_count(kmer_list): 
    '''
    Generates histogram of kmer frequencies for a sequence

    '''
    kmer_hist = {}
    for i in np.unique(kmer_list):
        kmer_hist[i] = kmer_list.count(i)

def fqformat(lines=None):
    format = ["id", 'seq','opt','qual']    
    return {key:value for key,value in zip(format,lines)}

if __name__ == "__main__":
    '''
    Streams in files by chunks of four, parsing it and identifying kmers from kmer library
    ''' 
    import fileinput  
    # import cProfile
    # import re
    lines = []
    reads = []
    for line in fileinput.input(): 
        lines.append(line.rstrip())
        if len(lines) % 4 == 0:
            read = fqformat(lines)
            if ex_kmer in read["seq"]:
                reads.append(read)
                break 
            lines.clear() 
    if reads:
        print(reads)
        print("You have covid") 
    # cProfile.run('re.compile("parser.py")')