export const URL = process.env.REACT_APP_BACKEND_ACCESS_URL

// -- Uploads --
// -- Regular --
export const UPLOAD_URL = URL + "uploads/"
export const UPLOAD_CHUNK_URL = UPLOAD_URL + "upload-chunk" 
export const START_FILE_URL = UPLOAD_URL + "start-file" 

// -- Results --
// -- Regular --
export const RESULT_URL = URL + "results/"
export const STANDARD_RESULTS = RESULT_URL + "standard/"
export const STANDARD_SUBMISSIONS_URL = URL + "submissions" 

// -- Users --
const USERS = URL + "users/"
// const USERS = URL
export const LOGIN_URL = USERS + "token"
export const SIGNUP_URL = USERS + "create_user"
export const ACCESS_TOKEN_URL = USERS + "me" 

// miscellaneous for now
export const CHUNK_SIZE = 800000
// export const WEBSOCKET_URL = "ws://aligndx.uwaterloo.ca:8080/livegraphs"
export const WEBSOCKET_URL = "ws://localhost:8080/livegraphs"

// metadata
export const METADATA_URL = URL + "metadata/"
export const PANELS_URL = METADATA_URL + "panels"

// allowed filetypes
export const ALLOWED_FILETYPES = ".fastq, .fastq.gz"