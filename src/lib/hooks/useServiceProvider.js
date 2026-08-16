import { apiAddServiceProvider, apiUpdateServiceProvider } from "@/services/serviceProvider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useServiceProvider = () => {
    const queryClient = useQueryClient();

    const addServiceProvider = useMutation({
        mutationFn: apiAddServiceProvider,
        onSuccess: (res) => {
            console.log("response of add service provider api call>>", res);
            queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
        },
        onError: (err) => {
            console.log("Error in add service provider api call >>", err);
        }
    });

    const updateServiceProvider = useMutation({
        mutationFn: apiUpdateServiceProvider,
        onSuccess: (res) => {
            console.log("response of update service provider api call>>", res);
            queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
        },
        onError: (err) => {
            console.log("Error in update service provider api call >>", err);
        }
    });

    return {
        addServiceProvider,
        updateServiceProvider,
    };
};
