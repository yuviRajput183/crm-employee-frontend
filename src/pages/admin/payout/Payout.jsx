import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import money from "@/assets/images/money.png"
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePayout } from '@/lib/hooks/usePayout';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';

const payoutSchema = z.object({
    payout: z
        .any()
        .refine((file) => file instanceof File || file?.[0] instanceof File, {
            message: "Payout file is required",
        }),
});


const Payout = () => {

    const { addPayout } = usePayout();
    const { mutateAsync, isLoading, isError, error } = addPayout;


    const form = useForm({
        resolver: zodResolver(payoutSchema),
        defaultValues: {
            payout: null,
        },
    });

    const onSubmit = async (values) => {
        try {
            console.log("Submitted:", values);
            const formData = new FormData();
            formData.append("file", values.payout[0]);

            // you can now send formData via fetch/axios
            const res = await mutateAsync(formData);
            console.log('✅ payout added successfully:', res);

            form.reset(); // clear form
            if (res?.data?.success) {
                alert(res?.data?.message);
                window.location.reload();
            }
        } catch (err) {
            console.error('❌ Error adding payout:', err);
        }
    };


    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={money} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Payout Structure</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md"
                >

                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}


                    {/* File Upload */}
                    <div className=' w-full md:w-1/2'>
                        <FormField
                            control={form.control}
                            name="payout"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Payout
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            onChange={(e) => field.onChange(e.target.files)}
                                            className="border border-gray-400 rounded-md p-2 w-full file:mr-4  file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
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

export default Payout
