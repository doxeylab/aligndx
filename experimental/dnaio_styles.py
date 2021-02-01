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
    # unique_kmers = (np.delete(np.unique(kmer_record),0))
    # return(unique_kmers)

    # return only unique kmers
    unique_kmers = np.unique(kmer_record)

    # make indexes for original order 
    indexes = np.unique(kmer_record, return_index=True)[1]

    # re-order sorted unique kmer list by original order
    seq_kmers = [kmer_record[index] for index in sorted(indexes)]
    # print(seq_kmers)
    # unique_kmers = (np.delete(np.unique(kmer_record, return_index=True),0))
    # print(np.sort(unique_kmers))

if __name__ == "__main__":
    '''
    Streams in files by chunks of four, parsing it and identifying kmers from kmer library
    ''' 
    import dnaio
    import sys
    import numpy as np   
    kmer_library = sliding_window(sys.argv[2], sys.argv[3])
    matches = 0  
    total_kmers = len(kmer_library)
    seq_compar_lib = {}
    with dnaio.open(sys.argv[1]) as f:
        for record in f:
            for kmer in kmer_library: 
                if kmer in record.sequence:
                    matches+= 1
                if matches >= (0.95 *total_kmers):
                    seq_compar_lib[record.name] = matches 
                    matches = 0 
                else:
                    continue  
            if len(seq_compar_lib) == 2:
                break
            else:
                continue
    print(seq_compar_lib)