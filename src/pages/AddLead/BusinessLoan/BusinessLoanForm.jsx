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
    creditCardOutstanding: z.string().regex(/^\d+$/, "Must be a number").optional(),
    pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits").optional(),
    businessName: z.string().optional(),
    annualTurnover: z.enum(["20 Lacs", "50 Lacs", "80 Lacs", "1 crore +"]).optional(),
    businessAddress: z.string().optional(),
    businessAddressTakenFrom: z.string().optional(),
    businessAge: z.enum(["6 months", "1 Year", "2 Year", "3 Year +"]).optional(),
    businessType: z.enum(["propritership", "partnership", "private limited"]).optional(),
    natureOfBusiness: z.enum(["manufacturing", "trading", "service", "retailer"]).optional(),
    businessRegistration: z.enum(["GST", "VAT", "TIN", "TAN", "MSME", "Labour license", "MSME certificate"]).optional(),
    noOfEmployees: z.string().regex(/^\d+$/, "Must be a number").optional(),
    businessPremises: z.enum(["owned", "rented"]).optional(),
    itrAvailable: z.enum(["1 year", "2 year", "3 year +"]).optional(),
    noOfDependent: z.string().regex(/^\d+$/, "Must be a number").optional(),
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
});





const HomeLoanForm = () => {

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
            businessName: '',
            annualTurnover: undefined,
            businessAddress: '',
            businessAddressTakenFrom: '',
            businessAge: undefined,
            businessType: undefined,
            natureOfBusiness: undefined,
            businessRegistration: undefined,
            noOfEmployees: '',
            businessPremises: undefined,
            itrAvailable: undefined,
            noOfDependent: '',
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
            }
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


                    {/* Other contact no */}
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
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Name */}
                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Annual Turnover */}
                    <FormField
                        control={form.control}
                        name="annualTurnover"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Annual Turnover</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="20 Lacs">20 Lacs</SelectItem>
                                        <SelectItem value="50 Lacs">50 Lacs</SelectItem>
                                        <SelectItem value="80 Lacs">80 Lacs</SelectItem>
                                        <SelectItem value="1 crore +">1 crore +</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Address */}
                    <FormField
                        control={form.control}
                        name="businessAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Address Taken From */}
                    <FormField
                        control={form.control}
                        name="businessAddressTakenFrom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Address Taken From</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Age */}
                    <FormField
                        control={form.control}
                        name="businessAge"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Age</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="6 months">6 months</SelectItem>
                                        <SelectItem value="1 Year">1 Year</SelectItem>
                                        <SelectItem value="2 Year">2 Year</SelectItem>
                                        <SelectItem value="3 Year +">3 Year +</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Type */}
                    <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="propritership">Propritership</SelectItem>
                                        <SelectItem value="partnership">Partnership</SelectItem>
                                        <SelectItem value="private limited">Private Limited</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nature of Business */}
                    <FormField
                        control={form.control}
                        name="natureOfBusiness"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nature of Business</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="trading">Trading</SelectItem>
                                        <SelectItem value="service">Service</SelectItem>
                                        <SelectItem value="retailer">Retailer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Registration Proof */}
                    <FormField
                        control={form.control}
                        name="businessRegistration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Registration Proof</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GST">GST</SelectItem>
                                        <SelectItem value="VAT">VAT</SelectItem>
                                        <SelectItem value="TIN">TIN</SelectItem>
                                        <SelectItem value="TAN">TAN</SelectItem>
                                        <SelectItem value="MSME">MSME</SelectItem>
                                        <SelectItem value="Labour license">Labour License</SelectItem>
                                        <SelectItem value="MSME certificate">MSME Certificate</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* No of Employees */}
                    <FormField
                        control={form.control}
                        name="noOfEmployees"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>No of Employees</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Business Premises */}
                    <FormField
                        control={form.control}
                        name="businessPremises"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Premises</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="owned">Owned</SelectItem>
                                        <SelectItem value="rented">Rented</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* How Many Year ITR Available */}
                    <FormField
                        control={form.control}
                        name="itrAvailable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How Many Year ITR Available</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1 year">1 Year</SelectItem>
                                        <SelectItem value="2 year">2 Year</SelectItem>
                                        <SelectItem value="3 year +">3 Year +</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* No of Dependent */}
                    <FormField
                        control={form.control}
                        name="noOfDependent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>No of Dependent</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Credit Card Outstanding Amount */}
                    <FormField
                        control={form.control}
                        name="creditCardOutstanding"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credit Card Outstanding Amount</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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

export default HomeLoanForm;
