import seaborn as sns
import matplotlib.pyplot as plt

def heatmap(dataframe, path, sample, category): 
    # fig, ax = plt.subplots(figsize=(40,25)) 
    figure = sns.heatmap(dataframe,cmap="RdBu_r").set(title= (category + ' for sample ' + sample), xlabel='Sample', ylabel='Coding Sequences')
    plt.savefig(path + sample + '_heatmap.png')

def highlight_hits(s):
    is_hit = s == s.max()
    return ['background-color: blue' if m else '' for m in is_hit]

def table(dataframe, path, sample):
    fig, ax = plt.subplots(figsize=(12, 3)) 
    # # no axes
    # ax.xaxis.set_visible(False)  
    # ax.yaxis.set_visible(False)  
    # # no frame
    # ax.set_frame_on(False)  
    # plot table
    tab = table(ax, dataframe)  
    # set font manually
    tab.auto_set_font_size(False)
    tab.set_fontsize(8) 
    # highlight results
    dataframe.style.apply(highlight_hits)
    # save the result
    plt.savefig(path + sample + '_table.png')