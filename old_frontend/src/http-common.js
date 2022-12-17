import {LOGIN_URL, SIGNUP_URL, ACCESS_TOKEN_URL} from './services/Config';

export const request = (options, contentType) => {
    const headers = new Headers({
        "Content-Type": contentType,
    });

    if (localStorage.getItem("accessToken")) {
        headers.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export const loginRequest = (loginRequest) => {
    return request({
        url: LOGIN_URL,
        method: "POST",
        body: new URLSearchParams(loginRequest),
    }, "application/x-www-form-urlencoded");
}

export const signupRequest = (signupRequest) => {
    return request({
        url: SIGNUP_URL,
        method: "POST",
        body: JSON.stringify(signupRequest),
    }, "application/json");
}

export const getCurrentUser = () => {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: ACCESS_TOKEN_URL,
        method: "GET",
    }, "application/json");
}
