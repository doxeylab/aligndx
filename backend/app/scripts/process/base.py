import abc

class Base(metaclass=abc.ABCMeta):
    '''
    Base setup class for tools, used to mock functions and initialize variablesy
    '''

    def __init__(self, panel, chunk_number, in_dir, out_dir, chunk_dir, data_dir) -> None:
        self.panel = panel
        self.chunk_number = chunk_number
        self.in_dir = in_dir
        self.out_dir = out_dir
        self.chunk_dir = chunk_dir
        self.data_dir = data_dir

    @property
    @abc.abstractmethod
    def configure(self) -> list:
        '''
        returns a command list for tool using the generated parameters
        '''
        ... 
    
    @abc.abstractmethod
    def transform(self):
        '''
        Parses tool output to return a dataframe
        '''
        ...

    @abc.abstractmethod    
    def data_loader(self, df):
        '''
        Loads data for frontend given dataframe from data.json
        ''' 
        ... 