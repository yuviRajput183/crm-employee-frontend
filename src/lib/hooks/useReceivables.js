import { apiDeleteReceivables } from "@/services/receivables.api";
import { useMutation } from "@tanstack/react-query";

export const useReceivables = () => {

    const deleteReceivables = useMutation({
        mutationFn: (id) => apiDeleteReceivables(id),
        onSuccess: (res) => {
            console.log("response of DELETE receivables api call>>", res);

        },
        onError: (err) => {
            console.log("Error in delete receivables api call >>", err);
        }
    })


    return { deleteReceivables }
}