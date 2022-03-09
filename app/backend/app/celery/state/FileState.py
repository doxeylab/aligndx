from app.celery.state.ChunkState import AnalysisChunkState, UploadChunkState


class FileState:
    def __init__(self, file_id, num_upload_chunks, upload_dependencies):
        self.file_id = file_id

        self.upload_chunks = [UploadChunkState(
            i) for i in range(num_upload_chunks)]
        self.analysis_chunks = [AnalysisChunkState(
            i, upload_deps=deps) for i, deps in enumerate(upload_dependencies)]

        self.analysis_chunks_processed = 0

    def update_chunks_processed(self, increment=1):
        self.analysis_chunks_processed += increment
