import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useServiceProvider } from '@/lib/hooks/useServiceProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { apiFetchServiceProviderDetails } from '@/services/serviceProvider.api';
import { apiListLocation } from '@/services/location.api';

const typeOptions = ["Proprietorship", "Partnership", "Private Limited", "Limited"];

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const formSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required"),
    alias: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    address: z.string().optional(),
    state: z.string().optional(),
    stateCode: z.string().optional(),
    gstin: z.string().optional(),
    code: z.string().optional(),
    billingFormat: z.any().optional(),
    location: z.string().min(1, "Location is required"),
});

const AddServiceProvider = () => {
    const { addServiceProvider, updateServiceProvider } = useServiceProvider();
    const { id: serviceProviderId } = useParams();
    const navigate = useNavigate();

    const { mutateAsync, isLoading, isError, error } = serviceProviderId ? updateServiceProvider : addServiceProvider;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            legalName: "",
            alias: "",
            type: "",
            address: "",
            state: "",
            stateCode: "",
            gstin: "",
            code: "",
            billingFormat: "",
            location: "",
        },
    });

    const { data: locationsData } = useQuery({
        queryKey: ['locations'],
        queryFn: apiListLocation,
    });
    const locations = locationsData?.data?.data || [];

    const {
        data: providerData,
        isError: isProviderDetailError,
        error: providerDetailError,
    } = useQuery({
        queryKey: ['serviceProvider', serviceProviderId],
        queryFn: () => apiFetchServiceProviderDetails(serviceProviderId),
        enabled: !!serviceProviderId,
        refetchOnWindowFocus: false,
    });

    React.useEffect(() => {
        if (providerData?.data?.data) {
            const data = providerData.data.data;
            form.setValue('legalName', data.legalName || '');
            form.setValue('alias', data.alias || '');
            form.setValue('type', data.type || '');
            form.setValue('address', data.address || '');
            form.setValue('state', data.state || '');
            form.setValue('stateCode', data.stateCode || '');
            form.setValue('gstin', data.gstin || '');
            form.setValue('code', data.code || '');
            form.setValue('billingFormat', data.billingFormat || '');
            form.setValue('location', data.location || '');
        }
    }, [providerData, form]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (key === 'billingFormat') {
                    if (data[key] instanceof File) {
                        formData.append(key, data[key]);
                    }
                } else if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            if (serviceProviderId) {
                await mutateAsync({ formData, serviceProviderId });
                alert("Service Provider updated successfully!");
            } else {
                await mutateAsync(formData);
                alert("Service Provider added successfully!");
            }
            navigate("/admin/list_service_provider");
        } catch (err) {
            console.error("Failed to save service provider", err);
        }
    };

    return (
        <div className='p-3 bg-white rounded shadow'>
            {/* Heading */}
            <div className='flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='text-2xl text-bold'>{serviceProviderId ? "Edit Service Provider" : "Add Service Provider"}</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="border border-gray-200 p-2 py-4 mt-3"
                >
                    {isError && (
                        <Alert variant="destructive">
                            <span className="font-bold">Error: </span>
                            {getErrorMessage(error)}
                        </Alert>
                    )}
                    {isProviderDetailError && (
                        <Alert variant="destructive">
                            <span className="font-bold">Error loading service provider: </span>
                            {getErrorMessage(providerDetailError)}
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-b-2 pb-4 border-black">
                        <FormField
                            control={form.control}
                            name="legalName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Legal Name <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="alias"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Alias</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Type <span className='text-red-500'>*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {typeOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>State</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {indianStates.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="stateCode"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>State Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="gstin"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>GSTIN</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="billingFormat"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Billing Format (PDF/Excel)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            type="file"
                                            accept=".pdf, .xls, .xlsx"
                                            onChange={(e) => onChange(e.target.files?.[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Location <span className='text-red-500'>*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map((loc) => (
                                                <SelectItem key={loc._id} value={loc._id}>
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    
                    <div className="mt-4">
                        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddServiceProvider
