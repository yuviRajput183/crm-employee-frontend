import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const apiGetAllDepartments = async () => {

    return await axios.get(
        `${baseURL}/departments/list-departments`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiGetAllDesignationOfDepartment = async (departmentId) => {
    return await axios.get(
        `${baseURL}/departments/designations?departmentId=${departmentId}`,
        {
            params: { departmentId },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiAddDepartment = async (payload) => {
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/departments/add-department`,
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

export const apiListDepartment = async () => {

    return await axios.get(
        `${baseURL}/departments/list-departments`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiAddDesignation = async (payload) => {
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/departments/add-designation`,
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


export const apiUpdateDepartment = async (payload) => {

    return await axios.put(
        `${baseURL}/departments/edit-department`,
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


export const apiUpdateDesignation = async (payload) => {

    return await axios.put(
        `${baseURL}/departments/edit-designation`,
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
