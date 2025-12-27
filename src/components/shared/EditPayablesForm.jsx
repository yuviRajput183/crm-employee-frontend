import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import money from "@/assets/images/money.png"
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
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { apiFetchPayableDetails } from '@/services/payables.api';
import { apiListAdvisor } from '@/services/advisor.api';
import { usePayables } from '@/lib/hooks/usePayables';
import { useNavigate, useParams } from 'react-router-dom';

// Zod schema for edit payables form
const editPayablesFormSchema = z.object({
    // Required Fields
    leadId: z.string().min(1, "Lead No is required"),
    advisorId: z.string().min(1, "Advisor Name is required"),
    paymentAgainst: z.string().min(1, "Payment Against is required"),
    paidAmount: z.string().min(1, "Paid Amount is required"),
    paidDate: z.string().min(1, "Paid Date is required"),

    // Optional Fields
    loanServiceType: z.string().optional(),
    customerName: z.string().optional(),
    payableGstAmount: z.string().optional(),
    balancePayableAmount: z.string().optional(),
    refNo: z.string().optional(),
    remarks: z.string().optional(),

    // Banker Details
    bankName: z.string().optional(),
    bankerName: z.string().optional(),
    bankerDesignation: z.string().optional(),
    bankerMobileNo: z.string().optional(),
    bankerEmailId: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
});

const paymentAgainstOptions = [
    { value: "payable_amount", label: "Payable Amount" },
    { value: "gst_amount", label: "GST Amount" },
    { value: "advance", label: "Advance" },
    { value: "partial", label: "Partial Payment" },
    { value: "full", label: "Full Payment" },
];

