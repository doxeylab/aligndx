import os
import importlib

from app.scripts.process.output import Output
from app.scripts.process.analyze import Analyze

from app.config.settings import settings

AVAILABLE_TOOLS = settings.TOOLS

class Controller():
    def __init__(self, process, panel, chunk_number=None, in_dir=None, out_dir=None) -> None:
        self.process = process
        self.panel = panel
        self.chunk_number = chunk_number
        self.out_dir = out_dir
        self.in_dir = in_dir 
        
        self.chunk_dir = "{}/{}".format(self.out_dir, self.chunk_number)

        if chunk_number is not None:
            if not os.path.isdir(self.chunk_dir):
                print(f"creating {self.chunk_dir}")
                os.mkdir(self.chunk_dir)

        self.data_dir = os.path.join(self.out_dir, "data.json")

        self.tool = AVAILABLE_TOOLS[self.process]
        self.tool_class = getattr(importlib.import_module("app.scripts.process.tools." + self.tool + ".setup"),"Setup")
        self.tool_instance= self.tool_class(
                self.panel,
                self.chunk_number,
                self.in_dir,
                self.out_dir, 
                self.chunk_dir,
                self.data_dir
        )

        self.access_point = self.tool_instance.access_point
        self.commands = self.tool_instance.configure
        self.transform = self.tool_instance.transform
        self.data_loader = self.tool_instance.data_loader
        self.sum_header = self.tool_instance.sum_header
    
    def post_process(self):
        '''
        Performs some transformations on output data using tool parser (self.transform)
        '''
        data = Analyze(self.panel, self.out_dir, self.data_dir, self.transform, self.sum_header)
        data.accumulate()

    def load_data(self):
        '''
        Loads data from data.json using tool data_loader
        '''
        output = Output(self.data_dir, self.data_loader)
        return output.load() 