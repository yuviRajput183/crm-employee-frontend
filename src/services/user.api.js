import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiGetUserProfile = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/users/profile`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};

export const apiChangePassword = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/users/change-password`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};
