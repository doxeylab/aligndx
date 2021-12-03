import axios from "axios";

const CHUNK_SIZE = 2e5;

const EMPTY_FILE_NOT_UPLOADED = "Empty file, not uploaded";

const upload = async (data) => {
  const res = await axios.post(UPLOAD_URL, data);

  return res;
};

const uploadChunk = (id, file) => {
  let reader = new FileReader();
  let chunk = file.file.slice(id * CHUNK_SIZE, (id + 1) * CHUNK_SIZE);

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = e.target.result;
      if (data) {
        compressChunk(data)
          .then((result) =>
            upload({ message: "chunk upload", id, data: result })
          )
          .then((res) => {
            resolve({ response: res });
          });
      } else {
        resolve({ response: EMPTY_FILE_NOT_UPLOADED });
      }
    };
    reader.readAsText(chunk);
  });
};

const compressChunk = async (data) => {
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

const uploadChunksWhileData = async (id, file, stateCallbacks) => {
  const res = await uploadChunk(id, file);
  stateCallbacks.setChunk(id, file, res);

  if (res.response != EMPTY_FILE_NOT_UPLOADED) {
    uploadChunksWhileData(id + 1, file, stateCallbacks);
  } else {
    stateCallbacks.fileComplete();
  }
};

const startFileUpload = async (file, stateCallbacks) => {
  const req = {
    message: "start file upload",
    file: file,
    numChunks: Math.ceil(file.file.size / CHUNK_SIZE),
  };

  const res = await upload(req);
  stateCallbacks.setFile(file, res);
};

const uploadFile = (file, stateCallbacks) => {
  await;

  await uploadChunksWhileData(0, file, stateCallbacks);
};

export default uploadFile;
