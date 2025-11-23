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

