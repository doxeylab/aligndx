import os 
import pandas as pd 

from app.scripts.process.base import Base

from app.config.settings import settings
import os
class Setup(Base):
    _index_dir = settings.INDEX_FOLDER
    _kraken_db = settings.KRAKEN_DB
    _panel_meta = settings.PANELS

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.sum_header = "Name"
        self.access_point = settings.ACCESS_POINTS['kraken2']
        
        self.report_name = "{}/{}".format(self.chunk_dir, "report.txt")
        self.kraken_out =  "{}/{}".format(self.chunk_dir, "kraken.out")
        self.braken_out =  "{}/{}".format(self.chunk_dir, "braken.out")

    @property
    def configure(self) -> list:
        '''
        returns a command list for salmon using the generated parameters
        '''
      
        classification_lvl = "S1"
        threshold_lvl= 0

        commands = self._generate_commands(settings.KRAKEN_DB, self.report_name, self.kraken_out, self.braken_out, classification_lvl, threshold_lvl, self.in_dir)
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

    def load_pathogens(self, panel):
        # grab meta on selected pathogen panel
        panel_metadata = pd.read_csv(self._panel_meta)
        pathogens = panel_metadata[panel_metadata[panel] == 'Y']['Name'].to_list() 
        return pathogens
        
    
    def transform(self):
        '''
        Parses tool output, performs some mutations and returns a dataframe
        '''
         # Read in quant.sf file into pandas, grab chosen headers and drop na values
        df = pd.read_csv(self.braken_out, sep="\t")
        pathogens = self.load_pathogens(self.panel)
        subset_df = df[df['name'].str.lower().isin([x.lstrip() for x in pathogens])]
        return subset_df

    
    def data_loader(self, df):
        '''
        Loads data for frontend given dataframe from data.json
        ''' 
        c = df.copy()
        c = c[['name', 'fraction_total_reads']]
        c.rename(columns={'name': 'Pathogen', 'fraction_total_reads': 'Coverage'}, inplace=True)
        c = c.to_dict(orient="records")

        data = {
          "data": c,
          "title": "Transcriptome Coverage Estimate",
          "xlabel": "Pathogens",
          "ylabel": "Coverage (%)",
        }

        return data 