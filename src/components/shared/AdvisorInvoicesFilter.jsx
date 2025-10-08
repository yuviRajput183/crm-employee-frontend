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
import { apiCustomerByAdvisorId } from '@/services/lead.api'



export default function AdvisorInvoicesFilter({ form, showFilter, handleFilter }) {




    const [advisors, setAdvisors] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [customers, setCustomers] = useState([]);

    console.log("selected advisor details in filter >>", selectedAdvisor);




    // query to  fetch all the advisor on component mount
    const {
        isError: isListAdvisorError,
        error: listAdvisorError,
    } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisor:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisords:", err);
        }
    });

    // query to fetch customer by advisor id
    const {
        isError: isCustomerError,
        error: customerError,
    } = useQuery({
        queryKey: [selectedAdvisor],
        enabled: !!selectedAdvisor,
        queryFn: async () => {
            const res = await apiCustomerByAdvisorId({ advisorId: selectedAdvisor?._id });
            console.log("📦 queryFn response of fetching customer when advisor change:", res);
            setCustomers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching customer:", err);
        }
    });


    if (!showFilter) return null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFilter)}
                className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 mt-3 bg-white rounded shadow"
            >

                {isListAdvisorError && (
                    <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
                )}
                {isCustomerError && (
                    <Alert variant="destructive">{getErrorMessage(customerError)}</Alert>
                )}


                {/* Loan Type */}
                <FormField
                    control={form.control}
                    name="loanServiceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loan Type</FormLabel>
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
                                    {/* <SelectItem value="Services">Services</SelectItem> */}
                                    <SelectItem value="Private Funding">Private Funding</SelectItem>
                                    <SelectItem value="Professional Loan">Professional Loan</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Advisor Name */}
                <FormField
                    control={form.control}
                    name="advisorName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Advisor Name</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value); // update form
                                    const advisorObj = advisors.find((a) => a.name === value);
                                    setSelectedAdvisor(advisorObj || null); // update selectedAdvisor state
                                }}
                            >
                                <SelectTrigger className=' outline-none'>
                                    <SelectValue placeholder="Select Advisor Name" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {advisors?.map((advisor) => (
                                        <SelectItem
                                            key={advisor?._id}
                                            value={advisor?.name}
                                            className="whitespace-normal break-words outline-none"
                                        >
                                            {advisor?.name} - {advisor?.advisorCode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                {/* Customer Name */}
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {customers?.map((customer) => (
                                        <SelectItem key={customer?._id} value={customer?.clientName}>
                                            {customer?.clientName}
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
                                <Input type="date" {...field} />
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
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Show Button */}
                <div className="  mt-2 flex items-end justify-end">
                    <Button type="submit" className=" w-full">
                        SHOW
                    </Button>
                </div>
            </form>
        </Form>
    )
}
