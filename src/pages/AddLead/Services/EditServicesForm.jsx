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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetchLeadDetails, apiFetchDraftDetails, apiListAllocatedTo } from '@/services/lead.api';
import { apiGetCitiesByStateName } from '@/services/city.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useLead } from '@/lib/hooks/useLead';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import services from '@/assets/images/services.png';
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


const servicesSchema = z.object({
    servicesType: z.string().min(1, "Services Type is Required"),
    description: z.string().optional(),
    amount: z.string().min(1, "Amount is Required"),
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


    maritalStatus: z.enum(["married", "unmarried"]).optional(),
    spouseName: z.string().optional(),
    otherContactNo: z.string().optional().refine(val => !val || /^\d{10}$/.test(val), {
        message: "Other contact number must be 10 digits",
    }),
    qualification: z.enum(["10th Pass", "12th Pass", "Graduate", "Post Graduate"]).optional(),
    occupation: z.enum(["salaried", "self employeed", "professional"]).optional(),
    runningLoans: z.array(
        z.object({
            loanType: z.string().optional(),
            loanAmount: z.union([z.string(), z.number()]).optional(),
            bankName: z.string().optional(),
            emiAmount: z.union([z.string(), z.number()]).optional(),
            paidEmi: z.union([z.string(), z.number()]).optional(),
        })
    ).length(4),
    residentialAddress: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
    pinCode: z.string().optional(),
    nomineeName: z.string().optional(),
    relationWithNominee: z.string().optional(),
    monthlyIncome: z
        .string()
        .optional()
        .refine(val => !val || /^[0-9]+$/.test(val), {
            message: "Income must be a number",
        }),
    allocateTo: z.string().optional(),
    loanFeedback: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    bankerId: z.string().optional(),
});

const EditServicesForm = () => {

    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const { id: leadId } = useParams();
    const [searchParams] = useSearchParams();
    const isDraft = searchParams.get('isDraft') === 'true';
    console.log("leadId>>", leadId, "isDraft>>", isDraft);

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


    const [selectedState, setSelectedState] = useState(null);
    const [allocatedToUsers, setAllocatedToUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [history, setHistory] = useState([]);
    const [savedCityName, setSavedCityName] = useState(null); // Store the lead's city from API for later use



    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(servicesSchema),
        defaultValues: {
            servicesType: "",
            description: "",
            amount: "",
            clientName: "",
            mobileNo: "",
            emailId: "",
            dateOfBirth: "",
            panNo: "",
            aadhaarNo: "",
            maritalStatus: undefined,
            spouseName: "",
            otherContactNo: "",
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



    const handleServices = async (data) => {
        console.log("Submitted values>>", data);

        try {
            const fd = new FormData();

            // Required fixed fields
            fd.append('productType', 'Services');
            fd.append('advisorId', selectedAdvisor);
            fd.append('servicesType', data.servicesType);
            if (data.description) fd.append("description", data.description);
            fd.append('amount', data.amount);
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
                const returnPath = searchParams.get('returnPath');
                if (returnPath) {
                    navigate(returnPath);
                } else {
                    navigate("/admin/my_leads");
                }
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

            // Store the saved city name for later use
            if (lead?.cityName) {
                setSavedCityName(lead?.cityName);
            }

            if (lead?.history) {
                setHistory(lead.history);
            }


            form.reset({
                servicesType: lead?.servicesType || '',
                description: lead?.description || '',
                amount: lead?.amount?.toString() || '',
                clientName: lead?.clientName || '',
                mobileNo: lead?.mobileNo?.toString() || '',
                emailId: lead?.emailId || '',
                dateOfBirth: lead?.dob?.split('T')[0] || '',
                panNo: lead?.panNo || '',
                aadharNo: lead?.aadharNo || '',
                maritalStatus: lead?.maritalStatus || undefined,
                spouseName: lead?.spouseName || '',
                otherContactNo: lead?.otherContactNo?.toString() || '',
                qualification: lead?.qualification || undefined,
                occupation: lead?.occupation || undefined,
                residentialAddress: lead?.residentialAddress || '',
                stateName: lead?.stateName || '',
                cityName: lead?.cityName || '',
                cityName: lead?.cityName || '',
                pinCode: lead?.pinCode?.toString() || '',

                nomineeName: lead?.nomineeName || '',
                relationWithNominee: lead?.relationWithNominee || '',
                monthlyIncome: lead?.monthlyIncome?.toString() || '',
                runningLoans: (() => {
                    const loans = lead?.runningLoans || [];
                    if (loans.length === 4) return loans;
                    const needed = 4 - loans.length;
                    if (needed < 0) return loans.slice(0, 4);
                    return [
                        ...loans,
                        ...Array(needed).fill({
                            loanType: '',
                            loanAmount: 0,
                            bankName: '',
                            emiAmount: 0,
                            paidEmi: 0
                        })
                    ];
                })(),

                allocateTo: lead?.allocatedTo?._id || "",
                loanFeedback: lead?.loanFeedback ?? "",
                remarks: lead?.remarks ?? "",
            });

            setSelectedAdvisor(lead?.advisorId?._id);


        }
    }, [leadData, form]);

    // Set city value after cities are loaded (separate effect to avoid stale closure)
    useEffect(() => {
        if (leadId && savedCityName && cities.length > 0) {
            const matchedCity = cities.find(
                (city) => city.cityName === savedCityName
            );
            if (matchedCity) {
                form.setValue("cityName", matchedCity.cityName);
            }
        }
    }, [cities, savedCityName, leadId, form]);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {isLeadDetailError && (
                <Alert variant="destructive">{getErrorMessage(leadDetailError)}</Alert>
            )}


            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={services} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Services</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleServices, (errors) => console.log("Form Validation Errors:", errors))}
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
                            name="servicesType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Services Type<span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ITR">ITR</SelectItem>
                                            <SelectItem value="GST returns">GST returns</SelectItem>
                                            <SelectItem value="GST registration">GST registration</SelectItem>
                                            <SelectItem value="MSME/Shop Act Registration">MSME/Shop Act Registration</SelectItem>
                                            <SelectItem value="FSSAI">FSSAI</SelectItem>
                                            <SelectItem value="others">others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField name="description" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="amount" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount<span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="clientName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Name<span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="mobileNo" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile No<span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="emailId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Id</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="dateOfBirth" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="panNo" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>PAN No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="aadhaarNo" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aadhar No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="maritalStatus" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marital Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unmarried">Unmarried</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="spouseName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Spouse Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="otherContactNo" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Other Contact No</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="qualification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualification</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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


                        <FormField name="residentialAddress" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Residential Address</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

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
                                                <SelectItem key={city?._id} value={city?.cityName}>
                                                    {city?.cityName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField name="pinCode" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pin Code</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="nomineeName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nominee Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="relationWithNominee" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relation with Nominee</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="monthlyIncome" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Income</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

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
                                prefilledBankerDetails={leadData?.data?.data?.bankerId}
                            />
                        );
                    })()}

                    <Button loading={isLoading} type="submit" className="bg-blue-800 text-white mt-4 ">SAVE</Button>


                </form>


            </Form>
        </div>


    )
}

export default EditServicesForm
