from app.scripts.process.tools.Salmon import Salmon

class Initialize():
    def __init__(self, process, panel, chunk_number, in_dir, out_dir) -> None:
        self.process = process
        self.panel = panel
        self.chunk_number = chunk_number
        self.out_dir = out_dir
        self.in_dir = in_dir

        if process == "rna-seq":
            salmon = Salmon.Setup(
                    self.panel, 
                    self.chunk_number,
                    self.in_dir,
                    self.out_dir
            )
            self.commands = salmon.configure()
            self.access_point = salmon.access_point
            self.post_process = salmon.post_process
        
        if process == "metagenomics":
            pass
    