import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;



export const apiListInvoices = async (params = {}) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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


export const apiGetMyPerformance = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/invoices/advisor-performance`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}