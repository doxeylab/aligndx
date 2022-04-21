from app.celery.state.ChunkState import AnalysisChunkState, UploadChunkState


class FileState:
    """
    Data model for a live file upload.
    
    Initialize with the file ID for identification and the number of
    upload chunks. The `upload_dependencies` parameter is a nested 
    list of chunk numbers, the index specifies an analysis chunk and
    the contents of each sublist specify the upload chunks it is 
    created from.
    """
    def __init__(self, file_id, num_upload_chunks, upload_dependencies):
        self.file_id = file_id

        self.upload_chunks = [UploadChunkState(
            i) for i in range(num_upload_chunks)]
        self.analysis_chunks = [AnalysisChunkState(
            i, upload_deps=deps) for i, deps in enumerate(upload_dependencies)]

        self.analysis_chunks[-1].set_status(residue_status='Not_Required')