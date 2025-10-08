import { apiAddLead, apiEditLeadAdvisor, apiUpdateLead } from "@/services/lead.api";
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

    const updateLead = useMutation({
        mutationFn: apiUpdateLead,
        onSuccess: (res) => {
            console.log("response of update lead api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update lead api call >>", err);
        }
    });

    const editLeadAdvisor = useMutation({
        mutationFn: apiEditLeadAdvisor,
        onSuccess: (res) => {
            console.log("response of edit lead advisor api call>>", res);
        },
        onError: (err) => {
            console.log("Error in edit lead advisor api call >>", err);
        }
    });

    return { addLead, updateLead, editLeadAdvisor }
}