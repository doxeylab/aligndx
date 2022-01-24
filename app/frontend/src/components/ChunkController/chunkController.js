import axios from "axios";

import { CHUNK_SIZE, UPLOAD_CHUNK_URL, START_FILE_URL } from "../../services/Config";
 

const readChunk = (chunkNumber, file) => {
  let chunkFile = file.slice(
    chunkNumber * CHUNK_SIZE,
    (chunkNumber + 1) * CHUNK_SIZE
  );

  return chunkFile;
};

const postChunk = (chunkNumber, fileId, chunkFile, token, panel) => {
  let formData = new FormData();
  formData.append("chunk_number", chunkNumber);
  formData.append("file_id", fileId);
  formData.append("chunk_file", chunkFile);
  formData.append("token", token);
  formData.append("panel", panel);

  return axios.post(UPLOAD_CHUNK_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Content-Encoding": "gzip",
    },
  });
};
 

const startChunk = async (chunkNumber, fileId, file, token, panel) => {
  let chunkFile = readChunk(chunkNumber, file); 
  return await postChunk(chunkNumber, fileId, chunkFile, token, panel); 
};

const postFileProcess = (filename, numberOfChunks, token, option, email) =>
  axios.post(START_FILE_URL, {
    filename,
    number_of_chunks: numberOfChunks,
    token,
    option,
    email
  });

const startFile = async (file, token, panel, email, connectWebsocket) => {
  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const res = await postFileProcess(file.name, numberOfChunks, token, panel, email); 
  const fileId = res.data.File_ID;  
  await connectWebsocket()
  
  for (let i = 0; i < numberOfChunks; i++) {
    const res = await startChunk(i, fileId, file, token, panel);
    if (res.data.Result != "OK") {
      break;
    } 
  }
};

export default startFile;
