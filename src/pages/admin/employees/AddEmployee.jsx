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
import { useQuery } from '@tanstack/react-query';
import { apiGetAllDepartments, apiGetAllDesignationOfDepartment } from '@/services/department.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { apiGetAllReportingOfficer } from '@/services/employee.api';
import { useEmployee } from '@/lib/hooks/useEmployee';
import { useLocation, useNavigate } from 'react-router-dom';


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
    resignDate: z.date().optional(),
});

const AddEmployee = () => {

    const location = useLocation();
    const editData = location.state?.employee || null;
    const isEditMode = !!editData;

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [reportingOfficers, setReportingOfficers] = useState([]);
    const [selectedReportingOfficer, setSelectedReportingOfficer] = useState(null);
    const navigate = useNavigate();

    const { addEmployee, updateEmployee } = useEmployee();
    const mutation = isEditMode ? updateEmployee : addEmployee;
    const { mutateAsync, isLoading, isError, error } = mutation;


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employeeName: editData?.name || '',
            mobileNo: editData?.mobile || '',
            department: editData?.department?.name || '',
            designation: editData?.designation || '',
            reportingOfficer: editData?.reportingOfficer?.name || '',
            altContact: editData?.altContact || '',
            address: editData?.address || '',
            email: editData?.email || '',
            joiningDate: editData?.dateOfJoining ? new Date(editData.dateOfJoining) : undefined,
            resignDate: editData?.resignDate ? new Date(editData.resignDate) : undefined, // for later
        },
    });

    console.log("editData>>", editData);
    console.log("isEditMode>>", isEditMode);


    const handleAddEmployee = async (data) => {
        try {
            const formData = new FormData();

            console.log("field data values >>", data);

            formData.append('name', data.employeeName);
            formData.append('mobile', data.mobileNo);
            formData.append('department', selectedDept?._id);
            formData.append('designation', data.designation);
            formData.append('reportingOfficer', selectedReportingOfficer?._id);
            formData.append('altContact', data.altContact || '');
            formData.append('address', data.address || '');
            formData.append('email', data.email || '');
            formData.append('dateOfJoining', data.joiningDate); // date passed directly
            if (data?.photograph) {
                formData.append('photo', data?.photograph);
            }
            if (data?.resignDate) {
                formData.append('resignDate', data.resignDate);
            }


            let res;
            if (isEditMode) {
                res = await mutateAsync({ employeeId: editData._id, payload: formData });
                console.log('✅ Employee updated successfully:', res);
            } else {
                res = await mutateAsync(formData);
                console.log('✅ Employee added successfully:', res);
            }



            form.reset(); // clear form
            if (res?.data?.success) {
                navigate("/admin/list_employee");
            }


        } catch (err) {
            console.error('❌ Error adding employee:', err);
        }
    };

    useEffect(() => {
        if (editData?.department) {
            setSelectedDept(editData.department);
        }
        if (editData?.reportingOfficer) {
            setSelectedReportingOfficer(editData.reportingOfficer);
        }
    }, [editData]);



    // query to  fetch all the departments -> on component mount
    const {
        isError: isDepartmentsError,
        error: departmentsError,
    } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await apiGetAllDepartments();
            console.log("📦 queryFn response of department:", res);
            setDepartments(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching departments:", err);
        }
    });



    // Query: Fetch designations when department changes
    const {
        isError: isDesignationError,
        error: designationError,
    } = useQuery({
        queryKey: ['designations', selectedDept],
        enabled: !!selectedDept,
        queryFn: async () => {
            const res = await apiGetAllDesignationOfDepartment(selectedDept?._id);
            console.log("📦 queryFn response of designation:", res);
            setDesignations(res?.data?.data?.designations || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching designations of department:", err);
        }
    });


    // query to  fetch all the reporting officers
    const {
        isError: isReportingOfficersError,
        error: reportingOfficersError,
    } = useQuery({
        queryKey: ['departments', 'designations'],
        queryFn: async () => {
            const res = await apiGetAllReportingOfficer();
            console.log("📦 queryFn response of reporting officers:", res);
            setReportingOfficers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching reporting officers:", err);
        }
    });




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
                    onSubmit={form.handleSubmit(handleAddEmployee)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 border border-gray-300 rounded-md px-2"
                >

                    {isDepartmentsError && (
                        <Alert variant="destructive">{getErrorMessage(departmentsError)}</Alert>
                    )}
                    {isDesignationError && (
                        <Alert variant="destructive">{getErrorMessage(designationError)}</Alert>
                    )}
                    {isReportingOfficersError && (
                        <Alert variant="destructive">{getErrorMessage(reportingOfficersError)}</Alert>
                    )}
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}


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
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const selected = departments.find((dep) => dep.name === value);
                                        setSelectedDept(selected);
                                    }}
                                    value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departments?.map((dep) => (
                                            <SelectItem key={dep?._id} value={dep?.name}>
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
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const selected = reportingOfficers?.find((rof) => rof.name === value);
                                        setSelectedReportingOfficer(selected);
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Officer" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {reportingOfficers?.map((officer) => (
                                            <SelectItem key={officer?._id} value={officer?.name}>
                                                {officer?.name}
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

                    {/* date of resign */}
                    {isEditMode && (
                        <FormField
                            control={form.control}
                            name="resignDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col  ">
                                    <FormLabel>Date of Resign</FormLabel>
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
                    )}


                    <div className="">
                        <Button type="submit" loading={isLoading} className=" ml-auto mt-3 bg-blue-950 hover:bg-blue-500">Save</Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default AddEmployee;
