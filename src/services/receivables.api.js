import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiListReceivables = async (params = {}) => {
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/receivables/all-receivables`,
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


export const apiAddReceivable = async (formData) => {
    return await axios.post(
        `${baseURL}/receivables/add-receivable`,
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


export const apiDeleteReceivables = async (id) => {


    return await axios.delete(
        `${baseURL}/receivables/delete-receivable`,
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


export const apiFetchReceivableDetails = async (receivableId) => {
    return await axios.get(
        `${baseURL}/receivables/single-receivable/${receivableId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


export const apiFetchReceivableBankerDetails = async (leadId) => {
    return await axios.get(
        `${baseURL}/receivables/banker-details/${leadId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


export const apiUpdateReceivable = async (receivableId, payload) => {
    return await axios.put(
        `${baseURL}/receivables/edit-receivable/${receivableId}`,
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
