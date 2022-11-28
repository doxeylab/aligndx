export default async function verify() {
    // Example POST method implementation:
    async function getData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    let verify = false

    getData(`http://backend:8080/users/me`)
        .then((data) => {
            if (data?.detail != 'Not authenticated') // JSON data parsed by `data.json()` call
            {
                verify = true
            }
            else {
                verify = false 
                localStorage.removeItem('auth')
            }
        });
    return verify; 
}


