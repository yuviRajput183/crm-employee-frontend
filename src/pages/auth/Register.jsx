import React from 'react'
import logo from '@/assets/images/crm-logo.jpg';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const registerSchema = z
    .object({
        advisorName: z.string().min(1, { message: 'Advisor Name is required' }),
        mobile: z.string().min(10, { message: 'Mobile No is required' }),
        email: z.string().email({ message: 'Invalid email' }),
        password: z.string().min(6, { message: 'Password is required' }),
        confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

const Register = () => {

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            advisorName: '',
            mobile: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleRegister = () => { }

    return (
        <div className=' w-[100vw] h-[100vh] md:flex items-center justify-center overflow-y-auto'>

            <div className='w-[90%] md:w-[90%] lg:w-[60%] flex flex-col md:flex-row rounded-xl shadow-lg mx-auto'>

                {/* Logo container */}
                <div className=' md:flex-4  flex items-center justify-center'>
                    <img src={logo} className=''></img>
                </div>

                {/* Form container */}
                <div className="md:flex-6 p-4 mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-1">Welcome to Loan Sahayak CRM!</h1>
                    <p className="text-center mb-3 text-sm text-gray-600">Please Register with us</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4 font-semibold">
                            <FormField
                                control={form.control}
                                name="advisorName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Advisor Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Advisor Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile No</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Mobile No" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email id</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter Email Id" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter Confirm Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Submit
                            </Button>

                            <p className="text-center text-sm mt-2">
                                Already have an account?{' '}
                                {/* <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                    Sign In
                                </Link> */}
                                <p className="text-blue-600 font-medium hover:underline">Sign In</p>
                            </p>
                        </form>
                    </Form>
                </div>

            </div>

        </div>
    )
}

export default Register
