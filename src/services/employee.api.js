import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiGetAllReportingOfficer = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/employees/reporting-officer`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiAddEmployee = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/employees/add-employee`,
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

export const apiListEmployee = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/employees/list-employees`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiFetchEmployeeDetails = async (employeeId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/employees/employee-detail/${employeeId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiUpdateEmployee = async ({ employeeId, payload }) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/employees/edit-employee/${employeeId}`,
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

export const apiEmployeeWithoutCred = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/employees/no-credentials`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiSetEmployeeCredentials = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/users/set-employee-credentials`,
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

export const apiListEmployeeLogin = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/users/employee-credentials`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}


export const apiUpdateEmployeeCredentials = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/users/update-login-credentials`,
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
