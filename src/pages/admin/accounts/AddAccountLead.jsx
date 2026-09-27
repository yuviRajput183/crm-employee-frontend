import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const formSchema = z.object({
    location: z.string().min(1, 'Location is required'),
    product: z.string().min(1, 'Product is required'),
    subProduct: z.string().min(1, 'Sub-Product is required'),
    caseName: z.string().min(1, 'Case Name is required'),
    lanApplicationNo: z.string().min(1, 'LAN/Application No is required'),
    bank: z.string().min(1, 'Bank is required'),
    reportedLoanAmount: z.string().min(1, 'Reported Loan Amount is required'),
    reportedPayoutPercentage: z.string().min(1, 'Reported Payout Percentage is required'),
    caseType: z.string().min(1, 'Case Type is required'),
    serviceProvider: z.string().min(1, 'Service Provider is required'),
    spCode: z.string().optional(),
    disbursementDate: z.string().min(1, 'Disbursement Date is required'),
    pddCleared: z.string().min(1, 'PDD Cleared is required'),
    pddClearedDate: z.string().optional(),
    
    // New Fields
    channelPartner1: z.string().optional(),
    cpCode1: z.string().optional(),
    cp1DealPercentage: z.string().optional(),
    cp1PayoutAmount: z.string().optional(),
    
    channelPartner2: z.string().optional(),
    cpCode2: z.string().optional(),
    cp2DealPercentage: z.string().optional(),
    cp2PayoutAmount: z.string().optional(),
    
    channelPartner3: z.string().optional(),
    cpCode3: z.string().optional(),
    cp3DealPercentage: z.string().optional(),
    cp3PayoutAmount: z.string().optional(),
}).refine(data => {
    if (data.pddCleared === 'Yes' && data.pddClearedDate && data.disbursementDate) {
        return new Date(data.pddClearedDate) >= new Date(data.disbursementDate);
    }
    return true;
}, {
    message: "PDD Cleared Date cannot be before Disbursement Date",
    path: ["pddClearedDate"]
});