const EditPayablesForm = () => {
    const { id: payableId } = useParams();
    console.log("payableId>>", payableId);
    const [advisors, setAdvisors] = useState([]);

    const navigate = useNavigate();

    // query to fetch the payable detail on component mount
    const {
        data: payableData,
        isError: isPayableDetailError,
        error: payableDetailError,
    } = useQuery({
        queryKey: ['payable-detail', payableId],
        queryFn: () => apiFetchPayableDetails(payableId),
        enabled: !!payableId,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the payable >>", res);
        },
        onError: (err) => {
            console.error("Error fetching payable detail:", err);
        }
    });

    // Query to fetch advisors list on component mount
    const {
        isError: isAdvisorsError,
        error: advisorsError,
    } = useQuery({
        queryKey: ['edit-payables-advisors-list'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisors:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching advisors list:", err);
        }
    });

    const form = useForm({
        resolver: zodResolver(editPayablesFormSchema),
        defaultValues: {
            leadId: "",
            advisorId: "",
            paymentAgainst: "",
            paidAmount: "",
            paidDate: "",
            loanServiceType: "",
            customerName: "",
            payableGstAmount: "",
            balancePayableAmount: "",
            refNo: "",
            remarks: "",
            bankName: "",
            bankerName: "",
            bankerDesignation: "",
            bankerMobileNo: "",
            bankerEmailId: "",
            stateName: "",
            cityName: "",
        },
    });

    const { updatePayable } = usePayables();
    const { mutateAsync, isLoading, isError, error } = updatePayable;

    const handleSubmit = async (data) => {
        console.log("Submitted values:", data);

        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== '') {
                    formData.append(key, data[key]);
                }
            });

            const res = await mutateAsync({ payableId, payload: formData });
            console.log("Payable updated successfully ....");

            if (res?.data?.success) {
                navigate('/admin/payable_payout');
            }
        } catch (error) {
            console.error('handleSubmit error:', error);
        }
    };

    useEffect(() => {
        if (payableData?.data) {
            const payable = payableData?.data?.data || {};
            console.log("payable>>", payable);

            form.reset({
                leadId: `${payable?.leadId?.leadNo} - ${payable?.leadId?.clientName}`,
                advisorId: payable?.advisorId?._id || '',
                paymentAgainst: payable?.paymentAgainst || '',
                paidAmount: payable?.paidAmount?.toString() || '',
                paidDate: payable?.paidDate?.split('T')[0] || '',
                loanServiceType: payable?.leadId?.productType || '',
                customerName: payable?.leadId?.clientName || '',
                payableGstAmount: payable?.payableGstAmount?.toString() || '',
                balancePayableAmount: payable?.balancePayableAmount?.toString() || '',
                refNo: payable?.refNo || '',
                remarks: payable?.remarks || '',
                bankName: payable?.bankerDetails?.bank?.name || '',
                bankerName: payable?.bankerDetails?.bankerName || '',
                bankerDesignation: payable?.bankerDetails?.designation || '',
                bankerMobileNo: payable?.bankerDetails?.mobile || '',
                bankerEmailId: payable?.bankerDetails?.email || '',
                stateName: payable?.bankerDetails?.city?.stateName || '',
                cityName: payable?.bankerDetails?.city?.cityName || '',
            });
        }
    }, [payableData, form]);

    return (
        <div className=' p-3 bg-white rounded shadow'>

            {isPayableDetailError && (
                <Alert variant="destructive">{getErrorMessage(payableDetailError)}</Alert>
            )}
            {isAdvisorsError && (
                <Alert variant="destructive">{getErrorMessage(advisorsError)}</Alert>
            )}

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Payable Payout</h1>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full mt-2 py-4 rounded-md"
                >
                    {/* Error Messages */}
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}

                    {/* Main Form Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-gray-200 shadow rounded">

                        {/* Lead No */}
                        <FormField
                            control={form.control}
                            name="leadId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lead No <span className="text-red-500">*</span></FormLabel>
                                    <Input readOnly {...field} className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Loan/Service Type */}
                        <FormField
                            control={form.control}
                            name="loanServiceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan/Service Type</FormLabel>
                                    <Input readOnly {...field} className="bg-gray-50" />
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
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Advisor Name */}
                        <FormField
                            control={form.control}
                            name="advisorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Advisor Name <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {advisors.map((advisor) => (
                                                <SelectItem key={advisor?._id} value={advisor?._id}>
                                                    {advisor?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payment Against */}
                        <FormField
                            control={form.control}
                            name="paymentAgainst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Against <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {paymentAgainstOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payable/GST Amount */}
                        <FormField
                            control={form.control}
                            name="payableGstAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payable/GST Amount</FormLabel>
                                    <Input {...field} className="bg-gray-50" readOnly />
                                </FormItem>
                            )}
                        />

                        {/* Paid Amount */}
                        <FormField
                            control={form.control}
                            name="paidAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paid Amount <span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Balance Payable Amount */}
                        <FormField
                            control={form.control}
                            name="balancePayableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Balance Payable Amount</FormLabel>
                                    <Input {...field} className="bg-gray-50" readOnly />
                                </FormItem>
                            )}
                        />

                        {/* Paid Date */}
                        <FormField
                            control={form.control}
                            name="paidDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paid Date <span className="text-red-500">*</span></FormLabel>
                                    <Input type="date" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ref. No (If Any) */}
                        <FormField
                            control={form.control}
                            name="refNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ref. No (If Any)</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        {/* Remarks */}
                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Banker Details Section */}
                    <div className="p-2 bg-[#67C8FF] rounded-md shadow mt-6">
                        <h1 className="font-semibold">Banker Details</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-gray-200 shadow mt-3 rounded">

                        {/* Bank Name - Non-editable */}
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Banker Name - Non-editable */}
                        <FormField
                            control={form.control}
                            name="bankerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banker Name</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Banker Designation - Non-editable */}
                        <FormField
                            control={form.control}
                            name="bankerDesignation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banker Designation</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Banker Mobile No - Non-editable */}
                        <FormField
                            control={form.control}
                            name="bankerMobileNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banker Mobile No</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Banker Email Id - Non-editable */}
                        <FormField
                            control={form.control}
                            name="bankerEmailId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banker Email Id</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* State Name - Non-editable */}
                        <FormField
                            control={form.control}
                            name="stateName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State Name</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* City Name - Non-editable */}
                        <FormField
                            control={form.control}
                            name="cityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City Name</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-800 text-white"
                        >
                            {isLoading ? 'SAVING...' : 'SAVE'}
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/payable_payout')}
                            type="button"
                            variant="outline"
                            className="bg-gray-500 text-white"
                        >
                            BACK
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    );
};

export default EditPayablesForm;
