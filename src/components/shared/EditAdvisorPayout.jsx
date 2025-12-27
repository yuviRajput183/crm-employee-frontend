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
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { apiListProcessed } from '@/services/processed.api';
import { apiListAdvisor } from '@/services/advisor.api';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetchPayoutDetails } from '@/services/payout.api';
import { useAdvisorPayout } from '@/lib/hooks/useAdvisorPayout';



// Zod schema for disbursement form
const editInvoiceFormSchema = z.object({
    // Required Fields
    leadId: z.string().min(1, "Lead No is required"),
    disbursalAmount: z.string().min(1, "Disbursal Amount is required"),
    payoutPercent: z.string().min(1, "Payout % is required"),
    disbursalDate: z.string().min(1, "Disbursal Date is required"),
    processedById: z.string().min(1, "Processed By is required"),

    // Optional Fields (invoiceNo and invoiceDate become optional based on GST)
    invoiceNo: z.string().optional(),
    invoiceDate: z.string().optional(),
    loanServiceType: z.string().optional(),
    customerName: z.string().optional(),
    advisorName: z.string().optional(),
    advisorId: z.string().optional(),
    payoutAmount: z.string().optional(),
    finalPayout: z.boolean().optional(),
    gstApplicable: z.boolean().optional(),
    tdsPercentage: z.string().optional(),
    tdsAmount: z.string().optional(),
    gstPercentage: z.string().optional(),
    gstAmount: z.string().optional(),
    netPayableAmount: z.string().optional(),
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



const EditAdvisorPayoutForm = () => {

    const { id: payoutId } = useParams();
    console.log("payoutId>>", payoutId);
    const [leadId, setLeadId] = useState(null);

    const [processedByUsers, setProcessedByUsers] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    const navigate = useNavigate();

    // query to  fetch the advisor payout detail on component mount
    const {
        data: payoutData,
        isError: isAdvisorPayoutError,
        error: advisorPayoutError,
    } = useQuery({
        queryKey: [payoutId],
        queryFn: () => apiFetchPayoutDetails(payoutId),
        enabled: !!payoutId, // Only run if employeeId exists,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("fetched data of the advisor payout >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisor payout:", err);
        }
    });


    const form = useForm({
        resolver: zodResolver(editInvoiceFormSchema),
        defaultValues: {
            leadId: "",
            invoiceNo: "",
            disbursalAmount: "100",
            payoutPercent: "",
            disbursalDate: "",
            invoiceDate: "",
            processedById: "",
            loanServiceType: "",
            customerName: "",
            advisorName: "",
            advisorId: "",
            payoutAmount: "",
            finalPayout: false,
            gstApplicable: true, // Applicable by default
            tdsPercentage: "",
            tdsAmount: "",
            gstPercentage: "",
            gstAmount: "",
            netPayableAmount: "",
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

    // Function to calculate all dependent fields
    const calculateFields = () => {
        const disbursalAmount = parseFloat(form.getValues('disbursalAmount')) || 0;
        const payoutPercent = parseFloat(form.getValues('payoutPercent')) || 0;
        const tdsPercent = parseFloat(form.getValues('tdsPercentage')) || 0;
        const gstPercent = parseFloat(form.getValues('gstPercentage')) || 0;

        // Calculate Payout Amount
        const payoutAmount = (disbursalAmount * payoutPercent) / 100;

        // Calculate TDS Amount (on payout amount)
        const tdsAmount = (payoutAmount * tdsPercent) / 100;

        // Calculate GST Amount (on payout amount)
        const gstAmount = (payoutAmount * gstPercent) / 100;

        // Calculate Net Payable Amount = Payout Amount - TDS Amount + GST Amount
        const netPayableAmount = payoutAmount - tdsAmount + gstAmount;

        // Update form values
        form.setValue('payoutAmount', payoutAmount.toFixed(2));
        form.setValue('tdsAmount', tdsAmount.toFixed(2));
        form.setValue('gstAmount', gstAmount.toFixed(2));
        form.setValue('netPayableAmount', netPayableAmount.toFixed(2));
    };

    // Watch for changes in calculation fields
    const disbursalAmount = form.watch('disbursalAmount');
    const payout = form.watch('payoutPercent');
    const tdsPercentage = form.watch('tdsPercentage');
    const gstPercentage = form.watch('gstPercentage');
    const gstApplicable = form.watch('gstApplicable');

    // Check if GST is not applicable to disable fields
    const isGstNotApplicable = gstApplicable === false;

    useEffect(() => {
        calculateFields();
    }, [disbursalAmount, payout, tdsPercentage, gstPercentage]);


    // Query to fetch processed by users on component mount
    const {
        isError: isProcessedByError,
        error: processedByError,
    } = useQuery({
        queryKey: ['processedByUsers'],
        queryFn: async () => {
            const res = await apiListProcessed();
            console.log("📦 Processed by users response:", res);
            setProcessedByUsers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
    });

    // Query to fetch advisors on component mount
    const {
        isError: isListAdvisorError,
        error: listAdvisorError,
    } = useQuery({
        queryKey: ['advisors'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisor:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
    });



    const { updateAdvisorPayout } = useAdvisorPayout();
    const { mutateAsync, isLoading, isError, error } = updateAdvisorPayout;

    const handleSubmit = async (data) => {
        console.log("Submitted values:", data);

        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== '') {
                    if (key === 'finalPayout' || key === 'gstApplicable') {
                        formData.append(key, data[key] ? 'true' : 'false');
                    } else {
                        formData.append(key, data[key]);
                    }
                }
            });

            const res = await mutateAsync({ payoutId, payload: formData });
            console.log("Advisor Payout updated successfully ....");

            if (res?.data?.success) {
                navigate('/admin/advisor_payout');
            }
        } catch (error) {
            console.error('handleSubmit error:', error);
        }
    };


    useEffect(() => {

        if (payoutData?.data) {
            const payout = payoutData?.data?.data || {};
            console.log("payout>>", payout);

            form.reset({
                leadId: `${payout?.leadId?.leadNo} - ${payout?.leadId?.clientName}`,
                invoiceNo: payout?.invoiceNo || '',
                disbursalAmount: payout?.disbursalAmount?.toString() || '100',
                payoutPercent: payout?.payoutPercent?.toString() || '',
                disbursalDate: payout?.disbursalDate?.split('T')[0] || '',
                invoiceDate: payout?.invoiceDate?.split('T')[0] || '',
                processedById: payout?.processedById?._id || '',
                loanServiceType: payout?.leadId?.productType || '',
                customerName: payout?.leadId?.clientName || '',
                advisorName: payout?.advisorId?._id || '',
                advisorId: payout?.advisorId?._id || '',
                payoutAmount: payout?.payoutAmount?.toString() || '',
                finalPayout: payout?.finalPayout || false,
                gstApplicable: Boolean(payout?.gstApplicable),
                tdsPercentage: payout?.tdsPercent?.toString() || '',
                tdsAmount: payout?.tdsAmount?.toString() || '',
                gstPercentage: payout?.gstPercent?.toString() || '',
                gstAmount: payout?.gstAmount?.toString() || '',
                netPayableAmount: payout?.netPayableAmount?.toString() || '',
                remarks: payout?.remarks || '',
                bankName: payout?.bankerDetails?.bank?.name || '',
                bankerName: payout?.bankerDetails?.bankerName || '',
                bankerDesignation: payout?.bankerDetails?.designation || '',
                bankerMobileNo: payout?.bankerDetails?.mobile || '',
                bankerEmailId: payout?.bankerDetails?.email || '',
                stateName: payout?.bankerDetails?.city?.stateName || '',
                cityName: payout?.bankerDetails?.city?.cityName || '',
            })

            setLeadId(payout.leadId?._id);
        }
    }, [payoutData, form]);


    return (
        <div className=' p-3 bg-white rounded shadow'>

            {isAdvisorPayoutError && (
                <Alert variant="destructive">{getErrorMessage(advisorPayoutError)}</Alert>
            )}

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Advisor Payout</h1>
                </div>
            </div>


            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full mt-2 py-4 rounded-md"
                >
                    {/* Error Messages */}
                    {isProcessedByError && (
                        <Alert variant="destructive">{getErrorMessage(processedByError)}</Alert>
                    )}
                    {isListAdvisorError && (
                        <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
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
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            // Store the advisorId when an advisor is selected
                                            form.setValue('advisorId', value);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Advisor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {advisors.map((advisor) => (
                                                <SelectItem key={advisor._id} value={advisor._id}>
                                                    {advisor?.name} - {advisor?.advisorCode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Is GST Applicable */}
                        <FormField
                            control={form.control}
                            name="gstApplicable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Is GST Applicable?</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Applicable</SelectItem>
                                            <SelectItem value="false">Not Applicable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />


                        {/* Disbursal Amount - Editable field for calculations */}
                        <FormField
                            control={form.control}
                            name="disbursalAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Disbursal Amount <span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} type="number" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Disbursal Date */}
                        <FormField
                            control={form.control}
                            name="disbursalDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Disbursal Date <span className="text-red-500">*</span></FormLabel>
                                    <Input type="date" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payout % */}
                        <FormField
                            control={form.control}
                            name="payoutPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payout % <span className="text-red-500">*</span></FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payout Amount - Non-editable, calculated */}
                        <FormField
                            control={form.control}
                            name="payoutAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payout Amount</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* TDS % */}
                        <FormField
                            control={form.control}
                            name="tdsPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>TDS %</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />

                        {/* TDS Amount - Non-editable, calculated */}
                        <FormField
                            control={form.control}
                            name="tdsAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>TDS Amount</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />


                        {/* Invoice No */}
                        <FormField
                            control={form.control}
                            name="invoiceNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice No {!isGstNotApplicable && <span className="text-red-500">*</span>}</FormLabel>
                                    <Input
                                        {...field}
                                        readOnly={isGstNotApplicable}
                                        className={isGstNotApplicable ? "bg-gray-50" : ""}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Invoice Date */}
                        <FormField
                            control={form.control}
                            name="invoiceDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Date {!isGstNotApplicable && <span className="text-red-500">*</span>}</FormLabel>
                                    <Input
                                        type="date"
                                        {...field}
                                        readOnly={isGstNotApplicable}
                                        className={isGstNotApplicable ? "bg-gray-50" : ""}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* Is this final payout */}
                        <FormField
                            control={form.control}
                            name="finalPayout"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0 mt-8">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                        Is this final payout
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        {/* GST % */}
                        <FormField
                            control={form.control}
                            name="gstPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST %</FormLabel>
                                    <Input
                                        {...field}
                                        readOnly={isGstNotApplicable}
                                        className={isGstNotApplicable ? "bg-gray-50" : ""}
                                    />
                                </FormItem>
                            )}
                        />

                        {/* GST Amount - Non-editable, calculated */}
                        <FormField
                            control={form.control}
                            name="gstAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST Amount</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Net Payable Amount - Non-editable, calculated */}
                        <FormField
                            control={form.control}
                            name="netPayableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Net Payable Amount</FormLabel>
                                    <Input {...field} readOnly className="bg-gray-50" />
                                </FormItem>
                            )}
                        />

                        {/* Processed By */}
                        <FormField
                            control={form.control}
                            name="processedById"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Processed By <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {processedByUsers.map((user) => (
                                                <SelectItem key={user._id} value={user?._id}>
                                                    {user?.processedBy}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Remarks */}
                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem className="">
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
                            onClick={() => navigate('/admin/advisor_payout')}
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

export default EditAdvisorPayoutForm;