import {
    apiLogout,
    apiSignIn,
    apiSendWhatsappLoginOtp,
    apiVerifyWhatsappLoginOtp,
    apiResendWhatsappLoginOtp,
} from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {

    const signIn = useMutation({
        mutationFn: apiSignIn,
        onSuccess: (res) => {
            console.log("response of signIn api call>>", res);
            localStorage.clear();
        },
        onError: (err) => {
            console.log("Error in Sign In api call >>", err);
        }
    });

    const logOut = useMutation({
        mutationFn: apiLogout,
        onSuccess: (res) => {
            console.log("response of logout api call>>", res);
            localStorage.clear();
        },
        onError: (err) => {
            console.log("Error in logout api call >>", err);
        }
    });

    const sendWhatsappOtp = useMutation({
        mutationFn: apiSendWhatsappLoginOtp,
        onError: (err) => {
            console.log("Error in sendWhatsappOtp api call >>", err);
        }
    });

    const verifyWhatsappOtp = useMutation({
        mutationFn: apiVerifyWhatsappLoginOtp,
        onError: (err) => {
            console.log("Error in verifyWhatsappOtp api call >>", err);
        }
    });

    const resendWhatsappOtp = useMutation({
        mutationFn: apiResendWhatsappLoginOtp,
        onError: (err) => {
            console.log("Error in resendWhatsappOtp api call >>", err);
        }
    });

    return {
        signIn,
        logOut,
        sendWhatsappOtp,
        verifyWhatsappOtp,
        resendWhatsappOtp,
    };
};