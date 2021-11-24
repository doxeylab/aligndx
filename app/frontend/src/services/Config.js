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