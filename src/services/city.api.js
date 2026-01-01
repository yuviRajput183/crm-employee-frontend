import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiAddCity = async (payload) => {
    const token = localStorage.getItem('token');
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/cities/add-city`,
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


export const apiAddCitiesFromExcel = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/cities/add-cities-from-excel`,
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

export const apiListCity = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/cities/list-cities`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiGetCitiesByStateName = async (stateName) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/cities/cities-by-state-name?stateName=${stateName}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiUpdateCityName = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/cities/edit-city`,
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