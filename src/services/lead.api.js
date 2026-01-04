import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddLead = async (payload) => {
    const token = localStorage.getItem('token');
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


export const apiAddDraft = async (payload) => {
    const token = localStorage.getItem('token');
    console.log("draft payload in frontend>>", payload);

    return await axios.post(
        `${baseURL}/leads/add-draft`,
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


export const apiUpdateLead = async ({ leadId, payload }) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');

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


export const apiBankerCitiesByStateName = async (payload) => {
    const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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


export const apiListAdvisorMyLead = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function with params:", params);

    return await axios.get(
        `${baseURL}/leads/advisor-my-leads`,
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


export const apiListAllDrafts = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function for fetching drafts with params:", params);

    return await axios.get(
        `${baseURL}/leads/all-drafts`,
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


export const apiFetchDraftDetails = async (draftId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/leads/single-draft/${draftId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}