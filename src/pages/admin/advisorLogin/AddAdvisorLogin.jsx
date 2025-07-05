import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
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

const formSchema = z.object({
    advisorName: z.string().min(1, "Advisor Name is required"),
    loginName: z.string().min(1, "Login Name is required"),
    loginPassword: z.string().min(1, "Password is required"),
})

const advisors = [
    { id: "1", name: "UV" },
    { id: "2", name: "Yuvi" },
    { id: "3", name: "Yuvraj" },
    { id: "4", name: "CA Davinder Sharma" },
    { id: "5", name: "Geetansh Bhutani" },
]


const AddAdvisorLogin = () => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            advisorName: "",
            loginName: "",
            loginPassword: "",
        },
    })

    const onSubmit = (data) => {
        console.log("Form Submitted", data)
    }



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
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300"
                >
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {advisors.map((adv) => (
                                                <SelectItem key={adv.id} value={adv.name}>
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
                        <Button type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default AddAdvisorLogin;
