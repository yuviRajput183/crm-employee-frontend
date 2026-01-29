import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import CommonLoanSections from '@/components/CommonLoanSections';
import { useQuery } from '@tanstack/react-query';
import { apiGetCitiesByStateName } from '@/services/city.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLead } from '@/lib/hooks/useLead';
import { apiFetchLeadDetails, apiFetchDraftDetails } from '@/services/lead.api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import homeLoan from '@/assets/images/homeLoan.jpg';
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


const homeLoanSchema = z.object({
    // Required
    loanRequirementAmount: z.string().min(1, "Loan amount is required"),
    clientName: z.string().min(1, "Client name is required"),
    mobileNo: z
        .string()
        .regex(/^\d{10}$/, "Mobile number must be 10 digits"),

    // Optional with conditional validation
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

    maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
    spouseName: z.string().optional(),
    motherName: z.string().optional(),

    otherContactNo: z.string().optional().refine(val => !val || /^\d{10}$/.test(val), {
        message: "Other contact number must be 10 digits",
    }),

    qualification: z.enum(["10th Pass", "12th Pass", "Graduate", "Post Graduate"]).optional(),

    residenceType: z.enum(["owned", "rented", "parental", "company"]).optional(),
    residentialAddress: z.string().optional(),
    residentialAddressTakenFrom: z.string().optional(),

    residenceStability: z.enum(["1Year", "2Years", "3Years"]).optional(),

    stateName: z.string().optional(),
    cityName: z.string().optional(),

    pinCode: z.string().optional().refine(val => !val || /^\d{6}$/.test(val), {
        message: "Pin code must be 6 digits",
    }),

    employment: z.enum(["Salaried", "Self Employed"], {
        required_error: "Employment type is required",
    }),

    companyName: z.string().optional(),
    designation: z.string().optional(),
    companyAddress: z.string().optional(),

    netSalary: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
        message: "Net salary must be a number",
    }),

    salaryTransferMode: z.enum(["account", "cash", "cheque"]).optional(),

    jobPeriod: z.enum(["6Months", "1Year", "2Years", "3Years+"]).optional(),
    totalExperience: z.enum(["6Months", "1Year", "2Years", "3Years+"]).optional(),

    officialEmail: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid official email",
    }),

    officialNumber: z.string().optional().refine(val => !val || /^\d{10}$/.test(val), {
        message: "Official number must be 10 digits",
    }),

    propertyType: z.enum(["sale deed", "bba", "gpa", "gpa registered"]).optional(),

    propertyMarketValue: z.string().optional(),
    propertyTotalArea: z.string().optional(),
    propertyAddress: z.string().optional(),

    dependents: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
        message: "Dependents must be a number",
    }),

    creditCardOutstanding: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
        message: "Outstanding amount must be a number",
    }),

    runningLoans: z.array(
        z.object({
            loanType: z.string().optional(),
            loanAmount: z.union([z.string(), z.number()]).optional(),
            bankName: z.string().optional(),
            emiAmount: z.union([z.string(), z.number()]).optional(),
            paidEmi: z.union([z.string(), z.number()]).optional(),
        })
    ).length(4),

    reference1: z.object({
        name: z.string().optional(),
        mobile: z.string().optional(),
        address: z.string().optional(),
        relation: z.string().optional(),
    }),

    reference2: z.object({
        name: z.string().optional(),
        mobile: z.string().optional(),
        address: z.string().optional(),
        relation: z.string().optional(),
    }),

    attachmentType: z.string().optional(),
    uploadFile: z.any().optional(), // For file uploads, we use z.any() since File objects are complex
    filePassword: z.string().optional(),
    allocateTo: z.string().optional(),
    loanFeedback: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    bankerId: z.string().optional(),
});





