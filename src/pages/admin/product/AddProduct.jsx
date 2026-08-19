import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { useProduct } from '@/lib/hooks/useProduct';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';

// Zod Schema for validation
const formSchema = z.object({
    productName: z.string().min(1, "Product name is required"),
});

const AddProduct = () => {

    const { addProduct } = useProduct();
    const { mutateAsync, isLoading, isError, error } = addProduct;
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("Form Submitted:", data);
        try {
            const res = await mutateAsync({
                name: data?.productName
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_product");
            }
            console.log("response of add product api call>>", res);
        } catch (error) {
            console.log("Error in add product api call>>", error);
        }
    };


    return (
        <div className=' px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Product</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 mt-3  rounded-md shadow"
                >
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}
                    {/* Product Name */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Product Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter product name"
                                            className="shadow"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="w-full pt-2">
                        <Button loading={isLoading} type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddProduct
