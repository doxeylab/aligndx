import axios from "axios";
import { CHUNK_SIZE, START_FILE_URL } from "../../services/Config";

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

const StartFile = async (token, file, panels) => {

  var start_resource = START_FILE_URL

  const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE);
  const res = await postFileInitialize(start_resource, token, file.name, numberOfChunks, panels);
  
  return res;
};

export default StartFile;