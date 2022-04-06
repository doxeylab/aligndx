from app.scripts.process.tools.salmon.setup import Salmon

class Controller():
    def __init__(self, process, panel, chunk_number=None, in_dir=None, out_dir=None) -> None:
        self.process = process
        self.panel = panel
        self.chunk_number = chunk_number
        self.out_dir = out_dir
        self.in_dir = in_dir 

        if process == "rna-seq":
            salmon = Salmon(
                    self.panel, 
                    self.chunk_number,
                    self.in_dir,
                    self.out_dir 
            )
            self.commands = salmon.configure()
            self.access_point = salmon.access_point
            self.post_process = salmon.post_process
            self.load_data = salmon.load_data
        
        if process == "metagenomics":
            pass
    