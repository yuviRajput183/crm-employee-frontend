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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage, getSuccessMessage } from '@/lib/helpers/get-message';
import { Alert } from "@/components/ui/alert"


// Schema validation
const loginSchema = z.object({
    userType: z.enum(['Advisor', 'Employee'], { required_error: 'Please select a user type' }),
    username: z.string().min(1, { message: 'User Name is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

const SignIn = () => {

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync, isLoading, isError, error, isSuccess, data } = signIn;
    // role, loginName, password 
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userType: '',
            username: '',
            password: '',
        },
    });

    const handleLogin = async (data) => {
        console.log("sign-in form data >>", data);
        try {
            const res = await mutateAsync({
                role: data?.userType,
                loginName: data?.username,
                password: data?.password
            });

            console.log("response of login api call>>", res);

            if (res?.data?.success) {
                alert(res?.data?.message);
                localStorage.setItem("token", res?.data?.data?.token);
                const redirectPath = res?.data?.data?.role === "employee" ? "/admin/dashboard" : "/advisor/dashboard";
                navigate(redirectPath);
            }
        } catch (error) {
            console.log("Error in Login Api call>>", error);
        }
    }

    return (
        <div className=' w-[100vw] h-[100vh] md:flex items-center justify-center overflow-y-auto'>

            <div className='w-[90%] md:w-[90%] lg:w-[60%] flex flex-col md:flex-row rounded-xl shadow-lg mx-auto mt-8 md:mt-0'>

                {/* Logo container */}
                <div className=' md:flex-4  flex items-center justify-center'>
                    <img src={logo} className=''></img>
                </div>

                {/* Form container */}
                <div className="md:flex-6 p-4 mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-1">Welcome to Loan Sahayak CRM!</h1>
                    <p className="text-center mb-3 text-sm text-gray-600">Please sign in to continue</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 font-semibold">
                            {isError && (
                                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                            )}
                            {isSuccess && (
                                <Alert variant="success">{getSuccessMessage(data)}</Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="userType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Advisor">Advisor</SelectItem>
                                                    <SelectItem value="Employee">Employee</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter User Name" {...field} />
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

                            <Button loading={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Submit
                            </Button>

                            <p className="text-center text-sm mt-2">
                                Don’t have an advisor account?{' '}
                                {/* <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                    Sign In
                                </Link> */}
                                <span className="text-blue-600 font-medium hover:underline">Create an Account</span>
                            </p>
                        </form>
                    </Form>
                </div>

            </div>

        </div>
    )
}

export default SignIn
