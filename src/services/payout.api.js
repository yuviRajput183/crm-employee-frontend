import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiAddPayout = async (payload) => {
    return await axios.post(
        `${baseURL}/payouts/upload-payout`,
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


export const apiAddSliderImages = async (payload) => {
    return await axios.post(
        `${baseURL}/sliders/add-update-sliders`,
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