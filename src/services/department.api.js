import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiGetAllDepartments = async () => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
