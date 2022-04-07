import os

from app.celery.state.ChunkState import AnalysisChunkState


class FileIO:
    def __init__(self, file_dir):
        self.file_dir = file_dir

    def make_analysis_chunk(self, state: AnalysisChunkState, prev_state: AnalysisChunkState = None):
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
        lines = data.split(b'\n')

        # a single plus is always the 3rd whole line of a sequence
        first_plus_line = lines.index(b'+')
        # adding 2 modulo 4 then 4 to the line number would give us the first line of the next sequence
        sequence_start_line = ((first_plus_line + 2) % 4) + 4

        residual_data = b'\n'.join(lines[:sequence_start_line])
        chunk_data = b'\n'.join(lines[sequence_start_line:])

        return (residual_data, chunk_data)

    def assemble_chunk(self, chunk_number, upload_deps):
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
        with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}.fastq'), 'ab') as af:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq')) as rf:
                af.write(rf.read())
        os.remove(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq'))

    def write_residue(self, data, chunk_number, inplace=False):
        if inplace:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}.fastq'), 'ab') as af:
                af.write(data)
        else:
            with open(os.path.join(self.file_dir, 'tool_data', f'{chunk_number}_residue.fastq'), 'wb') as rf:
                rf.write(data)
