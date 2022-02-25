import axios from "axios";
import {CHUNK_SIZE, END_FILE_URL, UPLOAD_CHUNK_URL} from "../../services/Config";


const readChunk = (chunkNumber, file) => {
  let chunkFile = file.slice(
    chunkNumber * CHUNK_SIZE,
    (chunkNumber + 1) * CHUNK_SIZE
  );

  return chunkFile;
};

// end-file
const postEndFile = (resource, token, fileId) => {
  return axios.post(resource, {
    file_id: fileId,
  }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

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
 

const ChunkProcessor = async (token, file, panels, res, fileId) => {
  var upload_resource = UPLOAD_CHUNK_URL

  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  let lastChunkProcessed = 0;
  
  if (fileId) {
    lastChunkProcessed = localStorage.getItem(fileId + '_lastChunk')
  } else {
    fileId = res.File_ID;
  }
  
  for (let i = lastChunkProcessed + 1; i < numberOfChunks; i++) {
    const res = await startChunk(upload_resource, token, i, fileId, file, panels);
    localStorage.setItem(fileId + '_lastChunk', i)
    if (res.data.Result != "OK") {
      break;
    }
  }

  await postEndFile(END_FILE_URL, token, fileId)
};

export default ChunkProcessor;