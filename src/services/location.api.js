import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddLocation = async (formData) => {
    const token = localStorage.getItem('token');
    console.log("formData>>>", formData);

    return await axios.post(
        `${baseURL}/locations/add-location`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiListLocation = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/locations/get-location`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiFetchLocationDetails = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/locations/get-location/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiUpdateLocation = async ({ formData, locationId }) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/locations/edit-location/${locationId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}