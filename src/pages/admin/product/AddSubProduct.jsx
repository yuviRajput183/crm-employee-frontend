import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { apiListProduct } from "@/services/product.api";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/helpers/get-message";
import { useProduct } from "@/lib/hooks/useProduct";
import { useNavigate } from "react-router-dom";

// Zod Schema
const formSchema = z.object({
    productName: z.string().min(1, "Product is required"),
    subProductName: z.string().min(1, "Sub Product is required"),
});

const AddSubProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const { addSubProduct } = useProduct();
    const { mutateAsync, isLoading, isError: isAddSubProductError, error: addSubProductError } = addSubProduct;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            subProductName: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("Submitted:", data);
        try {
            const res = await mutateAsync({
                productId: selectedProduct?._id,
                subProduct: data?.subProductName
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_sub_product");
            }
            console.log("response of add sub product api call>>", res);
        } catch (error) {
            console.log("Error in add sub product api call>>", error);
        }
    };

    // query to fetch list of product on component mount
    const {
        isError: isListProductError,
        error: listProductError,
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await apiListProduct();
            console.log("📦 queryFn response of list product:", res);
            setProducts(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list products api :", err);
        }
    });

    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Sub Product</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md"
                >

                    {isListProductError && (
                        <Alert variant="destructive">{getErrorMessage(listProductError)}</Alert>
                    )}
                    {isAddSubProductError && (
                        <Alert variant="destructive">{getErrorMessage(addSubProductError)}</Alert>
                    )}

                    {/* Product Name - Dropdown */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Product Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            const selected = products.find((prod) => prod.name === value);
                                            setSelectedProduct(selected);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {products.map((prod) => (
                                                <SelectItem key={prod?._id} value={prod.name}>
                                                    {prod.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Sub Product Name - Input */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="subProductName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Sub Product Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter sub product name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            loading={isLoading}
                            type="submit"
                            className="bg-blue-950 hover:bg-blue-400 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddSubProduct
