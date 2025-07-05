import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

// Zod schema
const formSchema = z.object({
    product: z.string().min(1, "Product is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    bank: z.string().min(1, "Bank is required"),
    designation: z.string().min(1, "Designation is required"),
    bankerName: z.string().min(1, "Banker name is required"),
    mobile: z.string().min(10, "Enter valid mobile no"),
    email: z.string().email("Enter valid email").optional(),
});



const AddBankerDetails = () => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: "",
            state: "",
            city: "",
            bank: "",
            designation: "",
            bankerName: "",
            mobile: "",
            email: "",
        },
    });

    const onSubmit = (values) => {
        console.log("✅ Form Submitted", values);
    };



    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Banker</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >

                    {/* Product */}
                    <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product <span className=' text-red-500'>*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Loan">Loan</SelectItem>
                                        <SelectItem value="Credit">Credit</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* State */}
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State Name <span className=' text-red-500'>*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Haryana">Haryana</SelectItem>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City */}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City Name <span className=' text-red-500'>*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Hisar">Hisar</SelectItem>
                                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Bank */}
                    <FormField
                        control={form.control}
                        name="bank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Name <span className=' text-red-500'>*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="HDFC">HDFC</SelectItem>
                                        <SelectItem value="ICICI">ICICI</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Banker Name */}
                    <FormField
                        control={form.control}
                        name="bankerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banker Name <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter banker name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Designation */}
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter designation" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mobile */}
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile No</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter mobile no" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Id</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
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

export default AddBankerDetails
