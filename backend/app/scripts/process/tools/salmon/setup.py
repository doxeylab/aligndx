import os
import pandas as pd
import numpy as np

from app.scripts.process.base import Base

from app.scripts.process.tools.salmon.meta import Meta

from app.config.settings import settings

class Setup(Base):
    _index_dir = settings.INDEX_FOLDER

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.sum_header = "Name"
        self.metadata = Meta(self.panel).load()

        self.headers = ['Name', 'TPM']
        self.quant = os.path.join(self.chunk_dir, "quant.sf")
        self.access_point = settings.ACCESS_POINTS['salmon'] 


    @property
    def configure(self) -> list:
        '''
        returns a command list for salmon using the generated parameters
        '''
        indexpath = os.path.join(self._index_dir, self.panel + "_index")
        return self._generate_commands(indexpath, self.in_dir, self.chunk_dir)


    def _generate_commands(self, indexpath, in_dir, out_dir, fastqtype="single"):
        """
        runs salmon selective quantify using given index file
        sample : sample name
        fastqtype: paired or single end fastq file
        indexpath : path for index file
        filepath: path for fastq file
        resultspath : path for results output
        """
        if fastqtype == "paired":
            command_list = [
                    "salmon",
                    "quant",
                    "-i",
                    indexpath,
                    "-l",
                    "A",
                    "-1",
                    in_dir,
                    "-2",
                    in_dir,
                    " --validateMappings",
                    "--seqBias",
                    "--gcBias",
                    "-p",
                    "1",
                    "-o",
                    out_dir,
                ]
            return command_list
        if fastqtype == "single":
            command_list = [
                    "salmon",
                    "quant",
                    "-i",
                    indexpath,
                    "-l",
                    "A",
                    "-r",
                    in_dir,
                    # "--seqBias",
                    "--minAssignedFrags",
                    "1",
                    "-p",
                    "1",
                    "-o",
                    out_dir,
                ] 
            return command_list
        else:
            return "Invalid fastqtype"


    def _coverage(self, df, header):
        '''
        Calculates coverage for given df
        '''
        hits = df.copy()
        
        hits = hits[hits[header] > 0] 

        all_count = df.groupby(['Pathogen'])['Gene'].apply(np.count_nonzero)
        hits_count = hits.groupby(['Pathogen'])['Gene'].apply(np.count_nonzero)
        coverage = np.round(hits_count.astype(np.double)/all_count.astype(np.double) * 100, decimals=2)
        coverage.fillna(0, inplace=True)
        
        return coverage.to_frame("Coverage")
    
    def transform(self):
        '''
        Reads in quant file and returns the resulting matches sorted by the loaded metadata panel 
        Parses tool output to return a dataframe
        '''
         # Read in quant.sf file into pandas, grab chosen headers and drop na values
        df = pd.read_csv(self.quant, sep="\t") 
        df = df.loc[:, df.columns.isin(self.headers)]  
        df = df.dropna()   

        df_list = []
        for col in self.metadata:

          # match samples to metadata to subset pathogen hits
          sample = df.copy()

          sample = sample[sample['Name'].isin(self.metadata[col])]
          sample = sample.dropna()       
          sample = sample.reset_index(drop=True)
          sample['Pathogen'] = col

          sample.rename(columns={"Name":"Gene"}, inplace=True)

          # sample.set_index("Pathogen", inplace=True)  

          # generate copy of pathogen results so it doesn't write over previous df
          new_df = sample.copy()  
          df_list.append(new_df)

        matches_df = pd.concat(df_list)  

        matches_df.set_index("Pathogen", inplace=True)
        matches_df['Coverage'] = self._coverage(matches_df, self.headers[1])
        matches_df.reset_index(inplace=True)

        return matches_df 
    
    def data_loader(self, df):
        '''
        Loads data for frontend given dataframe from data.json
        ''' 
        headers=['Gene', 'TPM']
        c = df.copy()
        c = c.groupby(["Pathogen","Coverage"]).count().drop(headers, axis=1)  
        c = c.index.to_frame(index=False)
        c = c.to_dict(orient="records")

        data = {
          "data": c,
          "title": "Transcriptome Coverage Estimate",
          "xlabel": "Pathogens",
          "ylabel": "Coverage (%)",
        }

        return data 