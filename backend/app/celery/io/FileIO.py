import os

from app.celery.state.ChunkState import AnalysisChunkState


class FileIO:
    """
    Class with chunk assembly features for a file.

    This class will handle the assembly of larger analysis chunks
    (optimzed for tool) from smaller upload chunks (optimized for
    upload).

    When an object of this class is initialized, it creates a
    dependency tree specifying the composition of each analysis
    chunk, which it then uses to assemble them when they are ready.
    """
    def __init__(self, file_dir):
        self.file_dir = file_dir

    def make_analysis_chunk(self, state: AnalysisChunkState, prev_state: AnalysisChunkState = None):
        """
        Assemble an analysis chunk of appropriate size from its constituent uploads.

        The state of the previous analysis chunk is needed because the head of the
        current chunk contains data that is to be appended to the previous chunk
        to ensure records are whole in each file.

        :param state: AnalysisChunkState: State of the analysis chunk that is ready to assemble.
        :param prev_state: AnalysisChunkState: State of the previous analysis chunk i.e. 1 chunk number behind (Default value = None)

        """
        residue = self.assemble_chunk(state.chunk_number, state.upload_deps)

        if state.residue_status == 'Written':
            self.merge_residue(residue, state.chunk_number)
            state.set_status('Ready', residue_status='Merged')
        elif state.residue_status == 'Not_Required':
            state.set_status('Ready')
        else:
            state.set_status('Residue_Remaining')

        if prev_state is not None:
            self.write_residue(residue,
                               prev_state.chunk_number,
                               inplace=prev_state.status == 'Residue_Remaining')

            if prev_state.status == 'Residue_Remaining':
                prev_state.set_status('Ready', residue_status='Merged')
            else:
                prev_state.set_status(residue_status='Written')

    def divide_residue(self, data):
        """
        Divide a 'raw' analysis chunk into 'residue' and 'body' parts. The residue
        consists of data to be appended into the previous analysis chunk to ensure 
        that only complete records exist in both files.

        The method checks for patterns in the first character of each line in the file
        to check the beginning of the first complete record in the file, dividing the
        chunk at that point.

        :param data: Binary data in the analysis chunk.

        """
        lines = data.split(b'\n')
        
        # lines within which to check for a consistent FASTQ-like pattern
        lines_bufsize = 64
        lines_buf = lines[:lines_bufsize]

        # function to check that all 1st lines start with @ and all third lines start with +
        def is_fastq_like(buf):
            """

            :param buf: buffer data with one or more initial lines removed

            """
            for i, line in enumerate(buf):
                if i % 4 == 0:
                    if not line.startswith(b'@'):
                        return False
                if i % 4 == 2:
                    if not line.startswith(b'+'):
                        return False
            return True

        # iterate from 0..4, checking for a pattern of 2-spaced lines starting with @ and +
        for start in range(4, 8):
            if is_fastq_like(lines_buf[start:]):
                sequence_start_line = start
        
        residual_data = b'\n'.join(lines[:sequence_start_line])
        chunk_data = b'\n'.join(lines[sequence_start_line:])

        return (residual_data, chunk_data)

    def assemble_chunk(self, chunk_number, upload_deps):
        """
        Write an analysis chunk from its constituent upload chunks.

        Returns residual data which has to be appended to the previous chunk.

        :param chunk_number: The chunk number of the analysis chunk to assemble.
        :param upload_deps: A list of upload chunk numbers to write the chunk from.

        """
        with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}.fastq'), 'wb') as af:
            for relative_num, upload_chunk_num in enumerate(upload_deps):
                upload_chunk_fname = os.path.join(
                    self.file_dir, 'upload_data', f'{upload_chunk_num}.fastq')
                with open(upload_chunk_fname, 'rb') as uf:
                    if relative_num == 0:
                        residual_data, data = self.divide_residue(uf.read())
                    else:
                        data = uf.read()
                    af.write(data)

                os.remove(upload_chunk_fname)
        return residual_data

    def merge_residue(self, data, chunk_number):
        """
        Merges the residue file of an analysis chunk to its body file.
        
        The residue is written into a file when the body is not yet ready, to
        be merged later, so call this method when both body and a separate
        residue file are ready.

        :param data: Deprecated
        :param chunk_number: Chunk number of analysis chunk to merge

        """
        with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}.fastq'), 'ab') as af:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq')) as rf:
                af.write(rf.read())
        os.remove(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq'))

    def write_residue(self, data, chunk_number, inplace=False):
        """
        Writes residue data into a chunk.

        The residue data is written into the chunk directly if `inplace` is true,
        else, it is written into a separate file named `n_residue.fastq`. Set
        `inplace` to true if, for example, the body is not ready and cannot be
        merged into the residue yet.

        :param data: The residue data to be written
        :param chunk_number: The chunk number of the chunk which has the residue
        :param inplace: Whether to write directly to the chunk file (Default value = False)

        """
        if inplace:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}.fastq'), 'ab') as af:
                af.write(data)
        else:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq'), 'wb') as rf:
                rf.write(data)
