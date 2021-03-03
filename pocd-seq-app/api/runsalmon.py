import subprocess 

def sanity_check():
    return 'yea it works'

def quantify(sample, fastqtype, indexpath, filepath, resultspath):
    '''
    runs salmon selective quantify using given index file
    sample : sample name 
    fastqtype: paired or single end fastq file
    indexpath : path for index file
    filepath: path for fastq file
    resultspath : path for results output
    '''
    if fastqtype == 'paired':
        subprocess.check_call(['salmon', 'quant', 'i', indexpath, '-l', 'A', \
            '-1', filepath,\
                '-2', filepath,\
                    ' --validateMappings', \
                        '--seqBias', \
                            '--gcBias', \
                                '-p', '4'\
                                    '-o',\
                                        resultspath + sample
            ])
    if fastqtype == 'single':
        subprocess.check_call(['salmon', 'quant', 'i', indexpath, '-l', 'A', \
            '-r', filepath,\
                ' --validateMappings', \
                    '--seqBias', \
                        '--gcBias', \
                            '-p', '4'\
                                '-o',\
                                    resultspath + sample
            ])
    else:
        return 'Invalid fastqtype'
