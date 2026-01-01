import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddProcessed = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/processedBy/add-processedBy`,
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

export const apiListProcessed = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/processedBy/list-processedBy`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateProcessed = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/processedBy/edit-processedBy`,
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