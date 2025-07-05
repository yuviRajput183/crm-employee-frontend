import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import license from "@/assets/images/license.png"
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const Licenses = () => {

    const form = useForm({
        defaultValues: {
            employeeLicenses: "",
            advisorLicenses: "",
            startDate: "",
            endDate: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        console.log("License Form Data:", data);
        // API call logic here
    };


    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar className=" rounded-none">
                    <AvatarImage src={license} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>User Licenses</h1>

            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=' border border-gray-200 p-2 rounded-md mt-3'
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {/* Employee Licenses */}
                        <FormField
                            control={form.control}
                            name="employeeLicenses"
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No of Employee Licenses Purchased <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} placeholder="Enter number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Advisor Licenses */}
                        <FormField
                            control={form.control}
                            name="advisorLicenses"
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No of Advisor Licenses Purchased <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} placeholder="Enter number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Start Date */}
                        <FormField
                            control={form.control}
                            name="startDate"
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription Start Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* End Date */}
                        <FormField
                            control={form.control}
                            name="endDate"
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription End Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password to Validate</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} placeholder="Enter password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button type="submit" className="bg-blue-950 hover:bg-blue-800 text-white">
                            Update
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Licenses
