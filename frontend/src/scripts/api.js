
const url = 'http://localhost:8000/';

const options = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
}


// Commands ==============================================

export async function sendPhrase(phrase) {
    const response = await fetch(url+'send_phrase', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        ...options,
        body: JSON.stringify({phrase: phrase}) // body data type must match "Content-Type" header
    });
    return response.json();
}

export async function getPhrases() {
    const response = await fetch(url+'get_phrases', {
        method: 'GET',
        ...options
    });
    return response.json();
}

export async function setPhrase(data) {
    const response = await fetch(url+'set_phrase', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deletePhrase(data) {
    const response = await fetch(url+'delete_phrase', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function reorderPhrases(data) {
    const response = await fetch(url+'reorder_phrases', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}


// Controls ==============================================

export async function getActions() {
    const response = await fetch(url+'get_actions', {
        method: 'GET',
        ...options
    });
    return response.json();
}

export async function setAction(data) {
    const response = await fetch(url+'set_action', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteAction(data) {
    const response = await fetch(url+'delete_action', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function reorderActions(data) {
    const response = await fetch(url+'reorder_actions', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}


// Relations =============================================

export async function getAssociations() {
    const response = await fetch(url+'get_associations', {
        method: 'GET',
        ...options
    });
    return response.json();
}

export async function setAssociation(data) {
    const response = await fetch(url+'set_association', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteAssociation(data) {
    const response = await fetch(url+'delete_association', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function reorderAssociations(data) {
    const response = await fetch(url+'reorder_associations', {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}
