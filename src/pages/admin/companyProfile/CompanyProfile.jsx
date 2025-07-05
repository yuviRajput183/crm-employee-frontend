import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Input
} from "@/components/ui/input";
import {
    Button
} from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import company from "@/assets/images/company.png"


const companyProfileSchema = z.object({
    companyName: z.string().min(1, "Required"),
    shortName: z.string().min(1, "Required"),
    crmUrl: z.string().url("Must be a valid URL"),
    address: z.string().optional(),
    emailDisplayName: z.string().optional(),
    email: z.string().optional(),
    emailPassword: z.string().optional(),
    mailServer: z.string().optional(),
    port: z.string().optional(),
    ssl: z.string().optional(),
    smsSenderId: z.string().optional(),
    smsPanelUser: z.string().optional(),
    smsPanelPassword: z.string().optional(),
});

const sslOptions = ["Yes", "No"];



const CompanyProfile = () => {

    const form = useForm({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: {
            companyName: "",
            shortName: "",
            crmUrl: "",
            address: "",
            emailDisplayName: "",
            email: "",
            emailPassword: "",
            mailServer: "",
            port: "",
            ssl: "",
            smsSenderId: "",
            smsPanelUser: "",
            smsPanelPassword: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Form Submitted", data);
        // Send data to backend
    };


    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={company} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Company Profile</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="border border-gray-200 p-2 mt-4 space-y-3    "
                >
                    {/* Section: Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-black pb-4">
                        <FormField name="companyName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="shortName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Short Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="address" control={form.control} render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>Company Address</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="crmUrl" control={form.control} render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>CRM URL <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Section: Email Configuration */}
                    <h3 className="font-semibold text-red-600 border-b border-black pb-1">Email Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-black pb-4">
                        <FormField name="emailDisplayName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Display Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email ID to be used for Standard Mail</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="emailPassword" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="mailServer" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mail Server</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="ssl" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enable SSL?</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sslOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />

                        <FormField name="port" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Port</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    {/* Section: SMS Configuration */}
                    <h3 className="font-semibold text-red-600 border-b border-black pb-1">SMS Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-black pb-4">
                        <FormField name="smsSenderId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sender ID</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="smsPanelUser" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Panel User Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="smsPanelPassword" control={form.control} render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>Panel User Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button type="submit" className="bg-blue-900 hover:bg-blue-700 text-white">
                            Update
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CompanyProfile
