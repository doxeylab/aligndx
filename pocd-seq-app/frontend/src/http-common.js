export const request = (options, contentType) => {
    const headers = new Headers({
        "Content-Type": contentType,
    });

    if (localStorage.getItem("accessToken")) {
        headers.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    }

    const defaults = {headers: headers};
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