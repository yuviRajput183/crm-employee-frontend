import { apiDeleteAdvisorPayout } from "@/services/advisorPayout.api";
import { useMutation } from "@tanstack/react-query"

export const useAdvisorPayout = () => {

    const deleteAdvisorPayout = useMutation({
        mutationFn: (id) => apiDeleteAdvisorPayout(id),
        onSuccess: (res) => {
            console.log("response of DELETE advisor payout api call>>", res);

        },
        onError: (err) => {
            console.log("Error in delete advisor payout api call >>", err);
        }
    })


    return { deleteAdvisorPayout }
}