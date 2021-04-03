import sys    
import subprocess  
import os 
from pathlib import Path

def linecount(sample):
    '''
    Counts number of lines in the file
    sample: system input file
    '''
    process = subprocess.Popen(["wc", "-l", sample], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    string = out.decode("utf-8")
    lines = int(string.split(" ")[0])
    return lines

def runsplit(sample, outputs):
    '''
    Runs fastqsplitter tool over parameters
    sample: system input file
    outputs: array of chunk files
    '''
    inputs = ["fastqsplitter", "-i", sample] 
    command = inputs + outputs 
    subprocess.call(command)

def chunker(sample):
    '''
    splits files evenly among a set of chosen chunks
    '''  
    
    # create directory for chunks
    parentpath = Path(sample).parent
    CHUNK_FOLDER = str(parentpath) + '/chunks/' 

    if not os.path.isdir(CHUNK_FOLDER):
        os.mkdir(CHUNK_FOLDER)
    
    # get file extensions
    extensions = Path(sample).suffixes
    if len(extensions) == 1:
        extension = extensions[0]
    else:
        extension = extensions[0] + '.' + extensions[1]


    # Determines number of records in file
    reads = int(linecount(sample)/4)

    # chooses chunk size
    if reads < 1000000:
        chunk_size = 10000
    else:
        chunk_size = 100000  
         
    # declares number of chunks to generate
    num_chunks = reads/chunk_size
    if type(num_chunks) != int: 
        # if odd number of reads, chunks returns the closest integer 
        # note that int rounds down
        even_num_chunks = int(num_chunks)
    
    # list of chunks to generate using subprocess fqsplitter 
    chunks = []
    for i in range(1,even_num_chunks+1):
        chunks.append('-o')
        chunks.append(CHUNK_FOLDER+ 'chunk.' + str(i) + extension) 
    runsplit(sample, chunks)
 