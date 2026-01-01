import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiListAllLeads = async (params = {}) => {
    const token = localStorage.getItem('token');
    console.log("api function with params:", params);

    return await axios.get(
        `${baseURL}/leads/all-leads`,
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