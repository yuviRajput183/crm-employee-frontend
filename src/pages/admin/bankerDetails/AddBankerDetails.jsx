import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
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
import { useQuery } from '@tanstack/react-query';
import { apiGetCitiesByStateName } from '@/services/city.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { apiListBank } from '@/services/bank.api';
import { useBanker } from '@/lib/hooks/useBanker';
import { useLocation, useNavigate } from 'react-router-dom';

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

const products = [
    { name: 'Personal Loan' },
    { name: 'Business Loan' },
    { name: 'Education Loan' },
    { name: 'Home Loan' },
    { name: 'Loan Against Property' },
    { name: 'Car Loan' },
    { name: 'Used Car Loan' },
    { name: 'Insurance' },
    { name: 'Private Funding' },
    { name: 'Services' },
];

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const AddBankerDetails = () => {
    const location = useLocation();
    const editData = location.state?.banker || null;
    const isEditMode = !!editData;

    const [selectedState, setSelectedState] = useState(null);
    const [cities, setCities] = useState([]);
    const [bankList, setBankList] = useState([]);

    const navigate = useNavigate();


    const { addBanker, updateBanker } = useBanker();
    const mutation = isEditMode ? updateBanker : addBanker;
    const { mutateAsync, isLoading, isError, error } = mutation;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: editData?.product || "",
            state: editData?.city?.stateName || "",
            city: editData?.city?._id || "",
            bank: editData?.bank?._id || "",
            designation: editData?.designation || "",
            bankerName: editData?.bankerName || "",
            mobile: editData?.mobile || "",
            email: editData?.email || "",
        },
    });

    useEffect(() => {
        if (editData?.city?.stateName) {
            setSelectedState(editData.city.stateName);
        }
    }, [editData]);

    console.log("editData>>", editData);


    const onSubmit = async (data) => {
        console.log("✅ Form Submitted", data);

        try {

            const payload = {
                product: data?.product,
                stateName: data?.state,
                cityId: data?.city,
                bankId: data?.bank,
                bankerName: data?.bankerName,
                designation: data?.designation,
                mobile: data?.mobile,
                email: data?.email
            }

            let res;
            if (isEditMode) {
                res = await mutateAsync({ bankerId: editData?._id, payload });
                console.log('✅ Banker updated successfully:', res);
            } else {
                res = await mutateAsync(payload);
                console.log('✅ Banker added successfully:', res);
            }



            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_banker_details");
            }
            console.log("response of add banker api call>>", res);
        } catch (error) {
            console.log("Error in add bankerer api call>>", error);
        }
    };


    // Query: Fetch cities when state changes
    const {
        isError: isCitiesError,
        error: citiesError,
    } = useQuery({
        queryKey: [selectedState],
        enabled: !!selectedState,
        queryFn: async () => {
            const res = await apiGetCitiesByStateName(selectedState);
            console.log("📦 queryFn response of fetching cities when state change:", res);
            setCities(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching cities:", err);
        }
    });


    // Query: Fetch all the banks .
    const {
        isError: isListBankError,
        error: listBankError,
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListBank();
            console.log("📦 queryFn response of list banks:", res);
            setBankList(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list banks api :", err);
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
                <h1 className=' text-2xl text-bold'>Add Banker</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >

                    {isCitiesError && (
                        <Alert variant="destructive">{getErrorMessage(citiesError)}</Alert>
                    )}
                    {isListBankError && (
                        <Alert variant="destructive">{getErrorMessage(listBankError)}</Alert>
                    )}
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}

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
                                        {products?.map((prod, index) => (
                                            <SelectItem key={index} value={prod?.name}>
                                                {prod?.name}
                                            </SelectItem>
                                        ))}
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
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        // const selected = indianStates?.find(() => dep.name === value);
                                        setSelectedState(value);
                                    }}
                                    value={field.value}
                                >
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
                                        {cities.map((city) => (
                                            <SelectItem key={city?._id} value={city?._id}>
                                                {city?.cityName}
                                            </SelectItem>
                                        ))}
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
                                        {bankList?.map((bank) => (
                                            <SelectItem key={bank?._id} value={bank?._id}>
                                                {bank?.name}
                                            </SelectItem>
                                        ))}
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
};

export default AddBankerDetails
