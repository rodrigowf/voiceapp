
const baseUrl = 'http://192.168.0.110:8000/';

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

export async function get(url) {
    const response = await fetch(baseUrl + url, {
        method: 'GET',
        ...options
    });
    return response.json();
}
export async function post(url, data) {
    const response = await fetch(baseUrl + url, {
        method: 'POST',
        ...options,
        body: JSON.stringify(data)
    });
    return response.json();
}


// Phrases ==============================================

export async function sendPhrase(phrase) {
    return await post('send_phrase', { phrase });
}

export async function executeAction(id) {
    return await post('execute_action', { id });
}

export const speechesApi = {
    getList:  async () => await get('get_speeches'),
    ordList:  async (data) => await post('reorder_speeches', data),
    setItem:  async (data) => await post('set_speech', data),
    delItem:  async (data) => await post('delete_speech', data),
};


// Actions ==============================================

export const actionsApi = {
    getList:  async () => await get('get_actions'),
    ordList:  async (data) => await post('reorder_actions', data),
    setItem:  async (data) => await post('set_action', data),
    delItem:  async (data) => await post('delete_action', data),
};


// Relations =============================================

export const associationsApi = {
    getList:  async () => await get('get_associations'),
    ordList:  async (data) => await post('reorder_associations', data),
    setItem:  async (data) => await post('set_association', data),
    delItem:  async (data) => await post('delete_association', data),
};
