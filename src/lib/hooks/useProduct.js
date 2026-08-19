import { apiAddProduct, apiUpdateProduct, apiAddSubProduct, apiUpdateSubProduct } from "@/services/product.api"
import { useMutation } from "@tanstack/react-query"

export const useProduct = () => {

    const addProduct = useMutation({
        mutationFn: apiAddProduct,
        onSuccess: (res) => {
            console.log("response of add product api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add product api call >>", err);
        }
    });

    const addSubProduct = useMutation({
        mutationFn: apiAddSubProduct,
        onSuccess: (res) => {
            console.log("response of add sub product api call>>", res);
        },
        onError: (err) => {
            console.log("Error in add sub product api call >>", err);
        }
    })

    const updateProduct = useMutation({
        mutationFn: apiUpdateProduct,
        onSuccess: (res) => {
            console.log("response of update product api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update product api call >>", err);
        }
    });

    const updateSubProduct = useMutation({
        mutationFn: apiUpdateSubProduct,
        onSuccess: (res) => {
            console.log("response of update sub product api call>>", res);
        },
        onError: (err) => {
            console.log("Error in update sub product api call >>", err);
        }
    });

    return {
        addProduct,
        addSubProduct,
        updateProduct,
        updateSubProduct
    }
}
