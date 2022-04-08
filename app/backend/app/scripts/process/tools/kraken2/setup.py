import os 

from app.config.settings import settings
import os
class Setup():
    _index_dir = settings.INDEX_FOLDER
    _kraken_db = settings.KRAKEN_DB

    def __init__(self, panel, chunk_number, in_dir, out_dir, chunk_dir, data_dir) -> None:
        self.panel = panel
        self.chunk_number = chunk_number
        self.in_dir = in_dir
        self.out_dir = out_dir
        self.chunk_dir = chunk_dir
        self.data_dir = data_dir

        self.access_point = settings.ACCESS_POINTS['kraken2'] 

    def configure(self) -> list:
        '''
        returns a command list for salmon using the generated parameters
        '''
        report_name = "{}/{}".format(self.chunk_dir, "report.txt")
        kraken_out =  "{}/{}".format(self.chunk_dir, "kraken.out")
        braken_out =  "{}/{}".format(self.chunk_dir, "braken.out")
        classification_lvl = "S"

        commands = self._generate_commands(settings.KRAKEN_DB, report_name, kraken_out, braken_out, classification_lvl, self.in_dir)
        return commands

    def _generate_commands(self, krakendb, report_name, kraken_out, bracken_out, classification_lvl, in_name, in_name2 = None, fastqtype="single"):
        """
        private method to generate command list
        """
        if fastqtype=="single":
            command_lst = [
                "kraken2",
                "--db",
                krakendb,
                "--report",
                report_name,
                "--output",
                kraken_out,
                in_name,
                ";",
                "bracken",
                "-d",
                krakendb,
                "-l",
                classification_lvl,
                "-i",
                report_name,
                "-o",
                bracken_out
            ] 

        return command_lst 
    
    def post_process(self):
        '''
        Performs some transformations on output data
        '''
        pass


    def load_data(self):
        '''
        Loads data 
        '''
        pass