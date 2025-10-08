import { apiAddInvoice, apiDeleteInvoice, apiUpdateInvoice } from "@/services/invoices.api";
import { useMutation } from "@tanstack/react-query";

export const useInvoice = () => {

    const addInvoice = useMutation({
        mutationFn: apiAddInvoice,
        onSuccess: (res) => {
            console.log("response of add invoice api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add invoice api call >>", err);
        }
    });


    const deleteInvoice = useMutation({
        mutationFn: apiDeleteInvoice,
        onSuccess: (res) => {
            console.log("response of delete invoice api call>>", res);
        },
        onError: (err) => {
            console.log("Error in delete invoice api call >>", err);
        }
    });


    const updateInvoice = useMutation({
        mutationFn: apiUpdateInvoice,
        onSuccess: (res) => {
            console.log("response of update invoice api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update invoice api call >>", err);
        }
    });


    return { addInvoice, deleteInvoice, updateInvoice }
}