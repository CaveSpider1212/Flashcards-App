const API_URL = "http://localhost:5001/api"; // backend API URL

async function request(endpoint, options = {}) {
    const res = await fetch (`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    })

    const data = await res.json();

    if (!res.ok) {
        throw new Error (data.message || "API request failed");
    }

    return data;
}

function login(username, password) {
    return request("/users/login", {
        method: "POST",
        body: JSON.stringify({username, password})
    });
}

function getCurrentUser(token) {
    return request("/users/current", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}

function getDecks(token) {
    return request("/decks", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}

export {login, getCurrentUser, getDecks};