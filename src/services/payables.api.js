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


export const apiAddPayable = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/payables/add-payable`,
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


// Fetch all payable leads for Lead No dropdown
export const apiListPayableLeads = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/payables/all-advisor-payouts-leadIds`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}


// Fetch advisors associated with payout by lead ID (for Payment Against selection)
export const apiGetAdvisorsAssociatedWithPayout = async (leadId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/payables/advisors-associated-with-payout`,
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


// Fetch single advisor payout details by advisor payout ID
export const apiGetSingleAdvisorPayout = async (advisorPayoutId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/advisorPayouts/single-advisor-payout/${advisorPayoutId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
}
