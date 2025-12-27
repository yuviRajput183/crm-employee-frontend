import { apiAddAdvisorPayout, apiDeleteAdvisorPayout, apiUpdateAdvisorPayout } from "@/services/advisorPayout.api";
import { useMutation } from "@tanstack/react-query"

export const useAdvisorPayout = () => {

    const addAdvisorPayout = useMutation({
        mutationFn: apiAddAdvisorPayout,
        onSuccess: (res) => {
            console.log("response of add advisor payout api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add advisor payout api call >>", err);
        }
    });


    const deleteAdvisorPayout = useMutation({
        mutationFn: (id) => apiDeleteAdvisorPayout(id),
        onSuccess: (res) => {
            console.log("response of DELETE advisor payout api call>>", res);

        },
        onError: (err) => {
            console.log("Error in delete advisor payout api call >>", err);
        }
    });

    const updateAdvisorPayout = useMutation({
        mutationFn: apiUpdateAdvisorPayout,
        onSuccess: (res) => {
            console.log("response of update advisor payout api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update advisor payout api call >>", err);
        }
    });


    return { deleteAdvisorPayout, addAdvisorPayout, updateAdvisorPayout }
}