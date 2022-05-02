import { CHUNK_SIZE } from "../../config/Settings";
import { useMutation } from 'react-query'
import { useUploads } from "../../api/Uploads";
import { useNavigate } from "react-router-dom";

const useChunkStarter = () => {
  const uploads = useUploads();
  const navigate = useNavigate();

  const initFile = ({
    file,
    panels,
    process, }
  ) => {
    const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
    return uploads.start_file({
      filename: file.name,
      number_of_chunks: numberOfChunks,
      panels: panels,
      process: process,
      file_size: file.size
    }
    )
  }

  const startfile = useMutation(initFile, {
    onSuccess: (data, variables) => {
      let fileId = data.data.File_ID
      navigate({
        pathname: "/live/#/?id=" + fileId,
        state: {
          file: variables.file,
          panels: variables.panels,
          fileId: fileId,
        }
      })
    },
    onError: (error) => {
      return error
    }
  })

  return { startfile }

};

export default useChunkStarter;