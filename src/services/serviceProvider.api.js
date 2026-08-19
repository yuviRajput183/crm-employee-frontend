import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiAddServiceProvider = async (formData) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/service-providers/add-service-provider`,
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

export const apiListServiceProvider = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/service-providers/get-service-provider`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiFetchServiceProviderDetails = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/service-providers/get-service-provider/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiUpdateServiceProvider = async ({ formData, serviceProviderId }) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/service-providers/edit-service-provider/${serviceProviderId}`,
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
