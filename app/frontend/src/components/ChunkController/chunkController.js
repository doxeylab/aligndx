import axios from "axios";
import { CHUNK_SIZE, UPLOAD_CHUNK_URL, START_FILE_URL } from "../../services/Config";


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

// start file
const postFileInitialize = (resource, token, filename, numberOfChunks, panels) =>
  axios.post(
    resource, {
    filename,
    number_of_chunks: numberOfChunks,
    panels,
    }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

const StartFile = async (token, file, panels, connectWebsocket) => {

  var upload_resource = UPLOAD_CHUNK_URL
  var start_resource = START_FILE_URL

  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const res = await postFileInitialize(start_resource, token, file.name, numberOfChunks, panels);
  const fileId = res.data.File_ID;
  await connectWebsocket(fileId, token)

  for (let i = 0; i < numberOfChunks; i++) {
    const res = await startChunk(upload_resource, token, i, fileId, file, panels);
    if (res.data.Result != "OK") {
      break;
    }
  }
};

export default StartFile;
