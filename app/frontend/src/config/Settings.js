const URL = process.env.REACT_APP_BACKEND_ACCESS_URL

// -- Uploads --
export const UPLOAD_URL = URL + "uploads/"
export const UPLOAD_CHUNK_URL = UPLOAD_URL + "upload-chunk" 

// -- Chunking --
export const START_FILE_URL = UPLOAD_URL + "start-file"
export const END_FILE_URL = UPLOAD_URL + "end-file" 

// -- Results --
export const RESULT_URL = URL + "results/"
export const STANDARD_RESULTS = RESULT_URL + "standard/"

// -- chunking --
export const CHUNKED_RESULTS = URL + "chunked"

// -- Users --
const USERS = URL + "users/"
export const LOGIN_URL = USERS + "token"
export const SIGNUP_URL = USERS + "create_user"
export const ACCESS_TOKEN_URL = USERS + "me" 
export const STANDARD_SUBMISSIONS_URL = USERS + "submissions" 
export const INCOMPLETE_URL = USERS + "incomplete"
export const LINKED_RESULTS = USERS + "linked_results/"

const base_ws_url = "ws"
const socket_url = URL + "livegraphs"
export const WEBSOCKET_URL = socket_url.replace(/http/, base_ws_url)

// metadata
export const METADATA_URL = URL + "metadata/"
export const PANELS_URL = METADATA_URL + "panels"

// allowed filetypes
export const ALLOWED_FILETYPES = ".fastq, .fastq.gz"

// miscellaneous for now
export const CHUNK_SIZE = 8000000