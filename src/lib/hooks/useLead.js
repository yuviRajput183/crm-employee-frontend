import { apiAddLead } from "@/services/lead.api";
import { useMutation } from "@tanstack/react-query";

export const useLead = () => {

    const addLead = useMutation({
        mutationFn: apiAddLead,
        onSuccess: (res) => {
            console.log("response of add Lead api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add Lead api call >>", err);
        }
    });

    return { addLead }
}