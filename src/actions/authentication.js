import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT,
    AUTH_UPDATE,
    AUTH_UPDATE_SUCCESS,
    AUTH_UPDATE_FAILURE,
    AUTH_PROFILE,
    AUTH_PROFILE_SUCCESS,
    AUTH_PROFILE_FAILURE
} from './ActionTypes';

import axios from 'axios';

/* authentication */

/* LOGIN */
export function loginRequest(username, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());

        // API REQUEST
        return axios.post('/api/account/signin', { username, password })
            .then((response) => {
                // SUCCEED              
                dispatch(loginSuccess(username, response.data.token));
            }).catch((error) => {
                // FAILED
                dispatch(loginFailure());
            });
    }
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(username, token) {
    localStorage.setItem("token", token);
    return {
        type: AUTH_LOGIN_SUCCESS,
        username,
        token
    };
}

export function loginFailure() {
    localStorage.removeItem('token');
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

/* REGISTER */
export function registerRequest(username, password) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(register());
        
        return axios.post('/api/account/signup', { username, password })
            .then((response) => {
                dispatch(registerSuccess());
            }).catch((error) => {
                dispatch(registerFailure(error.response.data.code));
            });
    };
}

export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS
    };
}

export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

/* GET STATUS */
export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());

        return axios.get('/api/account/getInfo')
            .then((response) => {
                dispatch(getStatusSuccess(response.data.info.username));
            }).catch((error) => {
                dispatch(getStatusFailure());
            });
    };
}

export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

/* Logout */
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
            .then((response) => {
                dispatch(logout());
            });
    };
}

export function logout() {
    localStorage.removeItem("token");
    return {
        type: AUTH_LOGOUT
    };
}


/* Profile Update */
export function updateRequest(data) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(update());
        
        return axios.put('/api/account/update', { data })
            .then((response) => {
                dispatch(registerSuccess());
            }).catch((error) => {
                dispatch(registerFailure(error.response.data.code));
            });
    };
}

export function update() {
    return {
        type: AUTH_UPDATE
    };
}

export function updateSuccess() {
    return {
        type: AUTH_UPDATE_SUCCESS
    };
}

export function updateFailure(error) {
    return {
        type: AUTH_UPDATE_FAILURE,
        error
    };
}

/* GET Profile */
export function getProfileRequest(username) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(getProfile());
        
        let url = '/api/account/profile';
        
        if(typeof username !== "undefined") {
            url = `${url}/${username}`;
        }
        
        return axios.get(url)
            .then((response) => {
                dispatch(getProfileSuccess(response.data));
            }).catch((error) => {
                dispatch(getProfileFailure(error));
            });
    };
}

export function getProfile() {
    return {
        type: AUTH_PROFILE
    };
}

export function getProfileSuccess(account) {
    return {
        type: AUTH_PROFILE_SUCCESS,
        account
    };
}

export function getProfileFailure(error) {
    return {
        type: AUTH_PROFILE_FAILURE,
        error
    };
}

