import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiAddProduct = async (payload) => {
    const token = localStorage.getItem('token');
    console.log("payload>>>", payload);

    return await axios.post(
        `${baseURL}/products/add-product`,
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

export const apiListProduct = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/products/list-products`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiUpdateProduct = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/products/edit-product`,
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

export const apiGetAllSubProductsOfProduct = async (productId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/products/sub-products?productId=${productId}`,
        {
            params: { productId },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
}

export const apiAddSubProduct = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/products/add-sub-product`,
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

export const apiUpdateSubProduct = async (payload) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `${baseURL}/products/edit-sub-product`,
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
