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