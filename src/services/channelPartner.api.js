import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const apiSendWhatsAppOtp = async (mobile) => {
    return await axios.post(`${baseURL}/otp/send`, {
        channel: "mobile",
        purpose: "channel_partner_mobile",
        mobile
    });
};

export const apiVerifyWhatsAppOtp = async (mobile, otp) => {
    return await axios.post(`${baseURL}/otp/verify`, {
        channel: "mobile",
        purpose: "channel_partner_mobile",
        mobile,
        otp
    });
};

export const apiSendEmailOtp = async (mobile, email) => {
    return await axios.post(`${baseURL}/otp/send`, {
        channel: "email",
        purpose: "channel_partner_email",
        mobile,
        email
    });
};

export const apiVerifyEmailOtp = async (mobile, email, otp) => {
    return await axios.post(`${baseURL}/otp/verify`, {
        channel: "email",
        purpose: "channel_partner_email",
        mobile,
        email,
        otp
    });
};

export const apiGetVerificationStatus = async (mobile) => {
    return await axios.get(`${baseURL}/otp/channel-partner/status?mobile=${mobile}`);
};

export const apiVerifyPan = async (channelPartnerId, pan, isAuthPan = false) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/channel-partners/${channelPartnerId}/pan/verify`, 
        { pan, isAuthPan }, 
        { 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true 
        }
    );
};

export const apiInitAadhaarSDK = async (channelPartnerId) => {
    const token = localStorage.getItem('token');
    return await axios.get(
        `${baseURL}/channel-partners/${channelPartnerId}/aadhaar/init`, 
        { 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true 
        }
    );
};

export const apiVerifyAadhaarAPI = async (channelPartnerId, clientId) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/channel-partners/${channelPartnerId}/aadhaar/verify`, 
        { clientId }, 
        { 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true 
        }
    );
};

export const apiConfirmAadhaarAPI = async (channelPartnerId, payload) => {
    const token = localStorage.getItem('token');
    return await axios.post(
        `${baseURL}/channel-partners/${channelPartnerId}/aadhaar/confirm`, 
        { ...payload }, 
        { 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true 
        }
    );
};
