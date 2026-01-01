import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddBanker = async (payload) => {
    const token = localStorage.getItem('token');
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/bankers/add-banker`,
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

export const apiListBankers = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/bankers/list-bankers`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateBanker = async ({ bankerId, payload }) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/bankers/edit-banker/${bankerId}`,
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