const EditHomeLoanForm = () => {

    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const { id: leadId } = useParams();
    const [searchParams] = useSearchParams();
    const isDraft = searchParams.get('isDraft') === 'true';
    console.log("leadId>>", leadId, "isDraft>>", isDraft);

    const [selectedState, setSelectedState] = useState(null);
    const [cities, setCities] = useState([]);
    const [history, setHistory] = useState([]);
    const [savedCityName, setSavedCityName] = useState(null);
    const [uploadedDocuments, setUploadedDocuments] = useState([]); // Store the lead's city from API for later use


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


    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(homeLoanSchema),
        defaultValues: {
            loanRequirementAmount: '',
            clientName: '',
            mobileNo: '',
            emailId: '',
            dateOfBirth: '',
            panNo: '',
            aadharNo: '',
            maritalStatus: undefined,
            spouseName: '',
            motherName: '',
            otherContactNo: '',
            qualification: undefined,
            residenceType: undefined,
            residentialAddress: '',
            residentialAddressTakenFrom: '',
            residenceStability: undefined,
            stateName: '',
            cityName: '',
            pinCode: '',
            employment: "Salaried",      // Default value
            companyName: '',
            designation: '',
            companyAddress: '',
            netSalary: '',
            salaryTransferMode: undefined,
            jobPeriod: undefined,
            totalExperience: undefined,
            officialEmail: '',
            officialNumber: '',
            propertyType: undefined,     // Select field - starts unselected
            propertyMarketValue: "",
            propertyTotalArea: "",
            propertyAddress: "",
            dependents: '',
            creditCardOutstanding: '',
            runningLoans: [
                { loanType: '', loanAmount: '', bankName: '', emiAmount: '', paidEmi: '' },
                { loanType: '', loanAmount: '', bankName: '', emiAmount: '', paidEmi: '' },
                { loanType: '', loanAmount: '', bankName: '', emiAmount: '', paidEmi: '' },
                { loanType: '', loanAmount: '', bankName: '', emiAmount: '', paidEmi: '' },
            ],
            reference1: {
                name: '',
                mobile: '',
                address: '',
                relation: ''
            },
            reference2: {
                name: '',
                mobile: '',
                address: '',
                relation: ''
            },
            attachmentType: '',
            uploadFile: null,
            filePassword: '',
            allocateTo: "",
            loanFeedback: null,
            remarks: '',
        },
    });


    const { updateLead } = useLead();
    const { mutateAsync, isLoading, isError, error } = updateLead;


    const handleHomeLoan = async (data) => {

        console.log("Submitted values>>", data);
        try {
            const fd = new FormData();

            // Required fixed fields
            fd.append('productType', 'Home Loan');
            fd.append('advisorId', selectedAdvisor);
            fd.append('loanRequirementAmount', data.loanRequirementAmount);
            fd.append('clientName', data.clientName);
            fd.append('mobileNo', data.mobileNo);

            // Optional personal info
            if (data.emailId) fd.append('emailId', data.emailId);
            if (data.dateOfBirth) fd.append('dob', data.dateOfBirth);
            if (data.panNo) fd.append('panNo', data.panNo);
            if (data.aadharNo) fd.append('aadharNo', data.aadharNo);
            if (data.maritalStatus) fd.append('maritalStatus', data.maritalStatus);
            if (data.spouseName) fd.append('spouseName', data.spouseName);
            if (data.motherName) fd.append('motherName', data.motherName);
            if (data.otherContactNo) fd.append('otherContactNo', data.otherContactNo);
            if (data.qualification) fd.append('qualification', data.qualification);
            if (data.residenceType) fd.append('residenceType', data.residenceType);
            if (data.residentialAddress) fd.append('residentialAddress', data.residentialAddress);
            if (data.residentialAddressTakenFrom) fd.append('residentialAddressTakenFrom', data.residentialAddressTakenFrom);
            if (data.residenceStability) fd.append('residentialStability', data.residenceStability);
            if (data.stateName) fd.append('stateName', data.stateName);
            if (data.cityName) fd.append('cityName', data.cityName);
            if (data.pinCode) fd.append('pinCode', data.pinCode);

            // Employment info

            if (data.companyName) fd.append('companyName', data.companyName);
            if (data.designation) fd.append('designation', data.designation);
            if (data.companyAddress) fd.append('companyAddress', data.companyAddress);
            if (data.netSalary) fd.append('netSalary', data.netSalary);
            if (data.salaryTransferMode) fd.append('salaryTransferMode', data.salaryTransferMode);
            if (data.jobPeriod) fd.append('jobPeriod', data.jobPeriod);
            if (data.totalExperience) fd.append('totalJobExperience', data.totalExperience);
            if (data.officialEmail) fd.append('officialEmailId', data.officialEmail);
            if (data.officialNumber) fd.append('officialNumber', data.officialNumber);

            if (data.employment) fd.append('employment', data.employment);
            if (data.propertyType) fd.append('propertyType', data.propertyType);
            if (data.propertyMarketValue) fd.append('propertyMarketValue', data.propertyMarketValue);
            if (data.propertyTotalArea) fd.append('propertyTotalArea', data.propertyTotalArea);
            if (data.propertyAddress) fd.append('propertyAddress', data.propertyAddress);

            if (data.dependents) fd.append('noOfDependent', data.dependents);
            if (data.creditCardOutstanding) fd.append('creditCardOutstandingAmount', data.creditCardOutstanding);

            // Running loans as JSON string
            // Filter out empty loans and convert string numbers to actual numbers
            const validRunningLoans = data.runningLoans
                .filter(loan => loan.loanType || loan.loanAmount || loan.bankName || loan.emiAmount || loan.paidEmi)
                .map(loan => ({
                    loanType: loan.loanType || '',
                    loanAmount: loan.loanAmount ? Number(loan.loanAmount) : 0,
                    bankName: loan.bankName || '',
                    emiAmount: loan.emiAmount ? Number(loan.emiAmount) : 0,
                    paidEmi: loan.paidEmi ? Number(loan.paidEmi) : 0
                }));

            if (validRunningLoans.length > 0) {
                fd.append('runningLoans', JSON.stringify(validRunningLoans));
            }


            //  References as JSON string
            const validReferences = [];
            if (data.reference1.name || data.reference1.mobile || data.reference1.address || data.reference1.relation) {
                validReferences.push({
                    name: data.reference1.name || '',
                    mobileNo: data.reference1.mobile || '',
                    address: data.reference1.address || '',
                    relation: data.reference1.relation || ''
                });
            }
            if (data.reference2.name || data.reference2.mobile || data.reference2.address || data.reference2.relation) {
                validReferences.push({
                    name: data.reference2.name || '',
                    mobileNo: data.reference2.mobile || '',
                    address: data.reference2.address || '',
                    relation: data.reference2.relation || ''
                });
            }

            if (validReferences.length > 0) {
                fd.append('references', JSON.stringify(validReferences));
            }


            //  Documents as JSON string (if file upload)
            // if (data.uploadFile) {
            //     const documentData = [{
            //         attachmentType: data.attachmentType || '',
            //         password: data.filePassword || ''
            //     }];
            //     fd.append('document', JSON.stringify(documentData));
            //     // fd.append('file', data.uploadFile);
            // }


            //  Documents - append each file and metadata
            if (uploadedDocuments.length > 0) {
                uploadedDocuments.forEach((doc) => {
                    fd.append('documents', doc.file);
                });
                const documentsMetadata = uploadedDocuments.map(doc => ({
                    attachmentType: doc.attachmentType,
                    password: doc.password || ''
                }));
                fd.append('documentsMetadata', JSON.stringify(documentsMetadata));
            }



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
    };



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
                loanRequirementAmount: lead?.loanRequirementAmount?.toString() || '',
                clientName: lead?.clientName || '',
                mobileNo: lead?.mobileNo?.toString() || '',
                emailId: lead?.emailId || '',
                dateOfBirth: lead?.dob?.split('T')[0] || '',
                panNo: lead?.panNo || '',
                aadharNo: lead?.aadharNo || '',
                maritalStatus: lead?.maritalStatus || undefined,
                spouseName: lead?.spouseName || '',
                motherName: lead?.motherName || '',
                otherContactNo: lead?.otherContactNo?.toString() || '',
                qualification: lead?.qualification || undefined,
                residenceType: lead?.residenceType || undefined,
                residentialAddress: lead?.residentialAddress || '',
                residentialAddressTakenFrom: lead?.residentialAddressTakenFrom || '',
                residenceStability: lead?.residentialStability || undefined,
                stateName: lead?.stateName || '',
                cityName: lead?.cityName || '',
                pinCode: lead?.pinCode?.toString() || '',
                companyName: lead?.companyName || '',
                designation: lead?.designation || '',
                companyAddress: lead?.companyAddress || '',
                netSalary: lead?.netSalary?.toString() || '',
                salaryTransferMode: lead?.salaryTransferMode || undefined,
                jobPeriod: lead?.jobPeriod || undefined,
                totalExperience: lead?.totalJobExperience || undefined,
                officialEmail: lead?.officialEmailId || '',
                officialNumber: lead?.officialNumber?.toString() || '',

                employment: lead?.employment || undefined,
                propertyType: lead?.propertyType || undefined,
                propertyMarketValue: lead?.propertyMarketValue?.toString() || '',
                propertyTotalArea: lead?.propertyTotalArea || '',
                propertyAddress: lead?.propertyAddress || '',

                dependents: lead?.noOfDependent?.toString() || '',
                creditCardOutstanding: lead?.creditCardOutstandingAmount?.toString() || '',
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
                reference1: {
                    name: lead?.references[0]?.name || '',
                    mobile: lead?.references[0]?.mobileNo?.toString() || '',
                    address: lead?.references[0]?.address || '',
                    relation: lead?.references[0]?.relation || ''
                },
                reference2: {
                    name: lead?.references[1]?.name || '',
                    mobile: lead?.references[1]?.mobileNo?.toString() || '',
                    address: lead?.references[1]?.address || '',
                    relation: lead?.references[1]?.relation || ''
                },
                attachmentType: '',
                uploadFile: null,
                filePassword: '',
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
                    <AvatarImage src={homeLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Home Loan</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleHomeLoan, (errors) => console.log("Form Validation Errors:", errors))}
                    className=" w-full mt-2 py-4 rounded-md"
                >

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

                        {/* Loan Requirement Amount */}
                        <FormField
                            control={form.control}
                            name="loanRequirementAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Requirement Amount <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Client Name */}
                        <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name <span className="text-red-500">*</span></FormLabel>
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

                        {/* Email Id */}
                        <FormField
                            control={form.control}
                            name="emailId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Id</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Date of Birth */}
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* PAN No */}
                        <FormField
                            control={form.control}
                            name="panNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PAN No</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* Aadhar No */}
                        <FormField
                            control={form.control}
                            name="aadharNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aadhar No</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Marital Status */}
                        <FormField
                            control={form.control}
                            name="maritalStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marital Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Unmarried">Unmarried</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Spouse Name */}
                        <FormField
                            control={form.control}
                            name="spouseName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Spouse Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Mother Name */}
                        <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mother Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="otherContactNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Other Contact No</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Qualification */}
                        <FormField
                            control={form.control}
                            name="qualification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualification</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="10th Pass">10th Pass</SelectItem>
                                            <SelectItem value="12th Pass">12th Pass</SelectItem>
                                            <SelectItem value="Graduate">Graduate</SelectItem>
                                            <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="residenceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residence Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="owned">Owned</SelectItem>
                                            <SelectItem value="rented">Rented</SelectItem>
                                            <SelectItem value="parental">Parental</SelectItem>
                                            <SelectItem value="company">Company Accommodation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="residentialAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residential Address</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="residentialAddressTakenFrom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residential Address Taken From</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="residenceStability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residence Stability</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1Year">1 Year</SelectItem>
                                            <SelectItem value="2Years">2 Year</SelectItem>
                                            <SelectItem value="3Years">3 Year +</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
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


                        <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pin Code</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* === Employment === */}
                        <FormField
                            control={form.control}
                            name="employment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employment <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue value={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Salaried">Salaried</SelectItem>
                                            <SelectItem value="Self Employed">Self Employed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Address</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Designation</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="netSalary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Net Salary</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="salaryTransferMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salary Transfer Mode</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="account">Account Transfer</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="jobPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Period (Current Company)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="6Months">6 Months</SelectItem>
                                            <SelectItem value="1Year">1 Year</SelectItem>
                                            <SelectItem value="2Years">2 Year</SelectItem>
                                            <SelectItem value="3Years+">3 Year +</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="totalExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Job Experience</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="6Months">6 Months</SelectItem>
                                            <SelectItem value="1Year">1 Year</SelectItem>
                                            <SelectItem value="2Years">2 Year</SelectItem>
                                            <SelectItem value="3Years+">3 Year +</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="officialEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Official Email ID</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="officialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Official Number</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* === Property Type === */}
                        <FormField
                            control={form.control}
                            name="propertyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="sale deed">Sale Deed</SelectItem>
                                            <SelectItem value="bba">BBA</SelectItem>
                                            <SelectItem value="gpa">GPA</SelectItem>
                                            <SelectItem value="gpa registered">GPA Registered</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* === Property Market Value === */}
                        <FormField
                            control={form.control}
                            name="propertyMarketValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Market Value</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* === Property Total Area === */}
                        <FormField
                            control={form.control}
                            name="propertyTotalArea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Total Area</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* === Property Address === */}
                        <FormField
                            control={form.control}
                            name="propertyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Address</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="dependents"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No. of Dependents</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="creditCardOutstanding"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Card Outstanding Amount</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <CommonLoanSections
                        form={form}
                        isEdit={!!leadId}
                        existingDocuments={leadData?.data?.data?.documents || []}
                        onDocumentsChange={setUploadedDocuments}
                    />

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

                    {(() => {
                        try {
                            const profile = JSON.parse(localStorage.getItem("profile"));
                            const role = profile?.role?.toLowerCase();
                            if (role === "advisor") return null;
                        } catch (e) { }
                        return <Button loading={isLoading} type="submit" className="bg-blue-800 text-white mt-4 ">UPLOAD</Button>;
                    })()}

                </form>
            </Form>
        </div>
    )
}

export default EditHomeLoanForm;
