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


const basicInfoSchema = z.object({
    servicesType: z.string().min(1, "Required"),
    description: z.string().optional(),
    amount: z.string().min(1, "Required"),
    clientName: z.string().min(1, "Required"),
    mobileNo: z.string().min(1, "Required"),
    emailId: z.string().email().optional(),
    dateOfBirth: z.string().optional(),
    panNo: z.string().optional(),
    aadhaarNo: z.string().optional(),
    maritalStatus: z.string().optional(),
    spouseName: z.string().optional(),
    otherContactNo: z.string().optional(),
    qualification: z.string().optional(),
    occupation: z.string().optional(),
    residentialAddress: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
    pinCode: z.string().optional(),
    nomineeName: z.string().optional(),
    relationWithNominee: z.string().optional(),
    monthlyIncome: z.string().optional()
});

const ServicesForm = () => {

    const [cities, setCities] = useState([]);

    const form = useForm({
        resolver: zodResolver(basicInfoSchema),
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
            maritalStatus: "",
            spouseName: "",
            otherContactNo: "",
            qualification: "",
            occupation: "",
            residentialAddress: "",
            stateName: "",
            cityName: "",
            pinCode: "",
            nomineeName: "",
            relationWithNominee: "",
            monthlyIncome: "",
        },
    });

    const handleServices = async (values) => {
        console.log("Submitted values>>", values);

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleServices)}
                className=" w-full mt-2 py-4 rounded-md"
            >

                <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                    <h1 className=' font-semibold'>Client Details</h1>
                </div>

                <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  p-2 border border-gray-200 shadow mt-3 rounded '>


                    <FormField
                        control={form.control}
                        name="servicesType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Services Type</FormLabel>
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
                            <FormLabel>Amount</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="clientName" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="mobileNo" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile No</FormLabel>
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
                                    <SelectItem value="single">Single</SelectItem>
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

export default ServicesForm
