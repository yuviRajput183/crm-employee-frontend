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
import { apiFetchReceivableDetails, apiFetchReceivableBankerDetails, apiGetInvoiceMasterByLeadId } from '@/services/receivables.api';
import { useReceivables } from '@/lib/hooks/useReceivables';
import { useNavigate, useParams } from 'react-router-dom';

// Zod schema for edit receivables form
const editReceivablesFormSchema = z.object({
    // Required Fields
    leadId: z.string().min(1, "Lead No is required"),
    receivableAmount: z.string().min(1, "Received Amount is required"),
    receivedDate: z.string().min(1, "Received Date is required"),

    // Optional Fields
    loanServiceType: z.string().optional(),
    customerName: z.string().optional(),
    advisorName: z.string().optional(),
    paymentAgainst: z.string().optional(),
    receivableGstAmount: z.string().optional(),
    balanceReceivableAmount: z.string().optional(),
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
    { value: "receivableAmount", label: "Receivable Amount" },
    { value: "gstPayment", label: "GST Amount" },
];

const EditReceivablesForm = () => {
    const { id: receivableId } = useParams();
    console.log("receivableId>>", receivableId);
    const [leadId, setLeadId] = useState(null);
    const [selectedPaymentAgainst, setSelectedPaymentAgainst] = useState(null);
    const [maxReceivableAmount, setMaxReceivableAmount] = useState(0);
    const [invoiceMasterData, setInvoiceMasterData] = useState(null);

    const navigate = useNavigate();

    // query to fetch the receivable detail on component mount
    const {
        data: receivableData,
        isError: isReceivableDetailError,
        error: receivableDetailError,
    } = useQuery({
        queryKey: ['receivable-detail', receivableId],
        queryFn: () => apiFetchReceivableDetails(receivableId),
        enabled: !!receivableId,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the receivable >>", res);
        },
        onError: (err) => {
            console.error("Error fetching receivable detail:", err);
        }
    });

    // query to fetch the banker details of the lead
    // const {
    //     data: bankerData,
    //     isError: isBankerDetailError,
    //     error: bankerDetailError,
    // } = useQuery({
    //     queryKey: ['receivable-banker', leadId],
    //     queryFn: () => apiFetchReceivableBankerDetails(leadId),
    //     enabled: !!leadId,
    //     refetchOnWindowFocus: false,
    //     onSuccess: (res) => {
    //         console.log("fetched banker data of the receivable >>", res);
    //     },
    //     onError: (err) => {
    //         console.error("Error fetching banker data of the receivable detail:", err);
    //     }
    // });

    // console.log("banker details data >>>", bankerData);

    const form = useForm({
        resolver: zodResolver(editReceivablesFormSchema),
        defaultValues: {
            leadId: "",
            receivableAmount: "",
            receivedDate: "",
            loanServiceType: "",
            customerName: "",
            advisorName: "",
            paymentAgainst: "",
            receivableGstAmount: "",
            balanceReceivableAmount: "",
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

    const { updateReceivable } = useReceivables();
    const { mutateAsync, isLoading, isError, error } = updateReceivable;

    const handleSubmit = async (data) => {
        console.log("Submitted values:", data);

        try {
            // Field name mapping: frontend name -> backend name
            const fieldMapping = {
                'receivableGstAmount': 'receivableAmount',  // Receivable/GST Amount -> receivableAmount
                'receivableAmount': 'receivedAmount',        // Received Amount -> receivedAmount
                'balanceReceivableAmount': 'balanceAmount',  // Balance Receivable Amount -> balanceAmount
            };

            // Build payload object with correct backend names
            const payload = {};
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== '') {
                    // Use mapped name if exists, otherwise use original key
                    const backendKey = fieldMapping[key] || key;
                    payload[backendKey] = data[key];
                }
            });

            // Add invoiceMasterId if available
            if (invoiceMasterData?._id) {
                payload.invoiceMasterId = invoiceMasterData._id;
            }

            const res = await mutateAsync({ receivableId, payload });
            console.log("Receivable updated successfully ....");

            if (res?.data?.success) {
                navigate('/admin/receivables_payout');
            }
        } catch (error) {
            console.error('handleSubmit error:', error);
        }
    };

    useEffect(() => {
        if (receivableData?.data) {
            const receivable = receivableData?.data?.data || {};
            console.log("receivable>>", receivable);

            // Map API response fields to form fields correctly
            // API: receivableAmount -> Form: receivableGstAmount (Receivable/GST Amount)
            // API: receivedAmount -> Form: receivableAmount (Received Amount)
            // API: balanceAmount -> Form: balanceReceivableAmount (Balance Receivable Amount)
            form.reset({
                leadId: `${receivable?.leadId?.leadNo} - ${receivable?.leadId?.clientName}`,
                receivableAmount: receivable?.receivedAmount?.toString() || '',  // Received Amount
                receivedDate: receivable?.receivedDate?.split('T')[0] || '',
                loanServiceType: receivable?.leadId?.productType || '',
                customerName: receivable?.leadId?.clientName || '',
                advisorName: receivable?.advisorDisplayName || receivable?.leadId?.advisorId?.name || '',
                paymentAgainst: receivable?.paymentAgainst || '',
                receivableGstAmount: receivable?.receivableAmount?.toString() || '',  // Receivable/GST Amount
                balanceReceivableAmount: receivable?.balanceAmount?.toString() || '',  // Balance Amount
                refNo: receivable?.refNo || '',
                remarks: receivable?.remarks || '',
                bankName: receivable?.bankerDetails?.bank?.name || '',
                bankerName: receivable?.bankerDetails?.bankerName || '',
                bankerDesignation: receivable?.bankerDetails?.designation || '',
                bankerMobileNo: receivable?.bankerDetails?.mobile || '',
                bankerEmailId: receivable?.bankerDetails?.email || '',
                stateName: receivable?.bankerDetails?.stateName || '',
                cityName: receivable?.bankerDetails?.city?.cityName || '',
            });

            setLeadId(receivable.leadId?._id);
            setSelectedPaymentAgainst(receivable?.paymentAgainst || null);
            // Store invoice master data from the receivable response
            if (receivable?.invoiceMasterId) {
                setInvoiceMasterData(receivable.invoiceMasterId);
            }

            // Set initial max receivable amount from existing data (receivableAmount from API)
            const maxAmount = parseFloat(receivable?.receivableAmount) || 0;
            setMaxReceivableAmount(maxAmount);
        }
    }, [receivableData, form]);

    // Query to fetch invoice master details when Payment Against is changed
    const {
        isLoading: isInvoiceMasterLoading,
        isError: isInvoiceMasterError,
        error: invoiceMasterError,
    } = useQuery({
        queryKey: ['invoice-master-by-lead-edit', leadId, selectedPaymentAgainst],
        enabled: !!leadId && !!selectedPaymentAgainst,
        queryFn: async () => {
            const res = await apiGetInvoiceMasterByLeadId(leadId);
            console.log("📦 Invoice master response (edit):", res);
            setInvoiceMasterData(res?.data?.data || null);
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching invoice master:", err);
        }
    });

    // Effect to populate form fields when invoice master data is received
    useEffect(() => {
        if (invoiceMasterData && selectedPaymentAgainst) {
            // Map Receivable/GST Amount based on payment against selection
            const gstAmount = invoiceMasterData?.remainingGstAmount || 0;
            const receivableAmount = invoiceMasterData?.remainingReceivableAmount || 0;

            // Set Receivable/GST Amount field to remainingGstAmount
            form.setValue('receivableGstAmount', String(gstAmount));
            setMaxReceivableAmount(gstAmount);

            // Set Balance Receivable Amount to remainingReceivableAmount initially
            form.setValue('balanceReceivableAmount', String(receivableAmount));

            // Map Received Date to createdAt from API response
            if (invoiceMasterData?.createdAt) {
                const createdAtDate = new Date(invoiceMasterData.createdAt);
                const formattedDate = createdAtDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                form.setValue('receivedDate', formattedDate);
            }

            // Reset received amount when payment against changes
            form.setValue('receivableAmount', '');
        }
    }, [invoiceMasterData, selectedPaymentAgainst, form]);

    // Handler for Received Amount change with validation
    const handleReceivedAmountChange = (e, fieldOnChange) => {
        const inputValue = e.target.value;
        const numericValue = parseFloat(inputValue) || 0;
        const receivableAmount = parseFloat(form.getValues('receivableGstAmount')) || 0;

        // Validate that received amount is not greater than max receivable amount
        if (numericValue <= receivableAmount) {
            fieldOnChange(inputValue);
            // Calculate and update Balance Receivable Amount
            const balance = receivableAmount - numericValue;
            form.setValue('balanceReceivableAmount', String(balance.toFixed(2)));
        } else {
            // If input exceeds max, set to max value
            fieldOnChange(String(receivableAmount));
            form.setValue('balanceReceivableAmount', '0');
        }
    };


    return (
        <div className=' p-3 bg-white rounded shadow'>

            {isReceivableDetailError && (
                <Alert variant="destructive">{getErrorMessage(receivableDetailError)}</Alert>
            )}
            {/* {isBankerDetailError && (
                <Alert variant="destructive">{getErrorMessage(bankerDetailError)}</Alert>
            )} */}

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Receivable Payout</h1>
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
                            name="advisorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Advisor Name</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Payment Against */}
                        <FormField
                            control={form.control}
                            name="paymentAgainst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Against</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedPaymentAgainst(value);
                                        }}
                                        value={field.value}
                                    >
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
                                </FormItem>
                            )}
                        />

                        {/* Receivable/GST Amount */}
                        <FormField
                            control={form.control}
                            name="receivableGstAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Receivable/GST Amount</FormLabel>
                                    <Input {...field} className="bg-gray-50" readOnly />
                                </FormItem>
                            )}
                        />

                        {/* Received Amount */}
                        <FormField
                            control={form.control}
                            name="receivableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Received Amount <span className="text-red-500">*</span></FormLabel>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={maxReceivableAmount}
                                        {...field}
                                        onChange={(e) => handleReceivedAmountChange(e, field.onChange)}
                                    />
                                    <FormMessage />
                                    {maxReceivableAmount > 0 && (
                                        <p className="text-xs text-gray-500">Max: {maxReceivableAmount}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        {/* Balance Receivable Amount */}
                        <FormField
                            control={form.control}
                            name="balanceReceivableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Balance Receivable Amount</FormLabel>
                                    <Input {...field} className="bg-gray-50" readOnly />
                                </FormItem>
                            )}
                        />

                        {/* Received Date */}
                        <FormField
                            control={form.control}
                            name="receivedDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Received Date <span className="text-red-500">*</span></FormLabel>
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
                            onClick={() => navigate('/admin/receivables_payout')}
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

export default EditReceivablesForm;
