import axios from "axios";

import { CHUNK_SIZE, RL_FILE_URL, RL_CHUNK_URL } from "../../../services/Config";

const readChunk = (id, file) => {
  let reader = new FileReader();
  let chunk = file.slice(id * CHUNK_SIZE, (id + 1) * CHUNK_SIZE);

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = e.target.result;

      if (data) {
        resolve({
          chunkExists: true,
          chunkData: data,
        });
      } else {
        resolve({
          chunkExists: false,
          chunkData: null,
        });
      }
    };
    reader.readAsText(chunk);
  });
};

const compressChunk = (data) => {
  let enc = new TextEncoder();
  const encData = enc.encode(data);

  let input_buf = Module._malloc(encData.length * encData.BYTES_PER_ELEMENT);
  Module.HEAPU8.set(encData, input_buf);

  let output_buf = Module._malloc(encData.length * encData.BYTES_PER_ELEMENT);

  const size = Module.ccall(
    "compress",
    "number",
    ["number", "number"],
    [output_buf, input_buf]
  );
  Module._free(input_buf);

  const result = new TextDecoder().decode(
    Module.HEAPU8.subarray(output_buf, output_buf + size)
  );
  Module._free(output_buf);

  return result;
};

const postChunk = (id, data) => axios.post(RL_CHUNK_URL, { id, data });

const startChunk = async (id, file) => {
  let data = await readChunk(id, file);
  data = compressChunk(data);

  let res = await postChunk(id, data);
  return res;
};

const startChunksWhileExist = async (id, file) => {
  let data = await readChunk(id, file);

  if (!data) {
    return;
  }

  data = compressChunk(data);
  let res = await postChunk(id, data);

  startChunksWhileExist(id + 1, file);
  // return res;
};

const registerFile = (filename, numberOfChunks) =>
  axios.post(RL_FILE_URL, { filename, numberOfChunks });

const startFile = async (filename, file) => {
  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  await registerFile(filename, numberOfChunks);

  startChunksWhileExist(file);
};

export default startFile;