const AddAccountLead = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [products, setProducts] = useState([]);
    const [subProducts, setSubProducts] = useState([]);
    const [banks, setBanks] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [channelPartners, setChannelPartners] = useState([]);
    const [isLoadingReferral, setIsLoadingReferral] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            location: '',
            product: '',
            subProduct: '',
            caseName: '',
            lanApplicationNo: '',
            bank: '',
            reportedLoanAmount: '',
            reportedPayoutPercentage: '',
            caseType: 'Processed',
            serviceProvider: '',
            spCode: '',
            disbursementDate: '',
            pddCleared: 'No',
            pddClearedDate: '',
            
            channelPartner1: '',
            cpCode1: '',
            cp1DealPercentage: '',
            cp1PayoutAmount: '',
            
            channelPartner2: '',
            cpCode2: '',
            cp2DealPercentage: '',
            cp2PayoutAmount: '',
            
            channelPartner3: '',
            cpCode3: '',
            cp3DealPercentage: '',
            cp3PayoutAmount: '',
        }
    });

    const watchProduct = form.watch("product");
    const watchServiceProvider = form.watch("serviceProvider");
    const watchPddCleared = form.watch("pddCleared");
    const watchChannelPartner1 = form.watch("channelPartner1");
    const watchCaseType = form.watch("caseType");
    const watchReportedLoanAmount = form.watch("reportedLoanAmount");
    
    const watchCp1DealPercentage = form.watch("cp1DealPercentage");
    const watchCp2DealPercentage = form.watch("cp2DealPercentage");
    const watchCp3DealPercentage = form.watch("cp3DealPercentage");

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

    const fetchDropdowns = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

            const [locRes, prodRes, bankRes, spRes, cpRes] = await Promise.all([
                axios.get(`${baseURL}/locations/get-location`, config),
                axios.get(`${baseURL}/products/list-products`, config),
                axios.get(`${baseURL}/banks/list-banks`, config),
                axios.get(`${baseURL}/service-providers/get-service-provider`, config),
                axios.get(`${baseURL}/channel-partner-codes/eligible-referrers`, config)
            ]);
            
            if (locRes?.data?.data) setLocations(locRes.data.data);
            if (prodRes?.data?.data) setProducts(prodRes.data.data);
            if (bankRes?.data?.data) setBanks(bankRes.data.data);
            if (spRes?.data?.data) setServiceProviders(spRes.data.data);
            if (cpRes?.data?.data) setChannelPartners(cpRes.data.data);
        } catch (error) {
            console.error("Failed to load dropdown data", error);
        }
    };

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        if (watchProduct) {
            const selectedProd = products.find(p => p._id === watchProduct);
            if (selectedProd && selectedProd.subProducts) {
                setSubProducts(selectedProd.subProducts);
            } else {
                setSubProducts([]);
            }
            form.setValue('subProduct', '');
        }
    }, [watchProduct, products, form]);

    useEffect(() => {
        if (watchServiceProvider) {
            const selectedSp = serviceProviders.find(sp => sp._id === watchServiceProvider);
            if (selectedSp) {
                form.setValue('spCode', selectedSp.code || '');
            }
        }
    }, [watchServiceProvider, serviceProviders, form]);

    useEffect(() => {
        const fetchReferralInfo = async () => {
            if (watchChannelPartner1 && watchChannelPartner1 !== 'NONE') {
                setIsLoadingReferral(true);
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${baseURL}/channel-partner-codes/${watchChannelPartner1}/referral-info`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    if (res.data.success) {
                        const { channelPartner, level1, level2 } = res.data.data;
                        
                        form.setValue('cpCode1', channelPartner.code || '');
                        const cp1Deal = watchCaseType === 'Processed' ? channelPartner.processedDealPercentage : channelPartner.reportedDealPercentage;
                        form.setValue('cp1DealPercentage', cp1Deal !== undefined ? String(cp1Deal) : '');
                        
                        if (level1) {
                            form.setValue('channelPartner2', level1.name || '');
                            form.setValue('cpCode2', level1.code || '');
                        } else {
                            form.setValue('channelPartner2', '');
                            form.setValue('cpCode2', '');
                            form.setValue('cp2DealPercentage', '');
                        }
                        
                        const cp2DealToGive = watchCaseType === 'Processed' ? channelPartner.processedBalanceDealPercentage : channelPartner.reportedBalanceDealPercentage;
                        if (level1) {
                            form.setValue('cp2DealPercentage', cp2DealToGive !== undefined ? String(cp2DealToGive) : '');
                        }
                        
                        const cp3DealToGive = watchCaseType === 'Processed' ? level1?.processedBalanceDealPercentage : level1?.reportedBalanceDealPercentage;
                        if (level2) {
                            form.setValue('channelPartner3', level2.name || '');
                            form.setValue('cpCode3', level2.code || '');
                            form.setValue('cp3DealPercentage', cp3DealToGive !== undefined ? String(cp3DealToGive) : '');
                        } else {
                            form.setValue('channelPartner3', '');
                            form.setValue('cpCode3', '');
                            form.setValue('cp3DealPercentage', '');
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch referral info", error);
                } finally {
                    setIsLoadingReferral(false);
                }
            } else {
                form.setValue('cpCode1', '');
                form.setValue('cp1DealPercentage', '');
                form.setValue('channelPartner2', '');
                form.setValue('cpCode2', '');
                form.setValue('cp2DealPercentage', '');
                form.setValue('channelPartner3', '');
                form.setValue('cpCode3', '');
                form.setValue('cp3DealPercentage', '');
            }
        };
        fetchReferralInfo();
    }, [watchChannelPartner1, watchCaseType, form, baseURL]);

    useEffect(() => {
        const loanAmt = parseFloat(watchReportedLoanAmount);
        
        if (!isNaN(loanAmt)) {
            const cp1Pct = parseFloat(watchCp1DealPercentage);
            if (!isNaN(cp1Pct)) {
                form.setValue('cp1PayoutAmount', ((loanAmt * cp1Pct) / 100).toFixed(2));
            } else {
                form.setValue('cp1PayoutAmount', '');
            }
            
            const cp2Pct = parseFloat(watchCp2DealPercentage);
            if (!isNaN(cp2Pct)) {
                form.setValue('cp2PayoutAmount', ((loanAmt * cp2Pct) / 100).toFixed(2));
            } else {
                form.setValue('cp2PayoutAmount', '');
            }
            
            const cp3Pct = parseFloat(watchCp3DealPercentage);
            if (!isNaN(cp3Pct)) {
                form.setValue('cp3PayoutAmount', ((loanAmt * cp3Pct) / 100).toFixed(2));
            } else {
                form.setValue('cp3PayoutAmount', '');
            }
        } else {
            form.setValue('cp1PayoutAmount', '');
            form.setValue('cp2PayoutAmount', '');
            form.setValue('cp3PayoutAmount', '');
        }
    }, [watchReportedLoanAmount, watchCp1DealPercentage, watchCp2DealPercentage, watchCp3DealPercentage, form]);

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...data,
                reportedLoanAmount: Number(data.reportedLoanAmount),
                reportedPayoutPercentage: Number(data.reportedPayoutPercentage)
            };
            
            // Clean up CP fields
            if (data.channelPartner1 === "NONE" || !data.channelPartner1) {
                delete payload.channelPartner1;
            }
            if (payload.cp1DealPercentage) payload.cp1DealPercentage = Number(payload.cp1DealPercentage);
            if (payload.cp1PayoutAmount) payload.cp1PayoutAmount = Number(payload.cp1PayoutAmount);
            if (payload.cp2DealPercentage) payload.cp2DealPercentage = Number(payload.cp2DealPercentage);
            if (payload.cp2PayoutAmount) payload.cp2PayoutAmount = Number(payload.cp2PayoutAmount);
            if (payload.cp3DealPercentage) payload.cp3DealPercentage = Number(payload.cp3DealPercentage);
            if (payload.cp3PayoutAmount) payload.cp3PayoutAmount = Number(payload.cp3PayoutAmount);

            const res = await axios.post(`${baseURL}/account-leads/create`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                alert("Account Lead Added Successfully");
                navigate("/admin/account_in_progress_leads");
            }
        } catch (error) {
            console.error("Error creating account lead", error);
            alert("Error creating account lead");
        }
    };

    return (
        <div className='px-6 py-3 bg-white rounded shadow'>
            <div className='flex gap-2 items-center pb-2 border-b-2'>
                <Avatar>
                    <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <h1 className='text-2xl font-bold'>Add Account Lead</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Location */}
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Location" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locations.map(loc => <SelectItem key={loc._id} value={loc._id}>{loc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Product */}
                        <FormField control={form.control} name="product" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Product" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {products.map(prod => <SelectItem key={prod._id} value={prod._id}>{prod.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Sub-Product */}
                        <FormField control={form.control} name="subProduct" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub-Product <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Sub-Product" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subProducts.map((sub, i) => <SelectItem key={i} value={sub}>{sub}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Case Name */}
                        <FormField control={form.control} name="caseName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Case Name" className="shadow" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* LAN/Application No */}
                        <FormField control={form.control} name="lanApplicationNo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>LAN/Application No <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter LAN/Application No" className="shadow" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Bank/NBFC Name */}
                        <FormField control={form.control} name="bank" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank/NBFC Name <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Bank" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {banks.map(bank => <SelectItem key={bank._id} value={bank._id}>{bank.name || bank.bankName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Reported Loan Amount */}
                        <FormField control={form.control} name="reportedLoanAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reported Loan Amount by Broker (in ₹) <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter Amount" className="shadow" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Reported Payout Percentage */}
                        <FormField control={form.control} name="reportedPayoutPercentage" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reported Payout %age from Bank <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="Enter %age" className="shadow" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Case Type */}
                        <FormField control={form.control} name="caseType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Type <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Case Type" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Processed">Processed</SelectItem>
                                        <SelectItem value="Reported">Reported</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Service Provider */}
                        <FormField control={form.control} name="serviceProvider" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Provider <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Service Provider" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {serviceProviders.map(sp => <SelectItem key={sp._id} value={sp._id}>{sp.legalName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* SP Code */}
                        <FormField control={form.control} name="spCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>SP Code <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Auto Populated" readOnly className="shadow bg-gray-100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Disbursement Date */}
                        <FormField control={form.control} name="disbursementDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Disbursement Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="date" className="shadow" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* PDD Cleared */}
                        <FormField control={form.control} name="pddCleared" render={({ field }) => (
                            <FormItem>
                                <FormLabel>PDD Cleared <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select PDD Cleared" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="No">No</SelectItem>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* PDD Cleared Date */}
                        {watchPddCleared === 'Yes' && (
                            <FormField control={form.control} name="pddClearedDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PDD Cleared Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" className="shadow" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        {/* ---- CHANNEL PARTNER FIELDS ---- */}
                        
                        {/* Channel Partner 1 */}
                        <FormField control={form.control} name="channelPartner1" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Partner 1</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Channel Partner 1" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="NONE">None</SelectItem>
                                        {channelPartners.map(cp => <SelectItem key={cp._id} value={cp._id}>{cp.name} ({cp.code})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* CP1 Code */}
                        <FormField control={form.control} name="cpCode1" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CP Code 1</FormLabel>
                                <FormControl>
                                    <Input placeholder="Auto from CP Name" readOnly className="shadow bg-gray-100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* CP1 Deal %age */}
                        <FormField control={form.control} name="cp1DealPercentage" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CP 1 Deal %age</FormLabel>
                                <FormControl>
                                    <Input readOnly type="number" step="0.01" placeholder="Enter %age" className="shadow bg-gray-100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* CP1 Payout Amount */}
                        <FormField control={form.control} name="cp1PayoutAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CP 1 Payout Amount (in ₹)</FormLabel>
                                <FormControl>
                                    <Input readOnly placeholder="Auto Calculated" className="shadow bg-gray-100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Conditionally render CP2 and CP3 if they exist */}
                        {form.watch("channelPartner2") && (
                            <>
                                <FormField control={form.control} name="channelPartner2" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Partner 2</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cpCode2" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP Code 2</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cp2DealPercentage" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP 2 Deal %age</FormLabel>
                                        <FormControl>
                                            <Input readOnly type="number" step="0.01" className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cp2PayoutAmount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP 2 Payout Amount (in ₹)</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}

                        {form.watch("channelPartner3") && (
                            <>
                                <FormField control={form.control} name="channelPartner3" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Partner 3</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cpCode3" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP Code 3</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cp3DealPercentage" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP 3 Deal %age</FormLabel>
                                        <FormControl>
                                            <Input readOnly type="number" step="0.01" className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cp3PayoutAmount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CP 3 Payout Amount (in ₹)</FormLabel>
                                        <FormControl>
                                            <Input readOnly className="shadow bg-gray-100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 pt-2 items-center">
                        <Button type="button" onClick={() => navigate(-1)} variant="outline">Back</Button>
                        <Button type="submit" disabled={isLoadingReferral} className="bg-blue-950 hover:bg-blue-400 text-white min-w-[100px]">
                            {isLoadingReferral ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></div>
                                    Loading...
                                </span>
                            ) : "Save"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddAccountLead;
