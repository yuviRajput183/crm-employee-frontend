import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { apiGetAllReportingOfficer } from '@/services/employee.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useAdvisor } from '@/lib/hooks/useAdvisor';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { apiFetchAdvisorDetails } from '@/services/advisor.api';
import { apiGetCitiesByStateName } from '@/services/city.api';

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const formSchema = z.object({
    advisorName: z.string().min(1, 'Required'),
    companyName: z.string().optional(),
    mobileNo: z.string().min(10, 'Required'),
    altContactNo: z.string().optional(),
    email: z.string().email(),
    address: z.string().optional(),
    reportingOfficer: z.string().optional(),
    stateName: z.string().min(1, 'Required'),
    cityName: z.string().min(1, 'Required'),
    aadharNo: z.string().optional(),
    panNo: z.string().optional(),
    dateOfJoining: z.string().min(1, 'Required'),
    dateOfResign: z.string().optional(),
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNo: z.string().optional(),
    ifscCode: z.string().optional(),
    photograph: z
        .any()
        .refine((file) => {
            if (!file) return false;
            if (typeof file === 'string' && file.length > 0) return true; // Existing photo URL
            return file instanceof File || file?.length > 0; // New File or FileList
        }, {
            message: 'Photograph is required',
        }),
});


const AddAdvisor = () => {

    const { id: advisorId } = useParams();

    const [photoPreview, setPhotoPreview] = useState(null);
    const [reportingOfficers, setReportingOfficers] = useState([]);
    const [selectedReportingOfficer, setSelectedReportingOfficer] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [cities, setCities] = useState([]);
    const [savedCity, setSavedCity] = useState(null); // Store the advisor's city from API for later use
    const [savedReportingOfficer, setSavedReportingOfficer] = useState(null); // Store the advisor's reporting officer from API
    const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
    const fileInputRef = React.useRef(null);


    const navigate = useNavigate();

    const { addAdvisor, updateAdvisor } = useAdvisor();
    const { mutateAsync, isLoading, isError, error } = advisorId ? updateAdvisor : addAdvisor;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            advisorName: '',
            companyName: '',
            mobileNo: '',
            altContactNo: '',
            email: '',
            address: '',
            reportingOfficer: '',
            stateName: '',
            cityName: '',
            aadharNo: '',
            panNo: '',
            dateOfJoining: '',
            dateOfResign: '',
            bankName: '',
            accountHolderName: '',
            accountNo: '',
            ifscCode: '',
            photograph: null,
        },
    });

    const handleAddAdvisor = async (data) => {
        try {
            console.log('Form Submitted:', data);

            const formData = new FormData();

            formData.append('name', data.advisorName);
            formData.append('email', data.email);
            formData.append('mobile', data.mobileNo);
            formData.append('aadharNo', data.aadharNo);
            formData.append('accountHolderName', data.accountHolderName);
            formData.append('accountNumber', data.accountNo);
            formData.append('ifscCode', data.ifscCode);
            formData.append('address', data.address);
            formData.append('altContact', data.altContactNo);
            formData.append('bankName', data.bankName);
            formData.append('companyName', data.companyName);
            formData.append('stateName', data.stateName);
            formData.append('cityName', data.cityName);
            formData.append('reportingOfficer', selectedReportingOfficer?._id);
            formData.append('panNo', data.panNo);
            formData.append('dateOfJoining', data.dateOfJoining);
            if (data?.photograph) {
                formData.append('photo', data?.photograph);
            }
            if (data?.dateOfResign) {
                formData.append('dateOfResign', data?.dateOfResign);
            }
            formData.append('isPhotoRemoved', isPhotoRemoved);

            let res;
            if (advisorId) {
                // Edit Mode
                res = await mutateAsync({ formData, advisorId });
                console.log("✅ Advisor updated successfully:", res);
            } else {
                // Add Mode
                res = await mutateAsync(formData);
                console.log("✅ Advisor added successfully:", res);
            }


            form.reset(); // clear form
            if (res?.data?.success) {
                navigate("/admin/list_loan_advisor");
            }

        } catch (err) {
            console.error('❌ Error adding advisor:', err)
        }

    };



    // fetching all reporting officer on component mount
    const {
        isError: isReportingOfficersError,
        error: reportingOfficersError,
    } = useQuery({
        queryKey: [],
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


    // query to  fetch the advisor detail on component mount
    const {
        data: advisorData,
        // isLoading,
        isError: isAdvisorDetailError,
        error: advisorDetailError,
    } = useQuery({
        queryKey: [advisorId],
        queryFn: () => apiFetchAdvisorDetails(advisorId),
        enabled: !!advisorId, // Only run if advisorId exists,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the advisor >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisor detail:", err);
        }
    });

    console.log("advisorData>>", advisorData);


    useEffect(() => {
        if (advisorData?.data) {
            const advisor = advisorData?.data?.data;
            console.log("advisor>>", advisor);

            // Store the saved city and reporting officer for later use
            setSavedCity(advisor?.city);
            setSavedReportingOfficer(advisor?.reportingOfficer);

            // Set the state first to trigger cities fetch
            if (advisor?.city?.stateName) {
                setSelectedState(advisor.city.stateName);
            }

            form.reset({
                advisorName: advisor.name || '',
                companyName: advisor.companyName || '',
                mobileNo: advisor.mobile || '',
                altContactNo: advisor.altContact || '',
                email: advisor.email || '',
                address: advisor.address || '',
                reportingOfficer: advisor.reportingOfficer?.name || '',
                stateName: advisor?.city?.stateName || '',
                cityName: advisor?.city?._id || '', // Use city _id to match Select value
                aadharNo: advisor.aadharNo || '',
                panNo: advisor.panNo || '',
                dateOfJoining: advisor.dateOfJoining?.split('T')[0] || '',
                dateOfResign: advisor.dateOfResign?.split('T')[0] || '',
                bankName: advisor.bankName || '',
                accountHolderName: advisor.accountHolderName || '',
                accountNo: advisor.accountNumber || '',
                ifscCode: advisor.ifscCode || '',
                photograph: advisor.photoUrl || '',
            });

            if (advisor.photoUrl) {
                // Not setting photoPreview here because we will render existing photo using URL
                // unless we want to convert URL to blob which is complex and unnecessary.
                // Employee form used separate rendering for existing vs new.
                // setPhotoPreview(advisor.photoUrl); 
            }

            setIsPhotoRemoved(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setPhotoPreview(null);

            if (advisor.reportingOfficer) {
                setSelectedReportingOfficer(advisor.reportingOfficer);
            }
        }
    }, [advisorData]);



    // Query: Fetch cities when state changes
    const {
        isError: isCitiesError,
        error: citiesError,
    } = useQuery({
        queryKey: ['cities', selectedState],
        enabled: !!selectedState,
        queryFn: async () => {
            const res = await apiGetCitiesByStateName(selectedState);
            console.log("📦 queryFn response of fetching cities when state change:", res);
            setCities(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching cities:", err);
        }
    });

    // Set city value after cities are loaded (separate effect to avoid stale closure)
    useEffect(() => {
        if (advisorId && savedCity && cities.length > 0) {
            const matchedCity = cities.find(
                (city) => city._id === savedCity._id || city.cityName === savedCity.cityName
            );
            if (matchedCity) {
                form.setValue("cityName", matchedCity._id);
            }
        }
    }, [cities, savedCity, advisorId]);

    // Set reporting officer value after officers are loaded (separate effect to avoid stale closure)
    useEffect(() => {
        if (advisorId && savedReportingOfficer && reportingOfficers.length > 0) {
            const matchedOfficer = reportingOfficers.find(
                (officer) => officer._id === savedReportingOfficer._id || officer.name === savedReportingOfficer.name
            );
            if (matchedOfficer) {
                form.setValue("reportingOfficer", matchedOfficer.name);
                setSelectedReportingOfficer(matchedOfficer);
            }
        }
    }, [reportingOfficers, savedReportingOfficer, advisorId]);


    return (
        <div className='  p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>{advisorId ? "Edit Advisor Details" : "Add Advisor"}</h1>
            </div>

            {/* limit */}
            {/* <p className=' ml-auto bg-green-300 w-fit my-4 text-[15px]'>Advisor Licenses : 50 of 50 Used</p> */}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddAdvisor)} className=" border border-gray-200 p-2 py-4 mt-3">


                    {isReportingOfficersError && (
                        <Alert variant="destructive">{getErrorMessage(reportingOfficersError)}</Alert>
                    )}
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}
                    {isAdvisorDetailError && (
                        <Alert variant="destructive">{getErrorMessage(advisorDetailError)}</Alert>
                    )}
                    {isCitiesError && (
                        <Alert variant="destructive">{getErrorMessage(citiesError)}</Alert>
                    )}


                    {/* Basic Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-b-2 pb-2 border-black">

                        <FormField name="advisorName" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Advisor Name <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="companyName" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Company Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="mobileNo" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Mobile No <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="altContactNo" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Alternative Contact No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Email ID <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="address" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Address</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />


                        <FormField name="reportingOfficer" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Reporting Officer</FormLabel>
                                <Select value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const selected = reportingOfficers?.find((rof) => rof.name === value);
                                        setSelectedReportingOfficer(selected);
                                    }}
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
                            </FormItem>
                        )} />


                        {/* State */}
                        <FormField
                            control={form.control}
                            name="stateName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State Name <span className=' text-red-500'>*</span></FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            // const selected = indianStates?.find(() => dep.name === value);
                                            setSelectedState(value);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {indianStates.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* City */}
                        <FormField
                            control={form.control}
                            name="cityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City Name <span className=' text-red-500'>*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city?._id} value={city?._id}>
                                                    {city?.cityName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField name="aadharNo" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Aadhar No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="panNo" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>PAN No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="dateOfJoining" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Date of Joining <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {advisorId && <FormField name="dateOfResign" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Date of Resign <span className=' text-red-500'>*</span></FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />}
                    </div>

                    {/* Bank Section */}
                    <h1 className=" text-red-600 font-semibold py-4 border-b-2 border-black">Bank Account Details</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 border-b-2 pb-2 border-black mt-4">
                        <FormField name="bankName" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="accountHolderName" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Account Holder Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="accountNo" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>Account No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />

                        <FormField name="ifscCode" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel>IFSC Code</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )} />
                    </div>


                    {/* Photograph Upload */}
                    <div className="col-span-1 sm:col-span-2 border-b-2 pb-2 border-black">
                        <FormField name="photograph" control={form.control} render={({ field }) => (
                            <FormItem className=" flex flex-col gap-1">
                                <FormLabel className=" text-red-600 font-semibold py-4 border-b-2 border-black">Photograph <span className="text-sm">(150*150 pixels)</span></FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    field.onChange(file);
                                                    if (file) {
                                                        setIsPhotoRemoved(false);
                                                        const reader = new FileReader();
                                                        reader.onload = () => setPhotoPreview(reader.result);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Existing Photo */}
                                        {!photoPreview && !isPhotoRemoved && advisorData?.data?.data?.photoUrl && (
                                            <div className="mt-2 relative inline-block">
                                                <p className="text-sm font-bold text-gray-500 mb-1">Current Photo:</p>
                                                <div className="relative group">
                                                    <a
                                                        href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/uploads/images/${advisorData?.data?.data?.photoUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/uploads/images/${advisorData?.data?.data?.photoUrl}`}
                                                            alt="Current"
                                                            className="mt-2 border rounded w-[150px] h-[150px] object-cover"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsPhotoRemoved(true);
                                                            form.setValue('photograph', '');
                                                        }}
                                                        className="absolute top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove Photo"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* New Preview */}
                                        {photoPreview && (
                                            <div className="mt-2 relative inline-block">
                                                <p className="text-sm font-bold text-green-600 mb-1">New Photo Preview:</p>
                                                <div className="relative group">
                                                    <img
                                                        src={photoPreview}
                                                        alt="Preview"
                                                        className="mt-2 border rounded w-[150px] h-[150px] object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPhotoPreview(null);
                                                            setIsPhotoRemoved(false);
                                                            // Revert to original if available
                                                            const originalUrl = advisorData?.data?.data?.photoUrl || '';
                                                            form.setValue('photograph', originalUrl);
                                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                                        }}
                                                        className="absolute top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove New Photo"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* <Button type="submit" className="mt-4 bg-blue-800">Upload</Button> */}

                    </div>

                    {/* Submit */}
                    <div className="sm:col-span-2">
                        <Button type="submit" loading={isLoading} className="mt-4 bg-blue-800">Save</Button>
                    </div>

                </form>
            </Form>

        </div >
    )
}

export default AddAdvisor
