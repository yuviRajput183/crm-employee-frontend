import React from 'react'
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


const attachmentTypeOptions = [
    'PAN Card',
    'Aadhar Card',
    'Residence Proof',
    'Salary Slip 1',
    'Salary Slip 2',
    'Salary Slip 3',
    'Bank Statement',
    'Form 16 (If Available)',
    'Office ID Card (If Available)',
    'Loan Statement (If Any)',
    'Other Docs (If Any)',
];


const CommonLoanSections = ({ form }) => {
    return (
        <>
            <div className=' p-2 bg-[#67C8FF] rounded-md shadow'>
                <h1 className=' font-semibold'>Any Running Loan?</h1>
            </div>

            <div className="w-full overflow-x-auto p-2 border border-gray-200 shadow rounded">
                {/* === Running Loans Section (up to 4 loans) === */}
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="min-w-[850px] grid grid-cols-5 gap-4 mb-4">
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.loanType`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Type</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.loanAmount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Amount</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.bankName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.emiAmount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>EMI Amount</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.paidEmi`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paid EMI</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>References 1</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="reference1.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile No</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.relation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>References 2</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="reference2.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile No</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.relation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>Upload Documents</h1>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="attachmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attachment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {attachmentTypeOptions.map((option, index) => (
                                        <SelectItem key={index} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="uploadFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Upload</FormLabel>
                            <FormControl>
                                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="filePassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password (If Any)</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="bg-blue-800 text-white h-10 mt-5 shadow">UPLOAD</Button>
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
        </>
    )
}

export default CommonLoanSections
