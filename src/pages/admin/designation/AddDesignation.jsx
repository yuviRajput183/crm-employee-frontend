import React, { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { apiListDepartment } from "@/services/department.api";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/helpers/get-message";
import { useDepartment } from "@/lib/hooks/useDepartment";
import { useNavigate } from "react-router-dom";



// Zod Schema
const formSchema = z.object({
    departmentName: z.string().min(1, "Department is required"),
    designationName: z.string().min(1, "Designation is required"),
});


const AddDesignation = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const navigate = useNavigate();

    const { addDesignation } = useDepartment();
    const { mutateAsync, isLoading, isError: isAddDesignationError, error: addDesignationError } = addDesignation;


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departmentName: "",
            designationName: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("Submitted:", data);
        // You can handle API submission here

        try {
            const res = await mutateAsync({
                departmentId: selectedDepartment?._id,
                designation: data?.designationName
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_designation");
            }
            console.log("response of add designation api call>>", res);
        } catch (error) {
            console.log("Error in add designation api call>>", error);
        }
    };


    // query to  fetch list of department on component mount
    const {
        isError: isListDepartmentError,
        error: listDepartmentError,
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListDepartment();
            console.log("📦 queryFn response of list department:", res);
            setDepartments(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list departments api :", err);
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
                <h1 className=' text-2xl text-bold'>Add Designation</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md"
                >

                    {isListDepartmentError && (
                        <Alert variant="destructive">{getErrorMessage(listDepartmentError)}</Alert>
                    )}
                    {isAddDesignationError && (
                        <Alert variant="destructive">{getErrorMessage(addDesignationError)}</Alert>
                    )}

                    {/* Department Name - Dropdown */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="departmentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Department Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            const selected = departments.find((dep) => dep.name === value);
                                            setSelectedDepartment(selected);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept?._id} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Designation Name - Input */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="designationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Designation Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter designation name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
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


export default AddDesignation
