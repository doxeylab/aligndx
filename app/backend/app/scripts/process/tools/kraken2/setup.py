import os 

from app.config.settings import settings

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
        commands = self._generate_commands()
        return commands

    def _generate_commands(self, krakendb, report_name, out_name, in_name, in_name2 = None, fastqtype="single"):
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
                out_name,
                in_name,
            ]
        if fastqtype == "paired":
            command_lst = [
                "kraken2",
                "--db",
                krakendb,
                "--paired",
                "--report",
                report_name,
                "--output",
                out_name,
                in_name,
                in_name2
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