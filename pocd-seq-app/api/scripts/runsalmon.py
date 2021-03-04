import subprocess 
salmon_path = './salmon/bin/salmon'

def sanity_check():
    subprocess.run([salmon_path, '-h'])

def quantify(sample, indexpath, filepath, resultspath, fastqtype='single',):
    '''
    runs salmon selective quantify using given index file
    sample : sample name 
    fastqtype: paired or single end fastq file
    indexpath : path for index file
    filepath: path for fastq file
    resultspath : path for results output
    '''
    if fastqtype == 'paired':
        subprocess.run([salmon_path, 'quant', '-i', indexpath, '-l', 'A', \
            '-1', filepath,\
                '-2', filepath,\
                    ' --validateMappings', \
                        '--seqBias', \
                            '--gcBias', \
                                '-p', '4',\
                                    '-o',\
                                        resultspath + sample
            ])
    if fastqtype == 'single':
        subprocess.run([salmon_path, 'quant', '-i', indexpath, '-l', 'A', \
            '-r', filepath,\
                    '--seqBias', \
                        '--gcBias', \
                            '-p', '4',\
                                '-o',\
                                    resultspath
            ])
    else:
        return 'Invalid fastqtype'
 