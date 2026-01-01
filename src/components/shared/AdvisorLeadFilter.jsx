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
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';


export default function AdvisorLeadFilter({ form, showFilter, handleFilter }) {

    if (!showFilter) return null;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFilter)}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 mt-3 bg-white rounded shadow border border-gray-100"
            >
                {/* Product Type */}
                <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Instant Loan">Instant Loan</SelectItem>
                                    <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                                    <SelectItem value="Business Loan">Business Loan</SelectItem>
                                    <SelectItem value="Home Loan">Home Loan</SelectItem>
                                    <SelectItem value="Loan Against Property">Loan Against Property</SelectItem>
                                    <SelectItem value="Car Loan">Car Loan</SelectItem>
                                    <SelectItem value="Used Car Loan">Used Car Loan</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Insurance">Insurance</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                    <SelectItem value="Private Funding">Private Funding</SelectItem>
                                    <SelectItem value="Professional Loan">Professional Loan</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Lead Feedback */}
                <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lead Feedback</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Allocated">Allocated</SelectItem>
                                    <SelectItem value="Docs Query">Docs Query</SelectItem>
                                    <SelectItem value="Loan Approved">Loan Approved</SelectItem>
                                    <SelectItem value="Loan Disbursed">Loan Disbursed</SelectItem>
                                    <SelectItem value="Loan Rejected">Loan Rejected</SelectItem>
                                    <SelectItem value="Under Process">Under Process</SelectItem>
                                    <SelectItem value="Premium/ BI Fetched">Premium/ BI Fetched</SelectItem>
                                    <SelectItem value="Shared with Client">Shared with Client</SelectItem>
                                    <SelectItem value="Client Denied">Client Denied</SelectItem>
                                    <SelectItem value="Payment Done">Payment Done</SelectItem>
                                    <SelectItem value="Policy Issued">Policy Issued</SelectItem>
                                    <SelectItem value="Payout Received">Payout Received</SelectItem>
                                    <SelectItem value="Documents Completed">Documents Completed</SelectItem>
                                    <SelectItem value="Invoice Raised">Invoice Raised</SelectItem>
                                    <SelectItem value="Fees Received">Fees Received</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* From Date */}
                <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From Date</FormLabel>
                            <FormControl>
                                <Input type="date" placeholder="DD/MM/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* To Date */}
                <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To Date</FormLabel>
                            <FormControl>
                                <Input type="date" placeholder="DD/MM/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Show Button */}
                <div className="flex items-end">
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        SHOW
                    </Button>
                </div>
            </form>
        </Form>
    )
}
