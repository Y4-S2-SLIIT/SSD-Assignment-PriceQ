import * as URL from './const/url';

const login = async (data) => {
    return fetch(URL.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

const register = async (data) => {
    return fetch(URL.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

const getUserByEmail = async (email) => {
    return fetch(URL.GET_USER_BY_EMAIL(email), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export default {
    login,
    register,
    getUserByEmail
};