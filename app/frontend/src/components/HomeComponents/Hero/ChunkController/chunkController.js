import axios from "axios";
// import { CHUNK_SIZE, START_FILE_URL, UPLOAD_CHUNK_URL } from "../config/Config";

// TEMP
const CHUNK_SIZE = 10000;
const START_FILE_URL = "temp";
const UPLOAD_CHUNK_URL = "temp"

const readChunk = (chunkNumber, file) => {
  let chunkFile = file.slice(
    chunkNumber * CHUNK_SIZE,
    (chunkNumber + 1) * CHUNK_SIZE
  );

  return chunkFile;
};

const postChunk = (chunkNumber, fileId, chunkFile, token) => {
  let formData = new FormData();
  formData.append("chunk_number", chunkNumber);
  formData.append("file_id", fileId);
  formData.append("chunk_file", chunkFile);
  formData.append("token", token);

  return axios.post(UPLOAD_CHUNK_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Content-Encoding": "gzip",
    },
  });
};

const startChunk = async (chunkNumber, fileId, file, token) => {
  let chunkFile = readChunk(chunkNumber, file);

  return await postChunk(chunkNumber, fileId, chunkFile, token);
};

const postFileProcess = (filename, numberOfChunks, token) =>
  axios.post(START_FILE_URL, {
    filename,
    number_of_chunks: numberOfChunks,
    token,
  });

const startFile = async (file, token) => {
  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const res = await postFileProcess(file.name, numberOfChunks, token);
  const fileId = res.data.File_ID;

  for (let i = 0; i < numberOfChunks; i++) {
    const res = await startChunk(i, fileId, file, token);
    if (res.data.Result != "OK") {
      break;
    }
  }
};

export default startFile;
