import { apiAddAdvisor, apiSetAdvisorCredentials, apiUpdateAdvisorCredentials, apiUpdateAdvisorDetails } from "@/services/advisor.api";
import { useMutation } from "@tanstack/react-query";

export const useAdvisor = () => {

    const addAdvisor = useMutation({
        mutationFn: apiAddAdvisor,
        onSuccess: (res) => {
            console.log("response of add advisor api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add advisor api call >>", err);
        }
    });

    const updateAdvisor = useMutation({
        mutationFn: ({ formData, advisorId }) => apiUpdateAdvisorDetails({ formData, advisorId }),
        onSuccess: (res) => {
            console.log("response of UPDATE advisor api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update advisor api call >>", err);
        }
    });

    const setAdvisorCredentials = useMutation({
        mutationFn: apiSetAdvisorCredentials,
        onSuccess: (res) => {
            console.log("response of set advisor credentials api call>>", res);
        },
        onError: (err) => {
            console.log("Error in set advisor credentials employee api call >>", err);
        }
    })

    const updateAdvisorCredentials = useMutation({
        mutationFn: apiUpdateAdvisorCredentials,
        onSuccess: (res) => {
            console.log("response of update advisor login credentials api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update advisor login credentials api call >>", err);
        }
    });

    return {
        addAdvisor,
        setAdvisorCredentials,
        updateAdvisor,
        updateAdvisorCredentials
    }
}