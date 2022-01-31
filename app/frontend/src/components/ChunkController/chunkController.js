import axios from "axios";
import { CHUNK_SIZE, UPLOAD_CHUNK_URL, START_FILE_URL} from "../../services/Config";
 

const readChunk = (chunkNumber, file) => {
  let chunkFile = file.slice(
    chunkNumber * CHUNK_SIZE,
    (chunkNumber + 1) * CHUNK_SIZE
  );

  return chunkFile;
};

const postChunk = (resource, chunkNumber, fileId, chunkFile, token, panel) => {
  let formData = new FormData();
  formData.append("chunk_number", chunkNumber);
  formData.append("file_id", fileId);
  formData.append("chunk_file", chunkFile);
  formData.append("token", token);
  formData.append("panel", panel);

  return axios.post(resource, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Content-Encoding": "gzip",
    },
  });
};
 

const startChunk = async (resource, chunkNumber, fileId, file, token, panel) => {
  let chunkFile = readChunk(chunkNumber, file); 
  return await postChunk(resource, chunkNumber, fileId, chunkFile, token, panel); 
};

const postFileProcess = (resource, filename, numberOfChunks, token, option, email) =>
  axios.post(resource, {
    filename,
    number_of_chunks: numberOfChunks,
    token,
    option,
    email
  });

const StartFile = async (file, token, panel, email, connectWebsocket) => { 

  var upload_resource = UPLOAD_CHUNK_URL
  var start_resource = START_FILE_URL  

  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const res = await postFileProcess(start_resource, file.name, numberOfChunks, token, panel, email); 
  const fileId = res.data.File_ID;  
  await connectWebsocket()
  
  for (let i = 0; i < numberOfChunks; i++) {
    const res = await startChunk(upload_resource, i, fileId, file, token, panel);
    if (res.data.Result != "OK") {
      break;
    } 
  }
};

export default StartFile;
