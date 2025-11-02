import { apiAddCitiesFromExcel, apiAddCity, apiUpdateCityName } from "@/services/city.api";
import { useMutation } from "@tanstack/react-query";

export const useCity = () => {

    const addCity = useMutation({
        mutationFn: apiAddCity,
        onSuccess: (res) => {
            console.log("response of add city api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add city api call >>", err);
        }
    });

    const addCitiesFromExcel = useMutation({
        mutationFn: apiAddCitiesFromExcel,
        onSuccess: (res) => {
            console.log("response of add city from excel api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add city from excel api call >>", err);
        }
    })

    const updateCityName = useMutation({
        mutationFn: apiUpdateCityName,
        onSuccess: (res) => {
            console.log("response of update city name api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update city name api call >>", err);
        }
    });


    return { addCity, updateCityName, addCitiesFromExcel }
}