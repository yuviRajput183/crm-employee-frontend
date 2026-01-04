import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;



export const apiListAdvisorPayouts = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/advisorPayouts/all-advisor-payouts`,
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


export const apiAddAdvisorPayout = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/advisorPayouts/add`,
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

export const apiUpdateAdvisorPayout = async ({ payoutId, payload }) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/advisorPayouts/edit-advisor-payout/${payoutId}`,
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

export const apiDeleteAdvisorPayout = async (id) => {
    const token = localStorage.getItem('token');

    return await axios.delete(
        `${baseURL}/advisorPayouts/delete-advisor-payout`,
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


export const apiMyAdvisorPayout = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function for my advisor payout with params:", params);

    return await axios.get(
        `${baseURL}/payables/advisor-payout`,
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