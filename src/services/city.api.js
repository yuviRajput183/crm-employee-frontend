import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');


export const apiAddCity = async (payload) => {
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


export const apiListCity = async () => {

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