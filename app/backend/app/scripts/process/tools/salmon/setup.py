import os
from app.scripts.process.tools.salmon.analyze import Analyze
from app.scripts.process.tools.salmon.output import Output

from app.config.settings import settings

class Salmon():
    _index_dir = settings.INDEX_FOLDER

    def __init__(self, panel, chunk_number, in_dir, out_dir) -> None:
        self.panel = panel
        self.chunk_number = chunk_number
        self.in_dir = in_dir
        self.out_dir = out_dir
        self.chunk_dir = "{}/{}".format(self.out_dir, self.chunk_number)
        self.commands = []
        self.access_point = "http://salmon:80/"
        self.data_dir = os.path.join(self.out_dir, "data.json")

    def configure(self) -> list:
        '''
        returns a command list for salmon using the generated parameters
        '''
        indexpath = os.path.join(self._index_dir, self.panel + "_index")
        return self._generate_commands(indexpath, self.in_dir, self.chunk_dir)


    def _generate_commands(self, indexpath, in_dir, out_dir, fastqtype="single"):
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
                    in_dir,
                    "-2",
                    in_dir,
                    " --validateMappings",
                    "--seqBias",
                    "--gcBias",
                    "-p",
                    "1",
                    "-o",
                    out_dir,
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
                    in_dir,
                    # "--seqBias",
                    "--minAssignedFrags",
                    "1",
                    "-p",
                    "1",
                    "-o",
                    out_dir,
                ] 
            return command_list
        else:
            return "Invalid fastqtype"
    
    def post_process(self):
        '''
        Performs some transformations on quant data based on panel
        '''
        quant_dir = "{}/quant.sf".format(self.chunk_dir) 
        headers = ['Name', 'TPM']

        quant = Analyze(self.panel, quant_dir, headers, self.data_dir)
        quant.accumulate()

    def load_data(self):
        '''
        Loads data 
        '''
        output = Output(self.data_dir)
        return output.load()
