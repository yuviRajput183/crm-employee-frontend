import { apiDeleteReceivables, apiAddReceivable, apiUpdateReceivable } from "@/services/receivables.api";
import { useMutation } from "@tanstack/react-query";

export const useReceivables = () => {

    const addReceivable = useMutation({
        mutationFn: (formData) => apiAddReceivable(formData),
        onSuccess: (res) => {
            console.log("response of ADD receivables api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add receivables api call >>", err);
        }
    });

    const updateReceivable = useMutation({
        mutationFn: ({ receivableId, payload }) => apiUpdateReceivable(receivableId, payload),
        onSuccess: (res) => {
            console.log("response of UPDATE receivables api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update receivables api call >>", err);
        }
    });

    const deleteReceivables = useMutation({
        mutationFn: (id) => apiDeleteReceivables(id),
        onSuccess: (res) => {
            console.log("response of DELETE receivables api call>>", res);

        },
        onError: (err) => {
            console.log("Error in delete receivables api call >>", err);
        }
    })


    return { addReceivable, updateReceivable, deleteReceivables }
}
