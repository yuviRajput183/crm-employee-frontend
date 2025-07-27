import { apiAddBank, apiUpdateBankName } from "@/services/bank.api";
import { useMutation } from "@tanstack/react-query";

export const useBank = () => {

    const addBank = useMutation({
        mutationFn: apiAddBank,
        onSuccess: (res) => {
            console.log("response of add Bank api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add Bank api call >>", err);
        }
    });

    const updateBankName = useMutation({
        mutationFn: apiUpdateBankName,
        onSuccess: (res) => {
            console.log("response of update bank name api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update bank name api call >>", err);
        }
    });

    return { addBank, updateBankName }
}