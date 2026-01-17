import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

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

export const apiFetchAllSliders = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/sliders/all-sliders`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}
