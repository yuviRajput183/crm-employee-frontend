import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useQuery } from '@tanstack/react-query';
import { apiFetchLeadDetails, apiFetchDraftDetails, apiListAllocatedTo } from '@/services/lead.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { apiGetCitiesByStateName } from '@/services/city.api';
import { useLead } from '@/lib/hooks/useLead';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import insurance from '@/assets/images/insurance.jpg';
import HistoryTable from '@/components/shared/HistoryTable';
import LeadAllocationFeedback from '@/components/shared/LeadAllocationFeedback';



const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const insuranceFormSchema = z.object({
    // Required Fields
    insuranceType: z.string().min(1, "Insurance Type is required"),
    insuranceAmount: z.string().min(1, "Insurance Amount is required"),
    clientName: z.string().min(1, "Client Name is required"),
    mobileNo: z.string().min(10, "Mobile No must be at least 10 digits").max(10, "Mobile No must be at most 10 digits"),


    emailId: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid email",
    }),
    dateOfBirth: z.string().optional(),

    panNo: z.string().optional().refine(val => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
        message: "Invalid PAN number",
    }),

    aadharNo: z.string().optional().refine(val => !val || /^\d{12}$/.test(val), {
        message: "Aadhar number must be 12 digits",
    }),

    spouseName: z.string().optional(),
    otherContactNo: z.string().optional().refine(val => !val || /^\d{10}$/.test(val), {
        message: "Other contact number must be 10 digits",
    }),

    maritalStatus: z.enum(["married", "divorced"]).optional(),
    qualification: z.enum(["10th Pass", "12th Pass", "Graduate", "Post Graduate"]).optional(),

    occupation: z.enum(["salaried", "self employeed", "professional"]).optional(),

    residentialAddress: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
    pinCode: z.string().optional().refine(val => !val || /^\d{6}$/.test(val), {
        message: "Pin code must be 6 digits",
    }),

    nomineeName: z.string().optional(),
    relationWithNominee: z.string().optional(),
    monthlyIncome: z
        .string()
        .optional()
        .refine(val => !val || /^[0-9]+$/.test(val), {
            message: "Income must be a number",
        }),
    allocateTo: z.string().optional(),
    loanFeedback: z.string().optional(),
    remarks: z.string().optional(),
    bankerId: z.string().optional(),
});



