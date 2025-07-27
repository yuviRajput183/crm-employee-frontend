import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBank } from '@/lib/hooks/useBank';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';

const AddBank = () => {

    const { addBank } = useBank();
    const { mutateAsync, isLoading, isError, error } = addBank;
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            bankName: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("Bank Data:", data);
        // API call can be done here
        try {
            const res = await mutateAsync({
                name: data?.bankName
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_bank");
            }
            console.log("response of add bank api call>>", res);
        } catch (error) {
            console.log("Error in add bank api call>>", error);
        }
    };



    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Bank</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md pb-10"
                >
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}
                    {/* Bank Name Field */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="bankName"
                            rules={{ required: "Bank name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Bank Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter bank name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button loading={isLoading} type="submit" className="bg-blue-950 hover:bg-blue-800 text-white">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddBank
