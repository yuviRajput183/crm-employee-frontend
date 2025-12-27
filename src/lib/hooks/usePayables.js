import { apiDeletePayable, apiAddPayable, apiUpdatePayable } from "@/services/payables.api";
import { useMutation } from "@tanstack/react-query";

export const usePayables = () => {

    const addPayable = useMutation({
        mutationFn: (formData) => apiAddPayable(formData),
        onSuccess: (res) => {
            console.log("response of ADD payables api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add payables api call >>", err);
        }
    });

    const updatePayable = useMutation({
        mutationFn: ({ payableId, payload }) => apiUpdatePayable(payableId, payload),
        onSuccess: (res) => {
            console.log("response of UPDATE payables api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update payables api call >>", err);
        }
    });

    const deletePayable = useMutation({
        mutationFn: (id) => apiDeletePayable(id),
        onSuccess: (res) => {
            console.log("response of DELETE payables api call>>", res);

        },
        onError: (err) => {
            console.log("Error in delete payables api call >>", err);
        }
    })


    return { addPayable, updatePayable, deletePayable }
}
