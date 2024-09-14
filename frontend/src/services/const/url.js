const BASE_URL = 'http://localhost:8090';

export const LOGIN = `${BASE_URL}/user/login`;
export const REGISTER = `${BASE_URL}/user/`;
export const GET_USER_BY_EMAIL = (email) => `${BASE_URL}/user/email/${email}`;
