import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiListPayables = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/payables/all-payables`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            withCredentials: true
        },
    );
}


export const apiAddPayable = async (formData) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/payables/add-payable`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


export const apiDeletePayable = async (id) => {
    const token = localStorage.getItem('token');

    return await axios.delete(
        `${baseURL}/payables/delete-payable`,
        {
            data: { id },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


export const apiFetchPayableDetails = async (payableId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/payables/single-payable/${payableId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


export const apiUpdatePayable = async (payableId, payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/payables/edit-payable/${payableId}`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}
