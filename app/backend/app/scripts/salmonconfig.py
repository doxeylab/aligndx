def commands(indexpath, filepath, resultspath, fastqtype="single"):
    """
    runs salmon selective quantify using given index file
    sample : sample name
    fastqtype: paired or single end fastq file
    indexpath : path for index file
    filepath: path for fastq file
    resultspath : path for results output
    """
    if fastqtype == "paired":
        command_list = [
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
                "1",
                "-o",
                resultspath,
            ]
        return command_list
    if fastqtype == "single":
        command_list = [
                "salmon",
                "quant",
                "-i",
                indexpath,
                "-l",
                "A",
                "-r",
                filepath,
                # "--seqBias",
                "--minAssignedFrags",
                "1",
                "-p",
                "1",
                "-o",
                resultspath,
            ] 
        return command_list
    else:
        return "Invalid fastqtype"
 