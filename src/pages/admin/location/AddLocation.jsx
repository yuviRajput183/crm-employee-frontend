import React, { useState } from 'react'
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
import { useLocation } from '@/lib/hooks/useLocation';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { apiFetchLocationDetails } from '@/services/location.api';
import { Separator } from '@radix-ui/react-dropdown-menu';

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
    name: z.string().min(1, "Name is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().optional(),
    gstin: z.string().optional(),
    mobile: z.string().min(10, "Valid mobile number is required"),
    email: z.string().email("Valid email is required"),
    authorizedSignatoryName: z.string().optional(),
    authorizedSignatoryDesignation: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
});

const AddLocation = () => {
    const { addLocation, updateLocation } = useLocation();
    const { id: locationId } = useParams();
    const navigate = useNavigate();

    const { mutateAsync, isLoading, isError, error } = locationId ? updateLocation : addLocation;

    const [stampFile, setStampFile] = useState(null);
    const [signFile, setSignFile] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            state: "",
            address: "",
            gstin: "",
            mobile: "",
            email: "",
            authorizedSignatoryName: "",
            authorizedSignatoryDesignation: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
        },
    });

    const {
        data: locationData,
        isError: isLocationDetailError,
        error: locationDetailError,
    } = useQuery({
        queryKey: ['location', locationId],
        queryFn: () => apiFetchLocationDetails(locationId),
        enabled: !!locationId,
        refetchOnWindowFocus: false,
    });

    React.useEffect(() => {
        if (locationData?.data?.data) {
            const data = locationData.data.data;
            form.setValue('name', data.name || '');
            form.setValue('state', data.state || '');
            form.setValue('address', data.address || '');
            form.setValue('gstin', data.gstin || '');
            form.setValue('mobile', data.mobile || '');
            form.setValue('email', data.email || '');
            form.setValue('authorizedSignatoryName', data.authorizedSignatoryName || '');
            form.setValue('authorizedSignatoryDesignation', data.authorizedSignatoryDesignation || '');
            form.setValue('accountHolderName', data.accountHolderName || '');
            form.setValue('accountNumber', data.accountNumber || '');
            form.setValue('ifscCode', data.ifscCode || '');
        }
    }, [locationData, form]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key] || "");
        });

        if (stampFile) {
            formData.append("stamp", stampFile);
        }
        if (signFile) {
            formData.append("sign", signFile);
        }

        try {
            if (locationId) {
                await mutateAsync({ formData, locationId });
                alert("Location updated successfully!");
            } else {
                await mutateAsync(formData);
                alert("Location added successfully!");
            }
            navigate("/admin/list_location");
        } catch (err) {
            console.error("Failed to save location", err);
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
                <h1 className='text-2xl text-bold'>{locationId ? "Edit Location" : "Add Location"}</h1>
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
                    {isLocationDetailError && (
                        <Alert variant="destructive">
                            <span className="font-bold">Error loading location: </span>
                            {getErrorMessage(locationDetailError)}
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-b-2 pb-2 border-black">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Location Name <span className='text-red-500'>*</span></FormLabel>
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
                                    <FormLabel>State Name <span className='text-red-500'>*</span></FormLabel>
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
                            name="mobile"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Mobile No <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input maxLength={10} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); }} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Email ID <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
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
                            name="authorizedSignatoryName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Authorized Signatory Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorizedSignatoryDesignation"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Authorized Signatory Designation</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    {/* Bank Section */}
                    <h1 className="text-red-600 font-semibold py-4 border-b-2 border-black">Bank Account Details</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 border-b-2 pb-2 border-black mt-4">
                        {/* <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="accountHolderName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Account Holder Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Account No</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="ifscCode"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel>IFSC Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h1 className="text-red-600 font-semibold py-4 border-b-2 border-black">Documents (Stamp & Signature)</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b-2 pb-2 border-black mt-4">
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel>Stamp</FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setStampFile(e.target.files?.[0] || null)}
                                    />
                                    {locationData?.data?.data?.stamp && !stampFile && (
                                        <div className="mt-2">
                                            <p className="text-sm font-bold text-gray-500 mb-1">Current Stamp:</p>
                                            <a
                                                href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/uploads/stamps/${locationData.data.data.stamp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/uploads/stamps/${locationData.data.data.stamp}`}
                                                    alt="Current Stamp"
                                                    className="mt-2 border rounded w-[150px] h-[150px] object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>

                        <FormItem className="flex flex-col gap-1">
                            <FormLabel>Signature</FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSignFile(e.target.files?.[0] || null)}
                                    />
                                    {locationData?.data?.data?.signature && !signFile && (
                                        <div className="mt-2">
                                            <p className="text-sm font-bold text-gray-500 mb-1">Current Signature:</p>
                                            <a
                                                href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/uploads/signatures/${locationData.data.data.signature}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/uploads/signatures/${locationData.data.data.signature}`}
                                                    alt="Current Signature"
                                                    className="mt-2 border rounded w-[150px] h-[150px] object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>
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

export default AddLocation
