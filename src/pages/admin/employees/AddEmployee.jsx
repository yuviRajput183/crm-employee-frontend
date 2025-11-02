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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from '@tanstack/react-query';
import { apiGetAllDepartments, apiGetAllDesignationOfDepartment } from '@/services/department.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { apiFetchEmployeeDetails, apiGetAllReportingOfficer } from '@/services/employee.api';
import { useEmployee } from '@/lib/hooks/useEmployee';
import { useNavigate, useParams } from 'react-router-dom';


const formSchema = z.object({
    employeeName: z.string().min(1, 'Required'),
    mobileNo: z.string().min(10, 'Enter valid mobile number'),
    department: z.string().min(1, 'Required'),
    designation: z.string().min(1, 'Required'),
    reportingOfficer: z.string(),
    altContact: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email().optional(),
    joiningDate: z.string().min(1, 'Required'),
    photograph: z.union([z.instanceof(File), z.string(), z.undefined()]).optional().default(undefined),
    resignDate: z.string().optional(),
});

const AddEmployee = () => {

    const { id: employeeId } = useParams();

    const isEditMode = !!employeeId;

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [reportingOfficers, setReportingOfficers] = useState([]);
    const [selectedReportingOfficer, setSelectedReportingOfficer] = useState(null);
    const navigate = useNavigate();

    const { addEmployee, updateEmployee } = useEmployee();
    const mutation = isEditMode ? updateEmployee : addEmployee;
    const { mutateAsync, isLoading, isError, error } = mutation;


    // query to  fetch the employee detail on component mount
    const {
        data: employeeData,
        // isLoading,
        isError: isEmployeeDetailError,
        error: employeeDetailError,
    } = useQuery({
        queryKey: [employeeId],
        queryFn: () => apiFetchEmployeeDetails(employeeId),
        enabled: !!employeeId, // Only run if employeeId exists,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the employee >>", res);
        },
        onError: (err) => {
            console.error("Error fetching employee detail:", err);
        }
    });

    useEffect(() => {
        if (employeeData?.data) {
            const editData = employeeData?.data?.data;
            console.log("employee fetched data>>", editData);


            form.reset({
                employeeName: editData?.name || '',
                mobileNo: editData?.mobile || '',
                department: editData?.department?.name || '',
                designation: editData?.designation || '',
                reportingOfficer: editData?.reportingOfficer?.name || '',
                altContact: editData?.altContact || '',
                address: editData?.address || '',
                email: editData?.email || '',
                joiningDate: editData?.dateOfJoining?.split('T')[0] || '',
                resignDate: editData?.dateOfResign?.split('T')[0] || '', // for later
                photograph: editData?.photoUrl || ''
            });

            form.setValue("designation", editData?.designation);

            setSelectedDept(editData?.department);
            setSelectedDesignation(editData?.designation);
            setSelectedReportingOfficer(editData?.reportingOfficer);

        }
    }, [employeeData]);



    console.log("isEditMode>>", isEditMode);




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
            resignDate: undefined, // for later
            photograph: undefined, // default
        },
    });




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
            if (data.photograph instanceof File) {
                formData.append('photo', data?.photograph);
            }
            if (data?.resignDate) {
                formData.append('dateOfResign', data.resignDate);
            }


            let res;
            if (isEditMode) {
                res = await mutateAsync({ employeeId: employeeId, payload: formData });
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
        const editData = employeeData?.data?.data;
        if (editData?.department) {
            setSelectedDept(editData?.department);
        }
        if (editData?.reportingOfficer) {
            setSelectedReportingOfficer(editData?.reportingOfficer);
        }
    }, [employeeData]);




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
        queryKey: ['', employeeId],
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
            <div className=' flex gap-2 items-center pb-2 border-b-2 mb-3 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>{employeeId ? "Edit Employee" : "Add Employee"}</h1>
            </div>

            {/* limit */}
            {/* <p className=' ml-auto bg-green-300 w-fit my-4 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p> */}

            {/* add employee form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleAddEmployee)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 border border-gray-300 rounded-md px-2 shadowx"
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
                    {isEmployeeDetailError && (
                        <Alert variant="destructive">{getErrorMessage(employeeDetailError)}</Alert>
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
                                <FormLabel>Designation</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedDesignation(value);
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Designation" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {designations?.map((desig) => (
                                            <SelectItem key={desig} value={desig}>
                                                {desig}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Photograph */}
                    <FormField
                        control={form.control}
                        name="photograph"
                        render={({ field }) => (
                            <FormItem className=" flex flex-col">
                                <FormLabel>Photograph</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file); // new file replaces old
                                                }
                                            }}
                                        />
                                        {typeof field.value === "string" && field.value && (
                                            <p className="text-sm font-bold text-gray-500 mt-1">Current: {field.value}</p>
                                        )}
                                        {field.value instanceof File && (
                                            <p className="text-sm font-bold text-green-600 mt-1">New: {field.value.name}</p>
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    {/* date of resign */}
                    {isEditMode && (
                        <FormField
                            control={form.control}
                            name="resignDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Resign</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}


                    <div className=" flex items-end mr-auto">
                        <Button type="submit" loading={isLoading} className=" ml-auto mt-3 bg-blue-950 hover:bg-blue-500 ">Save</Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default AddEmployee;
