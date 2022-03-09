class UploadChunkState:
    def __init__(self, chunk_number):
        self.chunk_number = chunk_number
        self.status = 'Waiting'

    def set_status(self, status):
        self.status = status


class AnalysisChunkState:
    def __init__(self, chunk_number, upload_deps):
        self.chunk_number = chunk_number
        self.upload_deps = upload_deps
        self.status = 'Waiting'
        self.residue_status = 'Waiting'

    def set_status(self, status=None, residue_status=None):
        if status is not None:
            self.status = status

        if residue_status is not None:
            self.residue_status = residue_status
