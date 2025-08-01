import React, { useState } from 'react'
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



const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];


const personalLoanSchema = z.object({
    loanRequirementAmount: z.string().min(1, "Loan amount is required"),
    clientName: z.string().min(1, "Client name is required"),
    mobileNo: z
        .string()
        .min(10, "Mobile number must be at least 10 digits")
        .max(10, "Mobile number must be exactly 10 digits")
        .regex(/^\d{10}$/, "Invalid mobile number"),

    emailId: z.string().email("Invalid email").optional(),
    dateOfBirth: z.string().optional(),
    panNo: z
        .string()
        .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number")
        .optional(),
    aadharNo: z
        .string()
        .regex(/^\d{12}$/, "Aadhar number must be 12 digits")
        .optional(),

    maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
    spouseName: z.string().optional(),
    motherName: z.string().optional(),
    otherContactNo: z
        .string()
        .regex(/^\d{10}$/, "Other contact number must be 10 digits")
        .optional(),

    qualification: z.enum(["10th Pass", "12th Pass", "Graduate", "Post Graduate"]).optional(),

    residenceType: z.enum(["owned", "rented", "parental", "company"]).optional(),
    residentialAddress: z.string().optional(),
    residentialAddressTakenFrom: z.string().optional(),

    residenceStability: z.enum(["lessThan1Year", "1to3Years", "moreThan3Years"]).optional(),

    stateName: z.string().optional(),
    cityName: z.string().optional(),
    pinCode: z
        .string()
        .regex(/^\d{6}$/, "Pin code must be 6 digits")
        .optional(),
    employment: z.enum(["Salaried", "Self Employed"], {
        required_error: "Employment type is required",
    }),
    companyName: z.string().optional(),
    designation: z.string().optional(),
    companyAddress: z.string().optional(),
    netSalary: z
        .string()
        .regex(/^\d+$/, "Net salary must be a number")
        .optional(),

    salaryTransferMode: z.enum(["account", "cash", "cheque"]).optional(),

    jobPeriod: z.enum(["lessThan1Year", "1to2Years", "moreThan2Years"]).optional(),
    totalExperience: z.enum(["lessThan1Year", "1to2Years", "moreThan2Years"]).optional(),

    officialEmail: z.string().email("Invalid official email").optional(),
    officialNumber: z
        .string()
        .regex(/^\d{10}$/, "Official number must be 10 digits")
        .optional(),
    carName: z.string().optional(),
    manufacturingYear: z
        .string()
        .min(4, "Enter valid year")
        .max(4, "Year must be 4 digits"),
    fuelType: z.string().min(1, "Fuel type is required"),
    dependents: z
        .string()
        .regex(/^\d+$/, "Dependents must be a number")
        .optional(),

    creditCardOutstanding: z
        .string()
        .regex(/^\d+$/, "Outstanding amount must be a number")
        .optional(),

    runningLoans: z.array(
        z.object({
            loanType: z.string().optional(),
            loanAmount: z.string().optional(),
            bankName: z.string().optional(),
            emiAmount: z.string().optional(),
            paidEmi: z.string().optional(),
        })
    ).length(4),

    reference1: z.object({
        name: z.string().min(1, "Required"),
        mobile: z.string().min(1, "Required"),
        address: z.string().min(1, "Required"),
        relation: z.string().min(1, "Required"),
    }),

    reference2: z.object({
        name: z.string().min(1, "Required"),
        mobile: z.string().min(1, "Required"),
        address: z.string().min(1, "Required"),
        relation: z.string().min(1, "Required"),
    }),
    allocateTo: z.string().optional()
});





const UsedCarLoanForm = () => {

    const [cities, setCities] = useState([]);

    const form = useForm({
        resolver: zodResolver(personalLoanSchema),
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
            carName: "",
            manufacturingYear: "",
            fuelType: "",
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
            allocateTo: ""
        },
    });


    const handlePersonalLoan = async (values) => {
        console.log("Submitted values>>", values);

    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handlePersonalLoan)}
                className=" w-full mt-2 py-4 rounded-md"
            >

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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="lessThan1Year">Less than 1 year</SelectItem>
                                        <SelectItem value="1to3Years">1 to 3 years</SelectItem>
                                        <SelectItem value="moreThan3Years">More than 3 years</SelectItem>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="lessThan1Year">6 Months</SelectItem>
                                        <SelectItem value="1to2Years">1 Year</SelectItem>
                                        <SelectItem value="moreThan2Years">2 Year</SelectItem>
                                        <SelectItem value="moreThan3Years">3 Year +</SelectItem>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="lessThan1Year">6 Months</SelectItem>
                                        <SelectItem value="1to2Years">1 Year</SelectItem>
                                        <SelectItem value="moreThan2Years">2 Year</SelectItem>
                                        <SelectItem value="moreThan3Years">3 Year +</SelectItem>
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


                    {/* === Car Name === */}
                    <FormField
                        control={form.control}
                        name="carName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Car Name</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Manufacturing Year */}
                    <FormField
                        control={form.control}
                        name="manufacturingYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Manufacturing Year</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fuel Type */}
                    <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="petrol">Petrol</SelectItem>
                                        <SelectItem value="diesel">Diesel</SelectItem>
                                        <SelectItem value="cng">CNG</SelectItem>
                                        <SelectItem value="electric">Electric</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
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
                />


                <Button type="submit" className="bg-blue-800 text-white mt-4 ">SAVE</Button>

            </form>
        </Form>
    )
}

export default UsedCarLoanForm;
