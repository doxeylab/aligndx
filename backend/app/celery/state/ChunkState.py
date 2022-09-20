class UploadChunkState:
    """ A data model specifying the state of an upload chunk. """
    def __init__(self, chunk_number):
        self.chunk_number = chunk_number
        self.status = 'Waiting'

    def set_status(self, status):
        """
        Set the chunk status. E.g. 'Uploaded' when the chunk
        is fully written.

        :param status: The chunk status string

        """
        self.status = status


class AnalysisChunkState:
    """ """
    def __init__(self, chunk_number, upload_deps):
        self.chunk_number = chunk_number
        self.upload_deps = upload_deps
        self.status = 'Waiting'
        self.residue_status = 'Waiting'

    def set_status(self, status=None, residue_status=None):
        """
        Set the chunk status for the chunk body, the chunk residue, or both.

        :param status: The chunk body status string (Default value = None)
        :param residue_status: The chunk residue status string (Default value = None)

        """
        if status is not None:
            self.status = status

        if residue_status is not None:
            self.residue_status = residue_status
