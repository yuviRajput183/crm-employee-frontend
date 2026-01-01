import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddBank = async (payload) => {
    const token = localStorage.getItem('token');
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/banks/add-bank`,
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


export const apiListBank = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/banks/list-banks`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}



export const apiUpdateBankName = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/banks/edit-bank`,
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