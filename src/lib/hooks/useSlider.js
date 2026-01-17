import { apiAddSliderImages, apiFetchAllSliders } from "@/services/slider.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSlider = () => {
    const queryClient = useQueryClient();

    const addSliderImages = useMutation({
        mutationFn: apiAddSliderImages,
        onSuccess: (res) => {
            console.log("response of add slider images api call>>", res);
            queryClient.invalidateQueries(["sliders"]);
        },
        onError: (err) => {
            console.log("Error in add slider images api call >>", err);
        }
    });

    const fetchSliders = useQuery({
        queryKey: ["sliders"],
        queryFn: apiFetchAllSliders,
        refetchOnWindowFocus: false,
    });

    return { addSliderImages, fetchSliders };
}
