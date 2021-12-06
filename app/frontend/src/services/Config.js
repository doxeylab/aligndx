// export const UPLOAD_URL = 'http://206.12.123.7:8080/uploads';
// export const RESULT_URL = 'http://206.12.123.7:8080/results';
// export const UPLOAD_URL = 'http://localhost:8080/uploads';
// export const RESULT_URL = 'http://localhost:8080/results';

export const URL = process.env.REACT_APP_BACKEND_ACCESS_URL;
export const UPLOAD_URL = URL + "uploads";
export const RESULT_URL = URL + "results";
export const LOGIN_URL = URL + "token";
export const SIGNUP_URL = URL + "create_user";
export const ACCESS_TOKEN_URL = URL + "users/me";

export const CHUNK_SIZE = 2e5;
export const REAL_TIME_UPLOAD_URL = URL + "real_time_upload";
export const RL_FILE_URL = REAL_TIME_UPLOAD_URL + "/file";
export const RL_CHUNK_URL = REAL_TIME_UPLOAD_URL + "/chunk";