const EditInsuranceForm = () => {

    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const { id: leadId } = useParams();
    const [searchParams] = useSearchParams();
    const isDraft = searchParams.get('isDraft') === 'true';
    console.log("leadId>>", leadId, "isDraft>>", isDraft);
    const [history, setHistory] = useState([]);

    // query to  fetch the lead/draft detail on component mount
    const {
        data: leadData,
        // isLoading,
        isError: isLeadDetailError,
        error: leadDetailError,
    } = useQuery({
        queryKey: [leadId, isDraft],
        queryFn: () => isDraft ? apiFetchDraftDetails(leadId) : apiFetchLeadDetails(leadId),
        enabled: !!leadId, // Only run if employeeId exists,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the lead/draft >>", res);
        },
        onError: (err) => {
            console.error("Error fetching lead/draft detail:", err);
        }
    });

    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [allocatedToUsers, setAllocatedToUsers] = useState([]);

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(insuranceFormSchema),
        defaultValues: {
            insuranceType: "",
            insuranceAmount: "",
            clientName: "",
            mobileNo: "",
            emailId: "",
            dateOfBirth: "",
            panNo: "",
            aadharNo: "",
            spouseName: "",
            otherContactNo: "",
            maritalStatus: undefined,
            qualification: undefined,
            occupation: undefined,
            residentialAddress: "",
            stateName: "",
            cityName: "",
            pinCode: "",
            nomineeName: "",
            relationWithNominee: "",
            monthlyIncome: "",
            allocateTo: "",
            loanFeedback: null,
            remarks: '',
        },
    });


    const { updateLead } = useLead();
    const { mutateAsync, isLoading, isError, error } = updateLead;

    const handleInsurance = async (data) => {
        console.log("Submitted values>>", data);

        try {
            const fd = new FormData();

            // Required fixed fields
            fd.append('productType', 'Insurance');
            fd.append('advisorId', selectedAdvisor);
            fd.append('insuranceType', data.insuranceType);
            fd.append('insuranceAmount', data.insuranceAmount);
            fd.append('clientName', data.clientName);
            fd.append('mobileNo', data.mobileNo);

            // Optional personal info
            if (data.emailId) fd.append('emailId', data.emailId);
            if (data.dateOfBirth) fd.append('dob', data.dateOfBirth);
            if (data.panNo) fd.append('panNo', data.panNo);
            if (data.aadharNo) fd.append('aadharNo', data.aadharNo);
            if (data.maritalStatus) fd.append('maritalStatus', data.maritalStatus);
            if (data.spouseName) fd.append('spouseName', data.spouseName);
            if (data.otherContactNo) fd.append('otherContactNo', data.otherContactNo);
            if (data.qualification) fd.append('qualification', data.qualification);
            if (data.occupation) fd.append("occupation", data.occupation);
            if (data.residentialAddress) fd.append('residentialAddress', data.residentialAddress);
            if (data.stateName) fd.append('stateName', data.stateName);
            if (data.cityName) fd.append('cityName', data.cityName);
            if (data.pinCode) fd.append('pinCode', data.pinCode);

            // Employment info

            if (data.nomineeName) fd.append('nomineeName', data.nomineeName);
            if (data.relationWithNominee) fd.append('relationWithNominee', data.relationWithNominee);
            if (data.monthlyIncome) fd.append('monthlyIncome', data.monthlyIncome);


            // Allocated To
            if (data.allocateTo) {
                fd.append('allocatedTo', data.allocateTo);
            }

            if (data.loanFeedback) {
                fd.append('feedback', data.loanFeedback);
            }

            if (data.remarks) {
                fd.append('remarks', data.remarks);
            }

            if (data.bankerId) {
                fd.append('bankerId', data.bankerId);
            }

            const res = await mutateAsync({
                leadId,
                payload: fd
            });
            console.log('✅ Personal Loan lead added successfully:', res);

            form.reset(); // clear form
            if (res?.data?.success) {
                navigate("/admin/my_leads");
            }


        } catch (error) {
            console.error('handlePersonalLoan error:', error);
            // show user error message, etc.
        }
    }


    // query to  fetch all the allocated To users on component mount
    const {
        isError: isListAllocatedToError,
        error: listAllocatedToError,
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListAllocatedTo();
            console.log("📦 queryFn response of list allocated To users:", res);
            setAllocatedToUsers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list allocated To Users:", err);
        }
    });


    // Query: Fetch cities when state changes
    const {
        isError: isCitiesError,
        error: citiesError,
    } = useQuery({
        queryKey: [selectedState],
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



    // setting the default values of the field.
    useEffect(() => {

        if (leadData?.data) {
            const lead = leadData?.data?.data;
            console.log("lead data >>", lead);

            // Set selected state for cities dropdown
            if (lead?.stateName) {
                setSelectedState(lead?.stateName);
            }

            if (lead?.history) {
                setHistory(lead.history);
            }

            form.reset({
                insuranceType: lead?.insuranceType || '',
                insuranceAmount: lead?.insuranceAmount?.toString() || '',
                clientName: lead?.clientName || '',
                mobileNo: lead?.mobileNo || '',
                emailId: lead?.emailId || '',
                dateOfBirth: lead?.dob?.split('T')[0] || '',
                panNo: lead?.panNo || '',
                aadharNo: lead?.aadharNo || '',
                maritalStatus: lead?.maritalStatus || undefined,
                spouseName: lead?.spouseName || '',
                // motherName: lead?.motherName || '',
                otherContactNo: lead?.otherContactNo || '',
                qualification: lead?.qualification || undefined,
                occupation: lead?.occupation || undefined,
                residentialAddress: lead?.residentialAddress || '',
                stateName: lead?.stateName || '',
                cityName: lead?.cityName || '',
                pinCode: lead?.pinCode || '',

                nomineeName: lead?.nomineeName || '',
                relationWithNominee: lead?.relationWithNominee || '',
                monthlyIncome: lead?.monthlyIncome?.toString() || '',

                allocateTo: lead?.allocatedTo?._id || "",
                loanFeedback: lead?.loanFeedback ?? null,
                remarks: lead?.remarks ?? null,
            });

            setSelectedAdvisor(lead?.advisorId?._id);
            form.setValue("cityName", lead?.cityName);


        }
    }, [leadData, form]);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {isLeadDetailError && (
                <Alert variant="destructive">{getErrorMessage(leadDetailError)}</Alert>
            )}


            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={insurance} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Insurance</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleInsurance)}
                    className=" w-full mt-2 py-4 rounded-md"
                >

                    {isListAllocatedToError && (
                        <Alert variant="destructive">{getErrorMessage(listAllocatedToError)}</Alert>
                    )}
                    {isCitiesError && (
                        <Alert variant="destructive">{getErrorMessage(citiesError)}</Alert>
                    )}
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}


                    <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                        <h1 className=' font-semibold'>Client Details</h1>
                    </div>

                    <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  p-2 border border-gray-200 shadow mt-3 rounded '>

                        <FormField
                            control={form.control}
                            name="insuranceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Insurance Type<span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Life insurance", "Health insurance", "Car insurance", "Team Insurance", "Commercial Vehicle insurance", "Bike insurance", "Group insurance"].map(item => (
                                                <SelectItem key={item} value={item}>{item}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="insuranceAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Insurance Amount<span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} placeholder="Enter amount" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name<span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} placeholder="Enter name" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mobileNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile No<span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} placeholder="Enter mobile number" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emailId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Id</FormLabel>
                                    <Input {...field} placeholder="Enter email" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Input type="date" {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="panNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PAN No</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="aadharNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aadhar No</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maritalStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marital Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="spouseName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Spouse Name</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="otherContactNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Other Contact No</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="qualification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualification</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10th Pass">10th Pass</SelectItem>
                                            <SelectItem value="12th Pass">12th Pass</SelectItem>
                                            <SelectItem value="Graduate">Graduate</SelectItem>
                                            <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="salaried">Salaried</SelectItem>
                                            <SelectItem value="self employeed">Self Employeed</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="residentialAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residential Address</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stateName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State Name</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedState(value);
                                        }}
                                        defaultValue={field.value}
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


                        <FormField
                            control={form.control}
                            name="cityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City Name</FormLabel>
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


                        <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pin Code</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nomineeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nominee Name</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="relationWithNominee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation with Nominee</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="monthlyIncome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Income</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                    </div>


                    {/* <div className=' p-2 bg-[#67C8FF] rounded-md shadow'>
                        <h1 className=' font-semibold'>Allocate To</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                        <FormField
                            control={form.control}
                            name="allocateTo"
                            render={({ field }) => (
                                <FormItem className="col-span-1 mt-2">
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allocatedToUsers?.map((allocate) => (
                                                    <SelectItem key={allocate?._id} value={allocate?._id}>{allocate?.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div> */}

                    <HistoryTable
                        data={history}
                    />

                    {(() => {
                        try {
                            const profile = JSON.parse(localStorage.getItem("profile"));
                            const role = profile?.role?.toLowerCase();
                            if (role === "advisor") return null;
                        } catch (e) { }
                        return (
                            <LeadAllocationFeedback
                                form={form}
                                leadId={leadId}
                            />
                        );
                    })()}

                    <Button loading={isLoading} type="submit" className="bg-blue-800 text-white mt-4 ">UPDATE</Button>



                </form>
            </Form>
        </div>
    )
}

export default EditInsuranceForm
