import axios from "axios";
import {CHUNK_SIZE, UPLOAD_CHUNK_URL} from "../../services/Config";


const readChunk = (chunkNumber, file) => {
  let chunkFile = file.slice(
    chunkNumber * CHUNK_SIZE,
    (chunkNumber + 1) * CHUNK_SIZE
  );

  return chunkFile;
};

// upload-chunk
const postChunk = (resource, token, chunkNumber, fileId, chunkFile, panels) => {
  let formData = new FormData();
  formData.append("chunk_number", chunkNumber);
  formData.append("file_id", fileId);
  formData.append("chunk_file", chunkFile);
  formData.append("panels", panels);

  return axios.post(resource, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Content-Encoding": "gzip",
      "Authorization":`Bearer ${token}`
    },
  });
};


const startChunk = async (resource, token, chunkNumber, fileId, file, panels) => {
  let chunkFile = readChunk(chunkNumber, file);
  return await postChunk(resource, token, chunkNumber, fileId, chunkFile, panels);
};
 

const ChunkProcessor = async (token, file, panels, res) => {
  var upload_resource = UPLOAD_CHUNK_URL

  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = res.File_ID;
  
  if (res.Result == "Restart available") {
    
    let last_chunk_processed = res.Last_chunk_processed
    console.log(`Restarting at ${last_chunk_processed}`)

    for (let i = last_chunk_processed; i < numberOfChunks; i++) {
      const res = await startChunk(upload_resource, token, i, fileId, file, panels);
      if (res.data.Result != "OK") {
        break;
      }
    }
  }
  else {

    for (let i = 0; i < numberOfChunks; i++) {
      const res = await startChunk(upload_resource, token, i, fileId, file, panels);
      if (res.data.Result != "OK") {
        break;
      }
    }
  }


};

export default ChunkProcessor;