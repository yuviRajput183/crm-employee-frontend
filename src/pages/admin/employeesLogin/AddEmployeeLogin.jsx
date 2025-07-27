import React, { useState } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { apiEmployeeWithoutCred } from '@/services/employee.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { useEmployee } from '@/lib/hooks/useEmployee'
import { useNavigate } from 'react-router-dom'
// import { is } from 'date-fns/locale'

// Zod validation schema
const loginSchema = z.object({
    employeeName: z.string().min(1, 'Employee name is required'),
    loginName: z.string().min(1, 'Login name is required'),
    loginPassword: z.string().min(1, 'Password is required'),
})





const AddEmployeeLogin = () => {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const navigate = useNavigate();

    const { setEmployeeCredentials } = useEmployee();
    const { mutateAsync, isLoading, isError: isEmployeeLoginCredError, error: employeeLoginCredError } = setEmployeeCredentials;

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            employeeName: '',
            loginName: '',
            loginPassword: '',
        },
    })

    const onSubmit = async (data) => {
        console.log('Submitted data:', data)

        try {
            const res = await mutateAsync({
                employeeId: selectedEmployee?._id,
                loginName: data?.loginName,
                password: data?.loginPassword
            });

            if (res?.data?.success) {
                alert(res?.data?.message);
                navigate("/admin/list_login");
            }
            console.log("response of set employee credentials api call>>", res);
        } catch (error) {
            console.log("Error in set employee credentials api call>>", error);
        }
    }


    // query to  fetch all the employee names without cred -> on component mount
    const {
        isError: isEmployeeLoginError,
        error: employeeLoginError,
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiEmployeeWithoutCred();
            console.log("📦 queryFn response of employee without cred:", res);
            setEmployees(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching employees without cred:", err);
        }
    });



    console.log("selected employee>>", selectedEmployee);

    return (
        <div className=' px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Employee Login</h1>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 p-2 mt-3 shadow">

                    {isEmployeeLoginError && (
                        <Alert variant="destructive">{getErrorMessage(employeeLoginError)}</Alert>
                    )}
                    {
                        isEmployeeLoginCredError && (
                            <Alert variant="destructive">{getErrorMessage(employeeLoginCredError)}</Alert>
                        )
                    }


                    {/* Employee Name */}
                    <div className="w-full md:w-1/2">
                        <FormField
                            control={form.control}
                            name="employeeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee Name <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            const selected = employees.find((dep) => dep.name === value);
                                            setSelectedEmployee(selected);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp._id} value={emp.name}>
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
                        <Button loading={isLoading} type="submit" className="bg-blue-600 text-white">Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddEmployeeLogin
