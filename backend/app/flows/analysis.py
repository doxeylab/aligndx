from prefect import flow, task
from app.config.settings import settings
import requests 

class Kraken:
    _index_dir = settings.INDEX_FOLDER
    _kraken_db = settings.KRAKEN_DB
    _panel_meta = settings.PANELS

    def __init__(self, fpath, rpath) -> None:
        self.access_point = settings.ACCESS_POINTS['kraken2']
        self.fpath = fpath
        self.rpath = rpath
        self.report_name = "{}/{}".format(self.rpath, "report.txt")
        self.kraken_out =  "{}/{}".format(self.rpath, "kraken.out")
        self.braken_out =  "{}/{}".format(self.rpath, "braken.out")
        self.commands = self.configure()

    @property
    def configure(self) -> list:
        '''
        returns a command list for kraken using the generated parameters
        '''
      
        classification_lvl = "S"
        threshold_lvl= 0

        commands = self._generate_commands(settings.KRAKEN_DB, self.report_name, self.kraken_out, self.braken_out, classification_lvl, threshold_lvl, self.fpath)
        return commands

    def _generate_commands(self, krakendb, report_name, kraken_out, bracken_out, classification_lvl, threshold_lvl, in_name, in_name2 = None, fastqtype="single"):
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
                "&&",
                "bracken",
                "-d",
                krakendb,
                "-l",
                classification_lvl,
                "-t",
                threshold_lvl,
                "-i",
                report_name,
                "-o",
                bracken_out
            ] 

        return command_lst 

@task(name="Run Kraken2 and Bracken")
def run_kraken(fpath, rpath): 
    process = Kraken(fpath=fpath, rpath=rpath)
    resp = requests.post(process.access_point, json=process.commands)
    

@flow(name="Analysis Pipeline",
    description="Runs analysis pipeline on submission")
def analysis_pipeline(fpath, rpath):
    run_kraken(fpath, rpath)