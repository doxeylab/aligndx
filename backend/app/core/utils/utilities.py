import os, time

def dir_generator(dirs_dict):
    for dir in dirs_dict.values():
        if not os.path.isdir(dir):
            os.makedirs(dir)

def wait_until(delegate, timeout: int, sleep: float):
    end = time.time() + timeout
    while time.time() < end:
        if delegate():
            break
        else:
            time.sleep(sleep)
 