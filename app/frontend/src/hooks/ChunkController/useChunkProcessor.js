import { CHUNK_SIZE } from "../../config/Settings";
import { useUploads } from "../../api/Uploads";

const useChunkProcessor = () => {
  const uploads = useUploads();

  const readChunk = (chunkNumber, file) => {
    let chunkFile = file.slice(
      chunkNumber * CHUNK_SIZE,
      (chunkNumber + 1) * CHUNK_SIZE
    );

    return chunkFile;
  };

  // end-file
  const endRequest = (fileId) => {
    return uploads.end_file({file_id : fileId})

  } 

  // upload-chunk
  const uploadChunkRequest =  async (chunkNumber, fileId, chunkFile, panels) => {
    console.log(chunkNumber, fileId, chunkFile, panels)
    let formData = new FormData();
    formData.append("chunk_number", chunkNumber);
    formData.append("file_id", fileId);
    formData.append("chunk_file", chunkFile);
    formData.append("panels", panels);

    return await uploads.upload_chunk(formData)
  }; 

  const startChunk = async (chunkNumber, fileId, file, panels) => {
    let chunkFile = readChunk(chunkNumber, file);
    return await uploadChunkRequest(chunkNumber, fileId, chunkFile, panels);
  };


  const chunkProcessor = async (file, panels, fileId) => {
    const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
    let lastChunkUploaded = 0;

    if (localStorage.getItem(fileId + '_lastChunk')) {
      lastChunkUploaded = Number(localStorage.getItem(fileId + '_lastChunk')) + 1
    }
    console.log(lastChunkUploaded)

    for (let i = lastChunkUploaded; i < numberOfChunks; i++) {
      const res = await startChunk(i, fileId, file, panels);
      localStorage.setItem(fileId + '_lastChunk', i)
      if (res.data.Result != "OK") {
        break;
      }
    }
    await endRequest(fileId)
  };

  return {chunkProcessor}; 

}


export default useChunkProcessor;