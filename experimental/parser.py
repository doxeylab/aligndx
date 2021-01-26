kmer = "GAATCCAATCAGATT"

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
            if kmer in read["seq"]:
                reads.append(read)
                break 
            lines.clear() 
    if reads:
        print(reads)
        print("You have covid") 
    # cProfile.run('re.compile("parser.py")')