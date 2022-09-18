import os 

def dir_generator(dirs):
    for dir in dirs:
        if not os.path.isdir(dir):
            os.mkdir(dir)