import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Zod validation schema
const loginSchema = z.object({
    employeeName: z.string().min(1, 'Employee name is required'),
    loginName: z.string().min(1, 'Login name is required'),
    loginPassword: z.string().min(1, 'Password is required'),
})

// Dummy employees (can be fetched via API)
const employees = [
    { id: 'emp1', name: 'Ankit' },
    { id: 'emp2', name: 'Juhi' },
    { id: 'emp3', name: 'Pankaj' },
    { id: 'emp4', name: 'Yuvraj' },
]


const AddEmployeeLogin = () => {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            employeeName: '',
            loginName: '',
            loginPassword: '',
        },
    })

    const onSubmit = (data) => {
        console.log('Submitted data:', data)
        // Call your backend API here
    }

    return (
        <div className=' px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Employee</h1>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 p-2 border mt-3 border-gray-500">

                    {/* Employee Name */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="employeeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee Name <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.name}>
                                                    {emp.name}
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
                                    <FormLabel>Login Name <span className="text-red-500">*</span></FormLabel>
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
                                    <FormLabel>Login Password <span className="text-red-500">*</span></FormLabel>
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
                        <Button type="submit" className="bg-blue-600 text-white">Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddEmployeeLogin
