"""
SUPER INNEFFICIENT!!!
"""



def linecount(sample):
    process = subprocess.Popen(["wc", "-l", sample], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    string = out.decode("utf-8")
    lines = int(string.split(" ")[0])
    return lines

if __name__ == "__main__":
    '''
    Streams in files by chunks of four, parsing it and identifying kmers from kmer library
    ''' 
    import dnaio
    import sys    
    import subprocess 
    import io
    import os 
  
    CHUNK_FOLDER = './chunks/' 

    if not os.path.isdir(CHUNK_FOLDER):
        os.mkdir(CHUNK_FOLDER)
    reads = int(linecount(sys.argv[1])/4)
    chunk_size = 10000
    counter = 0 
    chunk = 1
    # print((reads))
    num_chunks = reads/chunk_size 
    if type(num_chunks) != int:
        even_num_chunks = int(num_chunks)
    
    with dnaio.open(sys.argv[1]) as f:
        for record in f:  
            if counter == chunk_size and chunk != even_num_chunks: 
                chunk+= 1 
                counter= 0

            if counter == 0:
                with io.open(os.path.join(CHUNK_FOLDER + "chunk_" + str(chunk) + ".fastq"), 'w') as new_f:
                # with io.open("chunk_" + str(chunk) + ".fastq", 'w') as new_f:
                    new_f.write("@" + record.name+"\n") 
                    new_f.write(record.sequence+"\n")
                    new_f.write("+" + record.name +"\n")
                    new_f.write(record.qualities+"\n")
                counter += 1 

            else: 
                with io.open(os.path.join(CHUNK_FOLDER + "chunk_" + str(chunk) + ".fastq"), 'w') as new_f:
                # with io.open("chunk_" + str(chunk) + ".fastq", 'w') as new_f:
                    new_f.write("@" + record.name+"\n")  
                    new_f.write(record.sequence+"\n")
                    new_f.write("+" + record.name +"\n")
                    new_f.write(record.qualities+"\n")
                counter += 1
    # print(counter)
    