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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from '@tanstack/react-query';
import { apiGetUserProfile } from '@/services/user.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { UserRound } from 'lucide-react';

const profileFormSchema = z.object({
    employeeName: z.string().min(1, 'Required'),
    mobileNo: z.string().min(1, 'Required'),
    department: z.string().optional(),
    designation: z.string().optional(),
    reportingOfficer: z.string().optional(),
    address: z.string().optional(),
    altContact: z.string().optional(),
    email: z.string().email().optional(),
    joiningDate: z.string().optional(),
    photograph: z.any().optional(),
});

const Profile = () => {
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = React.useRef(null);

    const {
        data: profileData,
        isLoading: isProfileLoading,
        isError: isProfileError,
        error: profileError,
    } = useQuery({
        queryKey: ['user-profile'],
        queryFn: apiGetUserProfile,
        refetchOnWindowFocus: false,
    });

    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            employeeName: '',
            mobileNo: '',
            department: '',
            designation: '',
            reportingOfficer: '',
            address: '',
            altContact: '',
            email: '',
            joiningDate: '',
            photograph: '',
        },
    });

    useEffect(() => {
        if (profileData?.data?.data) {
            const profile = profileData.data.data;
            form.reset({
                employeeName: profile.name || '',
                mobileNo: profile.mobile || '',
                department: profile.department?.name || '',
                designation: profile.designation || '',
                reportingOfficer: profile.reportingOfficer?.name || '',
                address: profile.address || '',
                altContact: profile.altContact || '',
                email: profile.email || '',
                joiningDate: profile.dateOfJoining?.split('T')[0] || '',
                photograph: profile.photoUrl || '',
            });
        }
    }, [profileData, form]);

    const onSubmit = (data) => {
        console.log("Form data:", data);
        // Implement update profile if needed
    };

    return (
        <div className="p-6 bg-white rounded shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <UserRound className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">My Profile</h1>
            </div>

            {isProfileError && (
                <Alert variant="destructive" className="mb-6">
                    {getErrorMessage(profileError)}
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border rounded-lg shadow-sm">

                        {/* Employee Name */}
                        <FormField
                            control={form.control}
                            name="employeeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee Name <span className="text-red-500">*</span></FormLabel>
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
                                    <FormLabel>Mobile No <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department Name */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department Name</FormLabel>
                                    <FormControl>
                                        <Select disabled value={field.value || ""}>
                                            <SelectTrigger className="bg-gray-50">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.value && <SelectItem value={field.value}>{field.value}</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Designation Name */}
                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Designation Name</FormLabel>
                                    <FormControl>
                                        <Select disabled value={field.value || ""}>
                                            <SelectTrigger className="bg-gray-50">
                                                <SelectValue placeholder="Select Designation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.value && <SelectItem value={field.value}>{field.value}</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                    <FormControl>
                                        <Select disabled value={field.value || ""}>
                                            <SelectTrigger className="bg-gray-50">
                                                <SelectValue placeholder="Select Officer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.value && <SelectItem value={field.value}>{field.value}</SelectItem>}
                                            </SelectContent>
                                        </Select>
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

                        {/* Email Id */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Id</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                <FormItem>
                                    <FormLabel>Date of Joining</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled className="bg-gray-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Photograph Section */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-red-500">Photograph <span className="text-gray-500 font-normal">(Size 150 * 150 pixels)</span></h2>
                        <div className="pb-4 border-b"></div>

                        <div className="space-y-4">
                            <div className="w-40 h-40 border-2 border-gray-200 rounded overflow-hidden bg-gray-50">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : form.watch('photograph') ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/uploads/images/${form.watch('photograph')}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    // onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Input
                                    type="file"
                                    className="w-fit"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => setPhotoPreview(reader.result);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <Button type="button" variant="secondary" className="w-fit bg-blue-600 hover:bg-blue-700 text-white uppercase text-xs font-bold py-1 px-4 tracking-wider">
                                    Upload
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white uppercase font-bold py-2 px-8 tracking-wider">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Profile;
