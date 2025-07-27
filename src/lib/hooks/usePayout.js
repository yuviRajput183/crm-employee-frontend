import { apiAddPayout, apiAddSliderImages } from "@/services/payout.api";
import { useMutation } from "@tanstack/react-query";

export const usePayout = () => {

    const addPayout = useMutation({
        mutationFn: apiAddPayout,
        onSuccess: (res) => {
            console.log("response of add payout api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add payout api call >>", err);
        }
    });

    const addSliderImages = useMutation({
        mutationFn: apiAddSliderImages,
        onSuccess: (res) => {
            console.log("response of add slider images api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add slider images api call >>", err);
        }
    });



    return { addPayout, addSliderImages }
}