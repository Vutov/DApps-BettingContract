import * as $ from "jquery";

const apiUrl = "http://localhost:64512/api/";

function makeAuth(type) {
    switch (type) {
        case 'basic':
            return {Authorization: "Bearer " + sessionStorage.authToken};
        default: return null
    }
}

function get(module, uri, auth) {
    let request = {
        method: "GET",
        url: apiUrl + module + "/" + uri
    };

    const authHeaders = makeAuth(auth);
    if (authHeaders !== null) {
        request.headers = authHeaders
    }

    return $.ajax(request);
}

function post(module, uri, data, auth) {
    let url = apiUrl + module;

    let request = {
        method: "POST",
        url: apiUrl + module + "/" + uri
    };

    const authHeaders = makeAuth(auth);
    if (authHeaders !== null) {
        request.headers = authHeaders
    }

    if (data !== null) {
        request.data = data;
    }

    return $.ajax(request);
}

function del(module, uri, auth) {
    const url = apiUrl + module + "/" + uri;
    const authHeaders = makeAuth(auth);

    return $.ajax({
        method: "DELETE",
        url: url,
        headers: authHeaders
    });
}

function update(module, uri, data, auth) {
    const url = apiUrl + module + "/" + uri;
    const authHeaders = makeAuth(auth);

    let request = {
        method: "PUT",
        url: url,
        headers: authHeaders,
        data: data
    };

    return $.ajax(request);
}

export { get, post, update, del };