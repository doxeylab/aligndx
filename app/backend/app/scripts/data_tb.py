import pandas as pd
import sys
import os
import json

sequences = {
    "lcl|NC_045512.2_cds_YP_009725255.1_12": "ORF10",
    "lcl|NC_045512.2_cds_YP_009724397.2_11": "nucleocapsid phosphoprotein",
    "lcl|NC_045512.2_cds_YP_009725295.1_2": "ORF1a",
    "lcl|NC_045512.2_cds_YP_009725318.1_9": "ORF7b",
    "lcl|NC_045512.2_cds_YP_009724389.1_1": "ORF1ab",
    "lcl|NC_045512.2_cds_YP_009724391.1_4": "ORF3a",
    "lcl|NC_045512.2_cds_YP_009724392.1_5": "envelope",
    "lcl|NC_045512.2_cds_YP_009724393.1_6": "membrane",
    "lcl|NC_045512.2_cds_YP_009724390.1_3": "surface",
    "lcl|NC_045512.2_cds_YP_009724394.1_7": "ORF6",
    "lcl|NC_045512.2_cds_YP_009724396.1_10": "ORF8",
    "lcl|NC_045512.2_cds_YP_009724395.1_8": "ORF7a",
}

host_biomarkers = {
    "ENST00000252519.7|ENSG00000130234.10|OTTHUMG00000193402.1|OTTHUMT00000055867.1|ACE2-201|ACE2|3393|protein_coding|": "ACE2",
    "ENST00000306602.2|ENSG00000169245.5|OTTHUMG00000160887.2|OTTHUMT00000362817.2|CXCL10-201|CXCL10|1176|protein_coding|": "CXCL10",
}


def producedataframe(path, category):
    data = pd.DataFrame([])
    df = pd.read_csv(path, sep="\s+", header=0, index_col=0)
    df.index.name = "Name"
    numreadsdf = df[category]
    # numreadsdf.columns = [root.split('/')[5]]
    data = pd.concat([data, numreadsdf], axis=1)
    # header = pd.MultiIndex.from_product([[category],data.columns])
    # data.columns = header
    data = data.rename(index=sequences)
    data = data.sort_index()
    return data


def ispositive(dataframe):
    bool_mask = dataframe[dataframe.columns].apply(lambda x: x > 0)
    for val in bool_mask[bool_mask.columns]:
        if True:
            return "Positive"
            break
        else:
            return "Negative"


def intojson(dataframe):
    result = dataframe.to_json(orient="table")
    parsed = json.loads(result)
    # final = json.dumps(parsed, indent=4)
    return parsed
