def kmer_generator(seq,k):
    original_k_size =int(k)
    k_size = int(k)
    kmer_record = [] 
    o = 0
    while o < len(seq): 
        kmer_record.append(seq[o:k_size]) 
        o += original_k_size 
        k_size += original_k_size  

    # return only unique kmers
    unique_kmers = np.unique(kmer_record)

    # make indexes for original order 
    indexes = np.unique(kmer_record, return_index=True)[1]

    # re-order sorted unique kmer list by original order
    seq_kmers = [kmer_record[index] for index in sorted(indexes)] 
    return seq_kmers


def sliding_window(seq, k):
    '''
    Scans read using a sliding window of size k and appends them to an array until the last character in the read is reached 
    ''' 
    sequence = ''

    with open(seq, 'r') as f:
        next(f)
        # skips identifier line
        for char in f:
            sequence = sequence + char 
    seq_wo_breaks = sequence.replace("\n","")  

    return kmer_generator(seq_wo_breaks,k)
    # print(kmer_library)

# sliding_window(sys.argv[1],sys.argv[2])



if __name__ == "__main__":
    '''
    Streams in files by chunks of four, parsing it and identifying kmers from kmer library
    ''' 
    import dnaio
    import sys
    import numpy as np   
    import Levenshtein as lv
    kmer_library = sliding_window(sys.argv[2], sys.argv[3])
    matches = 0   
    seq_compar_lib = {}
    with dnaio.open(sys.argv[1]) as f:
        for record in f:
            if matches ==2:
                break
            else:
                matches +=1 
                quer_lib = kmer_generator(record.sequence,sys.argv[3]) 
                for query, kmer in zip(quer_lib,kmer_library):
                    print(query,kmer)
                # if lv.distance(kmer,record.sequence) <= 2:
                     
    print(seq_compar_lib)

  