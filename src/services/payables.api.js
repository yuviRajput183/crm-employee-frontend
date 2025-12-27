import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiListPayables = async (params = {}) => {
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
