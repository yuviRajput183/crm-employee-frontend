import { apiAddBanker, apiUpdateBanker } from "@/services/banker.api";
import { useMutation } from "@tanstack/react-query";

export const useBanker = () => {

    const addBanker = useMutation({
        mutationFn: apiAddBanker,
        onSuccess: (res) => {
            console.log("response of add Banker api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add Banker api call >>", err);
        }
    });

    const updateBanker = useMutation({
        mutationFn: apiUpdateBanker,
        onSuccess: (res) => {
            console.log("response of update banker api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update banker api call >>", err);
        }
    });

    return { addBanker, updateBanker }
}