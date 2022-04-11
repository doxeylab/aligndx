import math

from app.celery.model.FileModel import FileModel
from app.celery.state.FileState import FileState
from app.celery.io.FileIO import FileIO


class File:
    def __init__(self, file_id, file_dir, filename, email, panel, process, state=None, chunk_ratio=None, num_upload_chunks=None):
        self.file_id = file_id
        self.file_dir = file_dir
        self.filename = filename
        self.email = email
        self.panel = panel
        self.process = process

        if state is None:
            num_analysis_chunks = math.ceil(num_upload_chunks / chunk_ratio)

            upload_chunks_deps = []
            for i in range(1, num_analysis_chunks + 1):
                start_chunk = math.ceil((i-1) * chunk_ratio)
                end_chunk = math.ceil(i * chunk_ratio)

                if i == num_analysis_chunks:
                    end_chunk = num_upload_chunks

                upload_chunks_deps.append(list(range(start_chunk, end_chunk)))

            self.state = FileState(
                file_id, num_upload_chunks, upload_chunks_deps)
        else:
            self.state = state

        self.io = FileIO(file_dir)

    @classmethod
    def load(cls, file_dir):
        model = FileModel.load(file_dir)

        file = File(model.file_id, file_dir, model.filename,
                    model.email, model.panel, model.process, model.state)

        return file

    def process_upload(self, chunk_number):
        self.state.upload_chunks[chunk_number].set_status('Uploaded')

        for indx, chunk in enumerate(self.state.analysis_chunks):
            if chunk.status == 'Waiting' and\
                all([self.state.upload_chunks[i].status == 'Uploaded' for
                     i in chunk.upload_deps]):
                prev_chunk = self.state.analysis_chunks[indx -
                                                        1] if indx > 0 else None
                
                self.io.make_analysis_chunk(chunk, prev_chunk)

        self.save()

    def set_analysis_state(self, chunk_number, status):
        analysis_chunk = self.state.analysis_chunks[chunk_number]
        analysis_chunk.set_status(status)
        
        self.save()

    def set_start_chunk_analysis(self, chunk_number):
        self.set_analysis_state(chunk_number, 'Analyzing')

    def set_complete_chunk_analysis(self, chunk_number):
        self.set_analysis_state(chunk_number, 'Complete')

    def set_analysis_error(self, chunk_number):
        self.set_analysis_state(chunk_number, 'Analysis_Error')

    def save(self):
        model = FileModel(self.state, self.file_dir,
                          self.file_id, self.filename, self.email, self.panel, self.process)
        model.write()
