import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Zod schema for validation
const schema = z.object({
    processedByName: z.string().min(1, "Processed By Name is required"),
});


const AddProcessed = () => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            processedByName: "",
        },
    });

    const onSubmit = (values) => {
        console.log("✅ Submitted Data: ", values);
        // Add API call here if needed
    };

    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Processed By</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md"
                >
                    {/* Processed By Name - Input */}
                    <div className=' w-full md:w-1/2'>
                        <FormField
                            control={form.control}
                            name="processedByName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Processed By Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="bg-blue-950 hover:bg-blue-400 text-white"
                        >
                            SAVE
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddProcessed
