import numpy as np

class Kmer:
    def __init__(self,  seq, k=3) -> None:
        '''
        Initiates the kmer class  with a k value (default 3) and a sequence. Within this class are methods for scanning a single read for kmers, 
        generating a kmer list, counting unique occurences to form a histogram in a dictionary

        '''
        self.k = k 
        self.seq = seq 
 
    def sliding_window(k, seq):
        '''
        Scans read using a sliding window of size k and appends them to an array until the last character in the read is reached

        '''
        kmer_record = []
        while k > len(seq):
            kmer_record.append(seq[:3]) 
        # Resets k value so we don't have to re-instantiate the class
        k = k 
            
    # def kmer_count(kmer_list): 
    #     '''
    #     Generates histogram of kmer frequencies for a sequence

    #     '''
    #     kmer_hist = {}
    #     for i in np.unique(kmer_list):
    #         kmer_hist[i] = kmer_list.count(i)
 