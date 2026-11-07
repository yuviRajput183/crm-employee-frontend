import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiSignIn = async (payload) => {
    return await axios.post(
        `${baseURL}/auth/login`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }
    );
};


export const apiLogout = async () => {
    const token = localStorage.getItem('token');
    console.log("token>>", token);

    return await axios.post(
        `${baseURL}/auth/logout`,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );
};

/**
 * apiSendWhatsappLoginOtp - Sends a WhatsApp OTP to the given mobile number for login.
 * @param {{ mobile: string }} payload
 */
export const apiSendWhatsappLoginOtp = async (payload) => {
    return await axios.post(
        `${baseURL}/auth/send-whatsapp-login-otp`,
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
};

/**
 * apiVerifyWhatsappLoginOtp - Verifies the OTP and authenticates the user.
 * Returns the same response structure as apiSignIn.
 * @param {{ mobile: string, otp: string }} payload
 */
export const apiVerifyWhatsappLoginOtp = async (payload) => {
    return await axios.post(
        `${baseURL}/auth/verify-whatsapp-login-otp`,
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
};

/**
 * apiResendWhatsappLoginOtp - Resends the WhatsApp OTP (subject to cooldown).
 * @param {{ mobile: string }} payload
 */
export const apiResendWhatsappLoginOtp = async (payload) => {
    return await axios.post(
        `${baseURL}/auth/resend-whatsapp-login-otp`,
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
};