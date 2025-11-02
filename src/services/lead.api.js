import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiAddLead = async (payload) => {
    console.log("payload in frontend>>", payload);

    return await axios.post(
        `${baseURL}/leads/add-lead`,
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


export const apiUpdateLead = async ({ leadId, payload }) => {

    return await axios.put(
        `${baseURL}/leads/edit-lead/${leadId}`,
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


export const apiListAllocatedTo = async () => {
    return await axios.get(
        `${baseURL}/employees/non-admin-department`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}



export const apiListMyLead = async (params = {}) => {
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/leads/all-my-leads`,
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



export const apiListNewLead = async (params = {}) => {
    console.log("api function with params:", params);


    return await axios.get(
        `${baseURL}/leads/all-new-leads`,
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


export const apiCustomerByAdvisorId = async (params = {}) => {


    return await axios.get(
        `${baseURL}/leads/customers-by-advisorId`,
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


export const apiEditLeadAdvisor = async ({ leadId, payload }) => {


    return await axios.put(
        `${baseURL}/leads/edit-lead-advisor/${leadId}`,
        payload, // body
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        }
    );
}


export const apiFetchLeadDetails = async (leadId) => {

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


export const apiBankerCitiesByStateName = async (payload) => {


    return await axios.get(
        `${baseURL}/leads/bankercities-by-state-name`,
        {
            params: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiBanksByCity = async (payload) => {

    console.log("payload >>>", payload);

    return await axios.get(
        `${baseURL}/leads/banks-by-cityId`,
        {
            params: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiBankersByBank = async (payload) => {

    return await axios.get(
        `${baseURL}/leads/bankers-by-bankId`,
        {
            params: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiBankerByBankerId = async (payload) => {

    return await axios.get(
        `${baseURL}/leads/banker-by-bankerId`,
        {
            params: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}