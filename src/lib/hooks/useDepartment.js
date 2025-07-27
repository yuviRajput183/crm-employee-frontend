import { apiAddDepartment, apiAddDesignation, apiUpdateDepartment, apiUpdateDesignation } from "@/services/department.api"
import { useMutation } from "@tanstack/react-query"

export const useDepartment = () => {

    const addDepartment = useMutation({
        mutationFn: apiAddDepartment,
        onSuccess: (res) => {
            console.log("response of add department api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add department api call >>", err);
        }
    });

    const addDesignation = useMutation({
        mutationFn: apiAddDesignation,
        onSuccess: (res) => {
            console.log("response of add designation api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add designation api call >>", err);
        }
    })

    const updateDepartment = useMutation({
        mutationFn: apiUpdateDepartment,
        onSuccess: (res) => {
            console.log("response of update department api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update department api call >>", err);
        }
    });

    const updateDesignation = useMutation({
        mutationFn: apiUpdateDesignation,
        onSuccess: (res) => {
            console.log("response of update designation api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update designtion api call >>", err);
        }
    });
    return {
        addDepartment,
        addDesignation,
        updateDepartment,
        updateDesignation
    }
}