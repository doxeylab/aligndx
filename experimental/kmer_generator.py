import sys
import numpy as np
 
def sliding_window(seq, k):
    '''
    Scans read using a sliding window of size k and appends them to an array until the last character in the read is reached 
    ''' 
    original_k_size =int(k)
    k_size = int(k)
    kmer_record = [] 
    o = 0
    sequence = ''
    with open(seq, 'r') as f:
        next(f)
        # skips identifier line
        for char in f:
            sequence = sequence + char 
    seq_wo_breaks = sequence.replace("\n","")  
    while o < len(seq_wo_breaks):
        kmer_record.append(seq_wo_breaks[o:k_size]) 
        o += original_k_size 
        k_size += original_k_size
    unique_kmers = (np.delete(np.unique(kmer_record),0))
    print(len(unique_kmers))
sliding_window(sys.argv[1], sys.argv[2])