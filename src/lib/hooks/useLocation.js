import { apiAddLocation, apiListLocation, apiUpdateLocation } from "@/services/location.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLocation = () => {
    const queryClient = useQueryClient();

    const addLocation = useMutation({
        mutationFn: apiAddLocation,
        onSuccess: (res) => {
            console.log("response of add location api call>>", res);
            queryClient.invalidateQueries({ queryKey: ["locations"] });
        },
        onError: (err) => {
            console.log("Error in add location api call >>", err);
        }
    });

    const updateLocation = useMutation({
        mutationFn: apiUpdateLocation,
        onSuccess: (res) => {
            console.log("response of update location api call>>", res);
            queryClient.invalidateQueries({ queryKey: ["locations"] });
        },
        onError: (err) => {
            console.log("Error in update location api call >>", err);
        }
    });

    return {
        addLocation,
        updateLocation,
    };
};
