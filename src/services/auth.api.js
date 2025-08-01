import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const apiSignIn = async (payload) => {
    return await axios.post(
        `${baseURL}/auth/login`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }
    );
};


export const apiLogout = async () => {
    console.log("token>>", token);

    return await axios.post(
        `${baseURL}/auth/logout`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
};