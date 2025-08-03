import { apiAddEmployee, apiSetEmployeeCredentials, apiUpdateEmployee, apiUpdateEmployeeCredentials } from "@/services/employee.api";
import { useMutation } from "@tanstack/react-query"

export const useEmployee = () => {

    const addEmployee = useMutation({
        mutationFn: apiAddEmployee,
        onSuccess: (res) => {
            console.log("response of add employee api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add employee api call >>", err);
        }
    });

    const updateEmployee = useMutation({
        mutationFn: apiUpdateEmployee,
        onSuccess: (res) => {
            console.log("response of update employee api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update employee api call >>", err);
        }
    });

    const updateEmployeeCredentials = useMutation({
        mutationFn: apiUpdateEmployeeCredentials,
        onSuccess: (res) => {
            console.log("response of update employee login credentials api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update employee login credentials api call >>", err);
        }
    });

    const setEmployeeCredentials = useMutation({
        mutationFn: apiSetEmployeeCredentials,
        onSuccess: (res) => {
            console.log("response of set employee credentials api call>>", res);
        },
        onError: (err) => {
            console.log("Error in set employee credentials employee api call >>", err);
        }
    })

    return {
        addEmployee,
        setEmployeeCredentials,
        updateEmployee,
        updateEmployeeCredentials
    }
}