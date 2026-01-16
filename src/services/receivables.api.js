import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiListReceivables = async (params = {}) => {
    const token = localStorage.getItem('token');
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


export const apiAddReceivable = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/receivables/add-receivable`,
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


export const apiDeleteReceivables = async (id) => {
    const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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


// Fetch all receivable leads for Lead No dropdown
export const apiListReceivableLeads = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/receivables/all-receivable-leads`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


// Fetch invoice master details by lead ID (for Payment Against selection)
export const apiGetInvoiceMasterByLeadId = async (leadId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/receivables/invoice-master-by-lead-id`,
        {
            params: { leadId },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}
