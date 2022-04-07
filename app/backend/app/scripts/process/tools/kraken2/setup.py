import os 

from app.config.settings import settings

class Setup():
    _index_dir = settings.INDEX_FOLDER

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
        pass

    def _generate_commands(self):
        """
        private method to generate command list
        """
        pass
    
    def post_process(self):
        '''
        Performs some transformations on output data
        '''


    def load_data(self):
        '''
        Loads data 
        '''
        output = Output(self.data_dir)
        return output.load()
