def linecount(sample):
    process = subprocess.Popen(["wc", "-l", sample], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    string = out.decode("utf-8")
    lines = int(string.split(" ")[0])
    return lines

def runsplit(sample, outputs):
    inputs = ["fastqsplitter", "-i", sample] 
    command = inputs + outputs 
    subprocess.call(command)

if __name__ == "__main__":
    '''
    splits files evenly among a set of chosen chunks
    '''  
    import sys    
    import subprocess  
    import os 
  
    CHUNK_FOLDER = 'chunks/' 

    if not os.path.isdir(CHUNK_FOLDER):
        os.mkdir(CHUNK_FOLDER)

    sample = sys.argv[1]
    extensions = sample.split(".")[1:] 
    if len(extensions) == 1:
        extension = extensions[0]
    else:
        extension = extensions[1]

    if not os.path.isdir(CHUNK_FOLDER):
        os.mkdir(CHUNK_FOLDER)

    reads = int(linecount(sample)/4)
    if reads < 1000000:
        chunk_size = 10000
    else:
        chunk_size = 100000  
    chunk = 1

    num_chunks = reads/chunk_size
    if type(num_chunks) != int: 
        # if odd number of reads, chunks returns the closest integer 
        # note that int rounds down
        even_num_chunks = int(num_chunks)
    
    chunks = []
    for i in range(1,even_num_chunks+1):
        chunks.append('-o')
        chunks.append(CHUNK_FOLDER+ 'chunk' + str(i) + '.fastq') 
    runsplit(sample, chunks)
     