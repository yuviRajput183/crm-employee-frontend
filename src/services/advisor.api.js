import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiAddAdvisor = async (payload) => {
    return await axios.post(
        `${baseURL}/advisors/add-advisor`,
        payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiListAdvisor = async () => {
    return await axios.get(
        `${baseURL}/advisors/all-advisors`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiAdvisorWithoutCred = async () => {

    return await axios.get(
        `${baseURL}/advisors/without-credentials`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiSetAdvisorCredentials = async (payload) => {
    return await axios.post(
        `${baseURL}/users/set-advisor-credentials`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiListAdvisorLogin = async () => {

    return await axios.get(
        `${baseURL}/users/advisor-credentials`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiFetchAdvisorDetails = async (advisorId) => {

    return await axios.get(
        `${baseURL}/advisors/advisor-detail/${advisorId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateAdvisorDetails = async ({ formData, advisorId }) => {
    return await axios.put(
        `${baseURL}/advisors/edit-advisor/${advisorId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateAdvisorCredentials = async (payload) => {

    return await axios.put(
        `${baseURL}/users/update-login-credentials`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}