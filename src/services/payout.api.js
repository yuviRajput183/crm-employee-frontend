import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddPayout = async (payload) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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


export const apiFetchPayoutDetails = async (payoutId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/advisorPayouts/single-advisor-payout/${payoutId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}