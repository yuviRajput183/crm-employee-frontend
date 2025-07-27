import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


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