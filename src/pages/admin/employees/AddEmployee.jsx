import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


// Dummy Data
const departments = [
    { id: 'hr', name: 'Human Resources' },
    { id: 'sales', name: 'Sales' },
    { id: 'it', name: 'IT' },
    { id: 'finance', name: 'Finance' },
];

const designationsByDepartment = {
    hr: ['HR Manager', 'HR Executive'],
    sales: ['Sales Manager', 'Sales Executive'],
    it: ['Frontend Developer', 'Backend Developer'],
    finance: ['Accountant', 'Finance Manager'],
};

const reportingOfficers = ['Anvay Gupta', 'Rahul Verma', 'Simran Kaur'];

const formSchema = z.object({
    employeeName: z.string().min(1, 'Required'),
    mobileNo: z.string().min(10, 'Enter valid mobile number'),
    department: z.string().min(1, 'Required'),
    designation: z.string().min(1, 'Required'),
    reportingOfficer: z.string().min(1, 'Required'),
    altContact: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email().optional(),
    joiningDate: z.date({ required_error: 'Joining date is required' }),
    photograph: z.any().optional(),
});

const AddEmployee = () => {
    const [designations, setDesignations] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employeeName: '',
            mobileNo: '',
            department: '',
            designation: '',
            reportingOfficer: '',
            altContact: '',
            address: '',
            email: '',
            joiningDate: undefined,
        },
    });

    const watchDepartment = form.watch('department');

    useEffect(() => {
        if (watchDepartment) {
            setDesignations(designationsByDepartment[watchDepartment] || []);
            form.setValue('designation', '');
        }
    }, [watchDepartment, form]);

    const onSubmit = (data) => {
        console.log('Form submitted:', data);
    };

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Add Employee</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit my-4 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p>

            {/* add employee form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 border border-gray-300 rounded-md px-2"
                >
                    {/* Employee Name */}
                    <FormField
                        control={form.control}
                        name="employeeName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee Name <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mobile No */}
                    <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile No <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Department */}
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department <span className=' text-red-500'>*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departments.map((dep) => (
                                            <SelectItem key={dep.id} value={dep.id}>
                                                {dep.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Designation" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {designations.map((des, i) => (
                                            <SelectItem key={i} value={des}>
                                                {des}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Reporting Officer */}
                    <FormField
                        control={form.control}
                        name="reportingOfficer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reporting Officer</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Officer" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {reportingOfficers.map((officer, i) => (
                                            <SelectItem key={i} value={officer}>
                                                {officer}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Alternative Contact No */}
                    <FormField
                        control={form.control}
                        name="altContact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternative Contact No</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Email ID</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date of Joining */}
                    <FormField
                        control={form.control}
                        name="joiningDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col  ">
                                <FormLabel>Date of Joining <span className=' text-red-500'>*</span></FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className="text-left font-normal">
                                                {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Photograph */}
                    <FormField
                        control={form.control}
                        name="photograph"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photograph <span className=' text-red-500 text-xs'>(Size 150 * 150 pixels)</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="">
                        <Button type="submit" className=" ml-auto mt-3 bg-blue-950 hover:bg-blue-500">Save</Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default AddEmployee;
