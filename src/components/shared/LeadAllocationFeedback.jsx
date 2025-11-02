// components/LeadAllocationFeedback.jsx
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { apiListAllocatedTo } from '@/services/lead.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Input } from '../ui/input';
import BankerDetails from './BankerDetails';





const feedbackOptions = ['Under Process', 'Docs Query', 'Loan Approved', 'Loan Disbursed', 'Loan Rejected'];


const LeadAllocationFeedback = ({ form, leadId, disabled }) => {

    const [allocatedToUsers, setAllocatedToUsers] = useState([]);
    const [feedback, setFeedback] = useState(form.getValues('loanFeedback') || "");

    // Watch for changes in loanFeedback to keep state in sync
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'loanFeedback') {
                setFeedback(value.loanFeedback || "");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);


    console.log("form >>>", form);

    // query to  fetch all the allocated To users on component mount
    const {
        isError: isListAllocatedToError,
        error: listAllocatedToError,
    } = useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await apiListAllocatedTo();
            console.log("📦 queryFn response of list allocated To users:", res);
            setAllocatedToUsers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list allocated To Users:", err);
        }
    });

    console.log('allocateTo Users>>', allocatedToUsers);
    console.log("feedback >>", feedback);


    return (
        <div className="py-4">
            <div className="bg-sky-300 text-slate-900 font-medium px-3 py-2 rounded mb-4">
                Lead Allocation & Feedback
            </div>

            {
                isListAllocatedToError && (
                    <Alert variant="destructive">{getErrorMessage(listAllocatedToError)}</Alert>
                )
            }

            {/* Reallocate To */}
            <FormField
                control={form.control}
                name="allocateTo"
                render={({ field }) => (
                    <FormItem className="max-w-xl flex items-center justify-between gap-2">
                        <FormLabel>Reallocate To (Optional)</FormLabel>
                        <FormControl>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select advisor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allocatedToUsers?.map((allocate) => (
                                        <SelectItem key={allocate?._id} value={allocate?._id}>{allocate?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Loan Feedback */}
            <div className="mt-4">
                <FormField
                    control={form.control}
                    name="loanFeedback"
                    render={({ field }) => (
                        <FormItem className=" max-w-xl flex items-center justify-between gap-2">
                            <FormLabel>Loan Feedback (Optional)</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(v) => {
                                        field.onChange(v || null);
                                        setFeedback(v);
                                    }}
                                    disabled={disabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {feedbackOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>


            {feedback === "Loan Disbursed" && <BankerDetails form={form} leadId={leadId} />}


            {/* Remarks */}
            <div className="mt-4">
                <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                        <FormItem className="max-w-xl flex items-center justify-between gap-2">
                            <FormLabel>Remarks (If Any)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add any notes..."
                                    rows={4}
                                    className="max-w-3xl"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>


        </div>
    );
};

export default LeadAllocationFeedback;
