import os
import json
import pickle


class FileModel:
    def __init__(self, state, file_dir, file_id, filename, email, panel):
        self.state = state
        self.file_id = file_id
        self.file_dir = file_dir
        self.filename = filename
        self.email = email
        self.panel = panel

    @classmethod
    def load(cls, file_dir):
        with open(os.path.join(file_dir, 'meta.pkl'), 'rb') as f:
            model = pickle.load(f)
        return model

    def write(self):
        with open(os.path.join(self.file_dir, 'meta.pkl'), 'wb') as f:
            pickle.dump(self, f)

        with open(os.path.join(self.file_dir, 'meta.json'), 'w') as f:
            json.dump(self, f, default=lambda o: o.__dict__, indent=4)
