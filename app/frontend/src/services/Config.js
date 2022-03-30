export const URL = process.env.REACT_APP_BACKEND_ACCESS_URL

// -- Uploads --
// -- Regular/legacy --
export const UPLOAD_URL = URL + "uploads/"
export const UPLOAD_CHUNK_URL = UPLOAD_URL + "upload-chunk" 

// -- Chunking --
export const START_FILE_URL = UPLOAD_URL + "start-file"
export const END_FILE_URL = UPLOAD_URL + "end-file" 

// -- Results --
// -- Regular/legacy --
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

export const WEBSOCKET_URL = "ws://aligndx.uwaterloo.ca:8080/livegraphs"
// export const WEBSOCKET_URL = "ws://localhost:8080/livegraphs"

// metadata
export const METADATA_URL = URL + "metadata/"
export const PANELS_URL = METADATA_URL + "panels"

// allowed filetypes
export const ALLOWED_FILETYPES = ".fastq, .fastq.gz"

// miscellaneous for now
export const CHUNK_SIZE = 8000000