import subprocess
from multiprocessing import Process

# salmon_path = './salmon/bin/salmon'


def sanity_check():
    subprocess.run(["salmon", "-h"])


def quantify(sample, indexpath, filepath, resultspath, fastqtype="single"):
    """
    runs salmon selective quantify using given index file
    sample : sample name
    fastqtype: paired or single end fastq file
    indexpath : path for index file
    filepath: path for fastq file
    resultspath : path for results output
    """
    if fastqtype == "paired":
        subprocess.run(
            [
                "salmon",
                "quant",
                "-i",
                indexpath,
                "-l",
                "A",
                "-1",
                filepath,
                "-2",
                filepath,
                " --validateMappings",
                "--seqBias",
                "--gcBias",
                "-p",
                "4",
                "-o",
                resultspath,
            ]
        )
    if fastqtype == "single":
        subprocess.run(
            [
                "salmon",
                "quant",
                "-i",
                indexpath,
                "-l",
                "A",
                "-r",
                filepath,
                "--seqBias",
                "--minAssignedFrags",
                "1",
                "-p",
                "4",
                "-o",
                resultspath,
            ]
        )
    else:
        return "Invalid fastqtype"


def runParallel(func, chunks, sample, indexpath, filepath, resultspath):
    proc = []
    for chunk in chunks:
        p = Process(target=func, args=(chunk, indexpath, filepath, resultspath))
        p.start()
    #     proc.append(p)
    # for p in proc:
    #     p.join()
