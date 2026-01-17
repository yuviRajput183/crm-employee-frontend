import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react'
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
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { apiListPayableLeads, apiGetAdvisorsAssociatedWithPayout, apiGetSingleAdvisorPayout } from '@/services/payables.api';
import { apiFetchLeadDetails } from '@/services/lead.api';
import { usePayables } from '@/lib/hooks/usePayables';
import { useNavigate } from 'react-router-dom';

// Zod schema for payables form
const addPayablesFormSchema = z.object({
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

const AddPayables = ({ onClose }) => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [advisors, setAdvisors] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [selectedPaymentAgainst, setSelectedPaymentAgainst] = useState(null);
    const [advisorPayoutData, setAdvisorPayoutData] = useState(null);
    const [paymentAgainstOptions, setPaymentAgainstOptions] = useState([]);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(addPayablesFormSchema),
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

    // query to fetch all the lead no on component mount using new API endpoint
    const {
        isError: isListLeadNoError,
        error: listLeadNoError,
    } = useQuery({
        queryKey: ['payables-lead-list'],
        queryFn: async () => {
            const res = await apiListPayableLeads();
            console.log("📦 queryFn response of all payable leads :", res);
            setLeads(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching all payable leads:", err);
        }
    });

    // Query to fetch advisors associated with payout when Lead No is selected
    const {
        isLoading: isAdvisorsLoading,
        isError: isAdvisorsError,
        error: advisorsError,
    } = useQuery({
        queryKey: ['advisors-associated-with-payout', selectedLead],
        enabled: !!selectedLead,
        queryFn: async () => {
            const res = await apiGetAdvisorsAssociatedWithPayout(selectedLead);
            console.log("📦 Advisors associated with payout response:", res);
            // If the response contains advisors array, set it
            if (res?.data?.data?.advisors) {
                setAdvisors(res.data.data.advisors);
            } else if (Array.isArray(res?.data?.data)) {
                setAdvisors(res.data.data);
            }
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching advisors associated with payout:", err);
        }
    });

    // Query to fetch single advisor payout details when advisor is selected
    const {
        isLoading: isAdvisorPayoutLoading,
        isError: isAdvisorPayoutError,
        error: advisorPayoutError,
    } = useQuery({
        queryKey: ['single-advisor-payout', selectedAdvisor],
        enabled: !!selectedAdvisor,
        queryFn: async () => {
            const res = await apiGetSingleAdvisorPayout(selectedAdvisor);
            console.log("📦 Single advisor payout response:", res);
            setAdvisorPayoutData(res?.data?.data || null);
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching single advisor payout:", err);
        }
    });

    // Query to fetch lead details when a lead is selected
    const {
        isLoading: isLeadDetailsLoading,
        isError: isLeadDetailsError,
        error: leadDetailsError,
        data: leadData
    } = useQuery({
        queryKey: ['payables-leadDetails', selectedLead],
        enabled: !!selectedLead,
        queryFn: async () => {
            const res = await apiFetchLeadDetails(selectedLead);
            console.log("📦 Lead details response:", res);
            return res;
        },
        refetchOnWindowFocus: false,
    });

    const { addPayable } = usePayables();
    const { mutateAsync, isLoading, isError, error } = addPayable;

    const handleSubmit = async (data) => {
        console.log("Submitted values:", data);

        try {
            // Build JSON payload, filtering out empty values
            const payload = {};
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== '') {
                    // Rename fields for backend
                    if (key === 'payableGstAmount') {
                        payload['payableAmount'] = data[key];
                    } else if (key === 'balancePayableAmount') {
                        payload['balanceAmount'] = data[key];
                    } else {
                        payload[key] = data[key];
                    }
                }
            });

            // Add payoutId from advisorPayoutData
            if (advisorPayoutData?._id) {
                payload['payoutId'] = advisorPayoutData._id;
            }

            const res = await mutateAsync(payload);
            console.log("New Payable added successfully ....");

            if (res?.data?.success) {
                navigate('../payable_payout');
            }
        } catch (error) {
            console.error('handleSubmit error:', error);
        }
    };

    useEffect(() => {
        if (leadData?.data) {
            const lead = leadData?.data?.data || {};
            console.log("lead>>", lead);

            // Auto-fill form fields with lead data
            form.setValue('loanServiceType', lead?.productType || '');
            form.setValue('customerName', lead?.clientName || '');

            // Fill banker details (non-editable)
            form.setValue('bankName', lead?.bankerId?.bank?.name || '');
            form.setValue('bankerName', lead?.bankerId?.bankerName || '');
            form.setValue('bankerDesignation', lead?.bankerId?.designation || '');
            form.setValue('bankerMobileNo', lead?.bankerId?.mobile || '');
            form.setValue('bankerEmailId', lead?.bankerId?.email || '');
            form.setValue('stateName', lead?.bankerId?.city?.stateName || '');
            form.setValue('cityName', lead?.bankerId?.city?.cityName || '');
        }
    }, [leadData, form]);

    // Build payment against options based on advisor payout data
    useEffect(() => {
        if (advisorPayoutData) {
            console.log("Building payment options from:", advisorPayoutData);
            const options = [];

            // Add Payable Amount option if remainingPayableAmount > 0
            if (advisorPayoutData?.remainingPayableAmount && advisorPayoutData.remainingPayableAmount > 0) {
                options.push({
                    value: "payableAmount",
                    label: `Payable Amount`
                });
            }

            // Add GST Payment option if remainingGstAmount > 0
            if (advisorPayoutData?.remainingGstAmount && advisorPayoutData.remainingGstAmount > 0) {
                options.push({
                    value: "gstPayment",
                    label: `GST Payment`
                });
            }

            setPaymentAgainstOptions(options);

            // Reset payment against selection when advisor changes
            form.setValue('paymentAgainst', '');
            form.setValue('payableGstAmount', '');
            form.setValue('paidAmount', '');
            form.setValue('balancePayableAmount', '');
            setSelectedPaymentAgainst(null);
        } else {
            setPaymentAgainstOptions([]);
        }
    }, [advisorPayoutData, form]);


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full mt-2 py-4 rounded-md"
            >
                {/* Error Messages */}
                {isListLeadNoError && (
                    <Alert variant="destructive">{getErrorMessage(listLeadNoError)}</Alert>
                )}
                {isLeadDetailsError && (
                    <Alert variant="destructive">{getErrorMessage(leadDetailsError)}</Alert>
                )}
                {isAdvisorsError && (
                    <Alert variant="destructive">{getErrorMessage(advisorsError)}</Alert>
                )}
                {isAdvisorPayoutError && (
                    <Alert variant="destructive">{getErrorMessage(advisorPayoutError)}</Alert>
                )}
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
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedLead(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {leads.map((lead) => (
                                            <SelectItem key={lead?.id} value={lead.id}>
                                                {lead?.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
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
                                <Select
                                    onValueChange={(value) => {
                                        console.log("Selected advisor value:", value);
                                        field.onChange(value);
                                        setSelectedAdvisor(value);
                                    }}
                                    value={field.value || ""}
                                    disabled={!selectedLead || isAdvisorsLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={isAdvisorsLoading ? "Loading..." : "Select"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {advisors.map((advisor) => {
                                            const advisorId = advisor?.advisorPayoutId || advisor?._id || advisor?.id;
                                            const advisorName = advisor?.advisorName || advisor?.name;
                                            return (
                                                <SelectItem key={advisorId} value={advisorId}>
                                                    {advisorName}
                                                </SelectItem>
                                            );
                                        })}
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
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedPaymentAgainst(value);

                                        // Fill Payable/GST Amount based on selection
                                        if (advisorPayoutData) {
                                            let amount = '';
                                            if (value === 'payableAmount') {
                                                amount = advisorPayoutData?.remainingPayableAmount?.toString() || '';
                                            } else if (value === 'gstPayment') {
                                                amount = advisorPayoutData?.remainingGstAmount?.toString() || '';
                                            }
                                            form.setValue('payableGstAmount', amount);
                                            form.setValue('paidAmount', amount);
                                            form.setValue('balancePayableAmount', '0');
                                        }
                                    }}
                                    value={field.value || ""}
                                    disabled={!selectedAdvisor || paymentAgainstOptions.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={paymentAgainstOptions.length === 0 ? "Select Advisor First" : "Select"} />
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
                        render={({ field }) => {
                            const payableGstAmount = parseFloat(form.watch('payableGstAmount')) || 0;
                            return (
                                <FormItem>
                                    <FormLabel>Paid Amount <span className="text-red-500">*</span></FormLabel>
                                    <Input
                                        {...field}
                                        type="number"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numValue = parseFloat(value) || 0;

                                            // Validate that paid amount is not greater than payable amount
                                            if (numValue <= payableGstAmount) {
                                                field.onChange(value);
                                                // Calculate balance
                                                const balance = payableGstAmount - numValue;
                                                form.setValue('balancePayableAmount', balance.toString());
                                            } else {
                                                // Set to max allowed value
                                                field.onChange(payableGstAmount.toString());
                                                form.setValue('balancePayableAmount', '0');
                                            }
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
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
                        disabled={isLoading || isLeadDetailsLoading}
                        className="bg-blue-800 text-white"
                    >
                        {isLoading ? 'SAVING...' : 'SAVE'}
                    </Button>
                    <Button
                        onClick={onClose}
                        type="button"
                        variant="outline"
                        className="bg-gray-500 text-white"
                    >
                        BACK
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AddPayables;
