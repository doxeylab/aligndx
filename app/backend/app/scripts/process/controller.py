import os
import importlib

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
        self.commands = self.tool_instance.configure()
        self.post_process = self.tool_instance.post_process
        self.load_data = self.tool_instance.load_data
        