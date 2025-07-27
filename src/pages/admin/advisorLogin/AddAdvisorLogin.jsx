import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from '@tanstack/react-query'
import { apiAdvisorWithoutCred } from '@/services/advisor.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { Alert } from '@/components/ui/alert'
import { useAdvisor } from '@/lib/hooks/useAdvisor'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    advisorName: z.string().min(1, "Advisor Name is required"),
    loginName: z.string().min(1, "Login Name is required"),
    loginPassword: z.string().min(1, "Password is required"),
})



const AddAdvisorLogin = () => {
    const [advisors, setAdvisors] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const { setAdvisorCredentials } = useAdvisor();
    const { mutateAsync, isLoading, isError: isAdvisorLoginCredError, error: advisorLoginCredError } = setAdvisorCredentials;
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            advisorName: "",
            loginName: "",
            loginPassword: "",
        },
    })

    const onSubmit = async (data) => {
        console.log("Form Submitted", data)

        try {
            const res = await mutateAsync({
                advisorId: selectedAdvisor?._id,
                loginName: data?.loginName,
                password: data?.loginPassword
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_advisor_login");
            }
            console.log("response of set advisor credentials api call>>", res);
        } catch (error) {
            console.log("Error in set advisor credentials api call>>", error);
        }
    }


    // query to  fetch all the advisor names without cred -> on component mount
    const {
        isError: isAdvisorLoginError,
        error: advisorLoginError,
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiAdvisorWithoutCred();
            console.log("📦 queryFn response of all advisor without cred:", res);
            setAdvisors(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisor without cred:", err);
        }
    });

    return (
        <div className=' px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Advisor Login</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 mt-3 shadow"
                >

                    {isAdvisorLoginError && (
                        <Alert variant="destructive">{getErrorMessage(advisorLoginError)}</Alert>
                    )}
                    {
                        isAdvisorLoginCredError && (
                            <Alert variant="destructive">{getErrorMessage(advisorLoginCredError)}</Alert>
                        )
                    }


                    {/* Advisor Name */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="advisorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Advisor Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            const selected = advisors.find((dep) => dep.name === value);
                                            setSelectedAdvisor(selected);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {advisors.map((adv) => (
                                                <SelectItem key={adv?._id} value={adv.name}>
                                                    {adv.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Login Name */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="loginName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Login Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter login name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Login Password */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="loginPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Login Password <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="Enter password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="w-full pt-2">
                        <Button loading={isLoading} type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddAdvisorLogin;
