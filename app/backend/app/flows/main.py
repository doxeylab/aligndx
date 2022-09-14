from prefect import flow, task

@task(name="Generate metadata")
def create_metadata():
    """
    Create metadata for a new file upload. Called on the creation of an upload.
    *Note: To be stored in redis/postgres in the future ...
    :param file_dir: Complete path for the directory to store file data in.
    :param filename: The filename of the uploaded file.
    :param upload_chunk_size: Size (in kilobytes) of each chunk uploaded from the frontend.
    :param analysis_chunk_size: Size (in kilobytes) of each reassembled chunk to be analyzed by the tool.
    :param num_upload_chunks: Total number of upload chunks the file is divided into.
    :param email: Email of the user to notify on file completion.
    :param fileId: ID of the submission. Must be unique identifier.
    :param panel: Pathogen panel.
    :param process: Process for the analysis tool.
    """    
    pass

@flow
def chunking(
    name="Real Time Pipeline",
    descripton="Chunking pipeline for file assembly"
    ):
    pass

@flow
def main(
    name="Main Pipeline",
    descripton="Overall flow"
        ):
    print('testing')
    return 42