import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddAdvisor = async (payload) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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