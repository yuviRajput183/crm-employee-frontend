import axios from "axios";

// This is a placeholder for the actual WhatsApp API
export const apiSendWhatsAppOtp = async (mobile) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { success: true, message: `OTP sent to WhatsApp: ${mobile}` } });
        }, 1000);
    });
};

export const apiVerifyWhatsAppOtp = async (mobile, otp) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For now, accept "123456" as the hardcoded OTP
            if (otp === "123456") {
                resolve({ data: { success: true, message: "Mobile verified successfully" } });
            } else {
                reject({ response: { data: { message: "Invalid WhatsApp OTP" } } });
            }
        }, 1000);
    });
};

// This is a placeholder for the actual Email API
export const apiSendEmailOtp = async (email) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { success: true, message: `OTP sent to Email: ${email}` } });
        }, 1000);
    });
};

export const apiVerifyEmailOtp = async (email, otp) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For now, accept "123456" as the hardcoded OTP
            if (otp === "123456") {
                resolve({ data: { success: true, message: "Email verified successfully" } });
            } else {
                reject({ response: { data: { message: "Invalid Email OTP" } } });
            }
        }, 1000);
    });
};

// This is a placeholder for the PAN verification API
export const apiVerifyPan = async (pan) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Basic validation for PAN format (5 letters, 4 numbers, 1 letter)
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (panRegex.test(pan)) {
                resolve({ data: { success: true, message: "PAN verified successfully", data: { name: "TEST USER" } } });
            } else {
                reject({ response: { data: { message: "Invalid PAN format. Must be like ABCDE1234F" } } });
            }
        }, 1000);
    });
};

// This is a placeholder for the Aadhaar OTP API
export const apiSendAadhaarOtp = async (aadhaar) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (aadhaar && aadhaar.length === 12) {
                resolve({ data: { success: true, message: `OTP sent to mobile linked with Aadhaar: ${aadhaar}` } });
            } else {
                reject({ response: { data: { message: "Invalid Aadhaar format. Must be 12 digits" } } });
            }
        }, 1000);
    });
};

export const apiVerifyAadhaarOtp = async (aadhaar, otp) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For now, accept "123456" as the hardcoded OTP
            if (otp === "123456") {
                resolve({ data: { success: true, message: "Aadhaar verified successfully" } });
            } else {
                reject({ response: { data: { message: "Invalid Aadhaar OTP" } } });
            }
        }, 1000);
    });
};
