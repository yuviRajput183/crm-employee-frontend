import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
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
    insuranceType: z.string().min(1, "Required"),
    insuranceAmount: z.string().min(1, "Required"),
    clientName: z.string().min(1, "Required"),
    mobileNo: z.string().min(10, "Must be 10 digits"),
    emailId: z.string().email("Invalid email").optional(),
    dateOfBirth: z.string().optional(),
    panNo: z.string().optional(),
    aadharNo: z.string().optional(),
    spouseName: z.string().optional(),
    otherContactNo: z.string().optional(),
    maritalStatus: z.string().optional(),
    qualification: z.string().optional(),
    occupation: z.string().optional(),
    residentialAddress: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
    pinCode: z.string().optional(),
    nomineeName: z.string().optional(),
    relationWithNominee: z.string().optional(),
    monthlyIncome: z.string().optional(),
    allocateTo: z.string().optional()
});



const InsuranceForm = () => {

    const [cities, setCities] = useState([]);

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
            maritalStatus: "",
            qualification: "",
            occupation: "",
            residentialAddress: "",
            stateName: "",
            cityName: "",
            pinCode: "",
            nomineeName: "",
            relationWithNominee: "",
            monthlyIncome: "",
            allocateTo: ""
        },
    });



    const handleInsurance = async (values) => {
        console.log("Submitted values>>", values);

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleInsurance)}
                className=" w-full mt-2 py-4 rounded-md"
            >

                <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                    <h1 className=' font-semibold'>Client Details</h1>
                </div>

                <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  p-2 border border-gray-200 shadow mt-3 rounded '>

                    <FormField
                        control={form.control}
                        name="insuranceType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Insurance Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <FormLabel>Insurance Amount</FormLabel>
                                <Input {...field} placeholder="Enter amount" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Name</FormLabel>
                                <Input {...field} placeholder="Enter name" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile No</FormLabel>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10th">10th</SelectItem>
                                        <SelectItem value="12th">12th</SelectItem>
                                        <SelectItem value="graduate">Graduate</SelectItem>
                                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
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


                <div className=' p-2 bg-[#67C8FF] rounded-md shadow'>
                    <h1 className=' font-semibold'>Allocate To</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                    <FormField
                        control={form.control}
                        name="allocateTo"
                        render={({ field }) => (
                            <FormItem className="col-span-1 mt-2">
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Replace with dynamic user options if needed */}
                                            <SelectItem value="user1">User 1</SelectItem>
                                            <SelectItem value="user2">User 2</SelectItem>
                                            <SelectItem value="user3">User 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="bg-blue-800 text-white mt-4 ">SAVE</Button>



            </form>
        </Form>
    )
}

export default InsuranceForm
