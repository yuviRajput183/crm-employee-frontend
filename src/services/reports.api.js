import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiGetReceivablesReport = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/reports/receivables`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};

export const apiGetGSTReceivablesReport = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/reports/gst-receivables`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};

export const apiGetPayablesReport = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/reports/payables`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};

export const apiGetGSTPayablesReport = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/reports/gst-payables`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};

export const apiGetPerformanceReport = async (params = {}) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/reports/performance`,
        {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        },
    );
};
