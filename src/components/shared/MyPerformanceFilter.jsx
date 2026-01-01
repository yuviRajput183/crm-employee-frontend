import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { apiListBank } from '@/services/bank.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { Alert } from '../ui/alert'


export default function MyPerformanceFilter({ form, showFilter, handleFilter }) {

    const [banks, setBanks] = useState([]);

    // Query to fetch all banks on component mount
    const {
        isError: isBankListError,
        error: bankListError,
    } = useQuery({
        queryKey: ['banks-list'],
        queryFn: async () => {
            const res = await apiListBank();
            console.log("📦 queryFn response of list banks:", res);
            setBanks(res?.data?.data?.banks || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching banks:", err);
        }
    });


    if (!showFilter) return null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFilter)}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 mt-3 bg-white rounded shadow border border-gray-200"
            >

                {isBankListError && (
                    <Alert variant="destructive" className="col-span-full">{getErrorMessage(bankListError)}</Alert>
                )}

                {/* Product Type */}
                <FormField
                    control={form.control}
                    name="loanServiceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Product Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Product Types</SelectItem>
                                    <SelectItem value="Instant Loan">Instant Loan</SelectItem>
                                    <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                                    <SelectItem value="Business Loan">Business Loan</SelectItem>
                                    <SelectItem value="Home Loan">Home Loan</SelectItem>
                                    <SelectItem value="Loan Against Property">Loan Against Property</SelectItem>
                                    <SelectItem value="Car Loan">Car Loan</SelectItem>
                                    <SelectItem value="Used Car Loan">Used Car Loan</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Insurance">Insurance</SelectItem>
                                    <SelectItem value="Private Funding">Private Funding</SelectItem>
                                    <SelectItem value="Professional Loan">Professional Loan</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Bank Name */}
                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks?.map((bank) => (
                                        <SelectItem key={bank?._id} value={bank?.bankName}>
                                            {bank?.bankName}
                                        </SelectItem>
                                    ))}
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
                    <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">
                        SHOW
                    </Button>
                </div>
            </form>
        </Form>
    )
}
