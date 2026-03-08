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
import { apiListAdvisor } from '@/services/advisor.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { Alert } from '../ui/alert'

export default function ReportsFilterSection({ form, showFilter, handleFilter, hideStatus = false }) {
    const [advisors, setAdvisors] = useState([]);

    // query to fetch all advisors on component mount
    const {
        isError: isListAdvisorError,
        error: listAdvisorError,
    } = useQuery({
        queryKey: ['advisors-list'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
    });

    if (!showFilter) return null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFilter)}
                className={`grid grid-cols-2 ${hideStatus ? 'md:grid-cols-5' : 'md:grid-cols-6'} gap-2 p-3 mt-3 bg-white rounded shadow border border-gray-100 items-end`}
            >
                {isListAdvisorError && (
                    <div className="col-span-full">
                        <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
                    </div>
                )}

                {/* Loan/Service Type */}
                <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-xs text-gray-800">Loan/Service Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-9 text-xs">
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
                        </FormItem>
                    )}
                />

                {/* Advisor Name */}
                <FormField
                    control={form.control}
                    name="advisorName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-xs text-gray-800">Advisor Name</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {advisors?.map((advisor) => (
                                        <SelectItem key={advisor?._id} value={advisor?.name}>
                                            {advisor?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                {/* Status */}
                {!hideStatus && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-xs text-gray-800">Payout Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Received">Received</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                )}

                {/* Invoice From Date */}
                <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-xs text-gray-800">Invoice From Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} className="h-9 text-xs" />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Invoice To Date */}
                <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-xs text-gray-800">Invoice To Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} className="h-9 text-xs" />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex items-end">
                    <Button type="submit" className="w-full bg-[#337ab7] hover:bg-[#286090] text-white font-bold h-9">
                        SHOW
                    </Button>
                </div>
            </form>
        </Form>
    )
}
