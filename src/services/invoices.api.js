import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');



export const apiListInvoices = async (params = {}) => {
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/invoices/all-invoices`,
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


export const apiListLeadNo = async () => {
    return await axios.get(
        `${baseURL}/invoices/disbursed-unpaid-leads`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiAddInvoice = async (payload) => {
    return await axios.post(
        `${baseURL}/invoices/add-invoice`,
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


export const apiDeleteInvoice = async (id) => {
    return await axios.delete(
        `${baseURL}/invoices/delete-invoice`,
        {
            params: { id },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiFetchInvoiceDetails = async (invoiceId) => {

    return await axios.get(
        `${baseURL}/invoices/${invoiceId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiFetchInvoiceBankerDetails = async (leadId) => {
    return await axios.get(
        `${baseURL}/leads/single-lead/${leadId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateInvoice = async ({ invoiceId, payload }) => {

    return await axios.put(
        `${baseURL}/invoices/${invoiceId}`,
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