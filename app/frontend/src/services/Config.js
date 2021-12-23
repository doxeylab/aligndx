// export const UPLOAD_URL = 'http://206.12.123.7:8080/uploads';
// export const RESULT_URL = 'http://206.12.123.7:8080/results';
// export const UPLOAD_URL = 'http://localhost:8080/uploads';
// export const RESULT_URL = 'http://localhost:8080/results';

export const URL = process.env.REACT_APP_BACKEND_ACCESS_URL
export const UPLOAD_URL = URL + "uploads"
export const RESULT_URL = URL + "results"
export const LOGIN_URL = URL + "token"
export const SIGNUP_URL = URL + "create_user"
export const ACCESS_TOKEN_URL = URL + "users/me" 
export const UPLOAD_CHUNK_URL = URL + "upload-chunk" 
export const START_FILE_URL = URL + "start-file"
export const CHUNK_SIZE = 800000
export const WEBSOCKET_URL = "ws://aligndx.uwaterloo.ca:8080/livegraphs"