import React, { useState } from 'react'
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useCity } from '@/lib/hooks/useCity';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { Label, Separator } from '@radix-ui/react-dropdown-menu';

// All Indian States
const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Zod Schema
const formSchema = z.object({
    stateName: z.string().min(1, "State is required"),
    cityName: z.string().min(1, "City name is required"),
});


const AddCity = () => {
    const { addCity, addCitiesFromExcel } = useCity();
    const { mutateAsync, isLoading, isError, error } = addCity;
    const navigate = useNavigate();
    const [excelFile, setExcelFile] = useState(null);
    const {
        mutateAsync: uploadExcel,
        isLoading: isUploading,
        isError: isExcelError,
        error: excelError
    } = addCitiesFromExcel;


    const handleExcelChange = (e) => {
        console.log("handlexcel change ...");
        setExcelFile(e.target.files[0]);
    }
    const handleExcelSubmit = async (e) => {
        e.preventDefault();
        if (!excelFile) return alert("Please choose a file first");
        const formData = new FormData();
        console.log("excel file >>", excelFile);

        formData.append('file', excelFile);

        try {
            const result = await uploadExcel(formData);
            alert(result?.message || "Cities added successfully!");
            navigate("/admin/list_city");
        } catch (err) {
            console.error("Excel upload failed", err);
        }
    };


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stateName: "",
            cityName: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("City Form Data:", data);
        // API call can be done here
        try {
            const res = await mutateAsync({
                stateName: data?.stateName,
                cityName: data?.cityName,
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_city");
            }
            console.log("response of add city api call>>", res);
        } catch (error) {
            console.log("Error in add city api call>>", error);
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
                <h1 className=' text-2xl text-bold'>Add City</h1>
            </div>

            <div className=' border p-2 mt-3 border-gray-300 rounded-md '>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                    >
                        {isError && (
                            <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                        )}
                        {/* State Name - Dropdown */}
                        <div className="w-full md:w-1/2">
                            <FormField
                                control={form.control}
                                name="stateName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            State Name <span className="text-red-500">*</span>
                                        </FormLabel>
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
                        </div>

                        {/* City Name - Input */}
                        <div className="w-full md:w-1/2">
                            <FormField
                                control={form.control}
                                name="cityName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            City Name <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter city name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button loading={isLoading} type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>

                {/* <Separator className="my-4" /> */}
                <hr className=' my-4' />
                <div>
                    <h2 className="text-lg font-semibold mb-3">Bulk Upload via Excel</h2>
                    {isExcelError && (
                        <Alert variant="destructive">{getErrorMessage(excelError)}</Alert>
                    )}

                    <form onSubmit={handleExcelSubmit} className="flex flex-col gap-3 w-full md:w-1/2">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="excelFile">Upload Excel File</Label>
                            <Input
                                id="excelFile"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleExcelChange}
                                className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md border-gray"
                            />
                        </div>

                        <Button
                            loading={isUploading}
                            type="submit"
                            className="bg-blue-950 hover:bg-blue-400 text-white w-fit"
                        >
                            Add City from Excel
                        </Button>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default AddCity
