import { apiAddProcessed, apiUpdateProcessed } from "@/services/processed.api";
import { useMutation } from "@tanstack/react-query";

export const useProcessedBy = () => {

    const addProcessedBy = useMutation({
        mutationFn: apiAddProcessed,
        onSuccess: (res) => {
            console.log("response of add processedBy api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add processedBy api call >>", err);
        }
    });


    const updateProcessedBy = useMutation({
        mutationFn: apiUpdateProcessed,
        onSuccess: (res) => {
            console.log("response of update processedBy api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update processedBy api call >>", err);
        }
    });

    return { addProcessedBy, updateProcessedBy }
}