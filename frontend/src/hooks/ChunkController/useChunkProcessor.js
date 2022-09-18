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
  const uploadChunkRequest =  async (chunkNumber, fileId, chunkFile, file_extension) => {
    console.log(chunkNumber, fileId, chunkFile, file_extension)
    
    let formData = new FormData();
    formData.append("chunk_number", chunkNumber);
    formData.append("file_id", fileId);
    formData.append("chunk_file", chunkFile);
    formData.append("file_extension", file_extension);

    return await uploads.upload_chunk(formData)
  }; 

  const startChunk = async (chunkNumber, fileId, file) => {
    const file_extension = file.name.substring(file.name.indexOf('.') + 1)
    let chunkFile = readChunk(chunkNumber, file);
    return await uploadChunkRequest(chunkNumber, fileId, chunkFile, file_extension);
  };


  const chunkProcessor = async (file, fileId) => {
    const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
    let lastChunkUploaded = 0;

    if (localStorage.getItem(fileId + '_lastChunk')) {
      lastChunkUploaded = Number(localStorage.getItem(fileId + '_lastChunk')) + 1
    }
    console.log(lastChunkUploaded)

    for (let i = lastChunkUploaded; i < numberOfChunks; i++) {
      const res = await startChunk(i, fileId, file);
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