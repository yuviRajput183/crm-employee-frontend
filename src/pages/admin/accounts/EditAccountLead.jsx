import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { apiGetAllSubProductsOfProduct } from '@/services/product.api';
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
    reportedLoanAmount: z.union([z.string(), z.number()]).transform(v => String(v)).refine(v => v.length > 0, { message: 'Reported Loan Amount is required' }),
    reportedPayoutPercentage: z.union([z.string(), z.number()]).transform(v => String(v)).refine(v => v.length > 0, { message: 'Reported Payout Percentage is required' }),
    caseType: z.string().min(1, 'Case Type is required'),
    serviceProvider: z.string().min(1, 'Service Provider is required'),
    spCode: z.string().optional(),
    disbursementDate: z.string().min(1, 'Disbursement Date is required'),
    pddCleared: z.string().min(1, 'PDD Cleared is required'),
    pddClearedDate: z.string().optional(),
    status: z.string().optional()
});

const EditAccountLead = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [locations, setLocations] = useState([]);
    const [products, setProducts] = useState([]);
    const [subProducts, setSubProducts] = useState([]);
    const [banks, setBanks] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [savedSubProduct, setSavedSubProduct] = useState(null);

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
            status: 'In Progress'
        }
    });

    const watchProduct = form.watch("product");
    const watchServiceProvider = form.watch("serviceProvider");
    const watchPddCleared = form.watch("pddCleared");

    const fetchDropdowns = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
            const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

            const [locRes, prodRes, bankRes, spRes] = await Promise.all([
                axios.get(`${baseURL}/locations/get-location`, config),
                axios.get(`${baseURL}/products/list-products`, config),
                axios.get(`${baseURL}/banks/list-banks`, config),
                axios.get(`${baseURL}/service-providers/get-service-provider`, config)
            ]);
            
            if (locRes?.data?.data) setLocations(locRes.data.data);
            if (prodRes?.data?.data) setProducts(prodRes.data.data);
            if (bankRes?.data?.data) setBanks(bankRes.data.data);
            if (spRes?.data?.data) setServiceProviders(spRes.data.data);
        } catch (error) {
            console.error("Failed to load dropdown data", error);
        }
    };

    const fetchLeadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
            const res = await axios.get(`${baseURL}/account-leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const lead = res.data.data;
                const profile = JSON.parse(localStorage.getItem('profile') || '{}');
                const role = profile?.role?.toLowerCase() || '';

                if (lead.status === 'Invoice Raised' && role !== 'super admin' && role !== 'admin') {
                    setIsReadOnly(true);
                }

                if (lead.subProduct) {
                    setSavedSubProduct(lead.subProduct);
                }

                form.reset({
                    location: lead.location?._id || lead.location,
                    product: lead.product?._id || lead.product,
                    subProduct: lead.subProduct || '',
                    caseName: lead.caseName || '',
                    lanApplicationNo: lead.lanApplicationNo || '',
                    bank: lead.bank?._id || lead.bank,
                    reportedLoanAmount: lead.reportedLoanAmount || '',
                    reportedPayoutPercentage: lead.reportedPayoutPercentage || '',
                    caseType: lead.caseType || 'Processed',
                    serviceProvider: lead.serviceProvider?._id || lead.serviceProvider,
                    spCode: lead.spCode || '',
                    disbursementDate: lead.disbursementDate ? lead.disbursementDate.split('T')[0] : '',
                    pddCleared: lead.pddCleared || 'No',
                    pddClearedDate: lead.pddClearedDate ? lead.pddClearedDate.split('T')[0] : '',
                    status: lead.status || 'In Progress'
                });
            }
        } catch (error) {
            console.error("Failed to load lead data", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchDropdowns();
            await fetchLeadData();
        };
        loadData();
    }, [id]);

    const { data: subProductData, isSuccess: isSubProductSuccess } = useQuery({
        queryKey: ['subProducts', watchProduct],
        enabled: !!watchProduct,
        queryFn: async () => {
            const res = await apiGetAllSubProductsOfProduct(watchProduct);
            return res;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isSubProductSuccess && subProductData) {
            const fetchedSubProducts = subProductData?.data?.data?.subProducts || [];
            setSubProducts(fetchedSubProducts);
        }
    }, [isSubProductSuccess, subProductData]);

    useEffect(() => {
        if (savedSubProduct && subProducts.length > 0) {
            if (subProducts.includes(savedSubProduct)) {
                // Force a change so Radix UI Select picks it up after options render
                form.setValue("subProduct", "");
                setTimeout(() => {
                    form.setValue("subProduct", savedSubProduct);
                    setSavedSubProduct(null); // Clear it so it doesn't trigger on subsequent product changes
                }, 0);
            }
        }
    }, [subProducts, savedSubProduct, form]);

    useEffect(() => {
        if (watchServiceProvider) {
            const selectedSp = serviceProviders.find(sp => sp._id === watchServiceProvider);
            if (selectedSp) {
                form.setValue('spCode', selectedSp.code || '');
            }
        }
    }, [watchServiceProvider, serviceProviders, form]);

    const onSubmit = async (data) => {
        if (isReadOnly) return;
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
            const res = await axios.put(`${baseURL}/account-leads/${id}`, {
                ...data,
                reportedLoanAmount: Number(data.reportedLoanAmount),
                reportedPayoutPercentage: Number(data.reportedPayoutPercentage)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                alert("Account Lead Updated Successfully");
                navigate("/admin/account_in_progress_leads");
            }
        } catch (error) {
            console.error("Error updating account lead", error);
            alert("Error updating account lead");
        }
    };

    return (
        <div className='px-6 py-3 bg-white rounded shadow'>
            <div className='flex gap-2 items-center pb-2 border-b-2'>
                <Avatar>
                    <AvatarFallback>EL</AvatarFallback>
                </Avatar>
                <h1 className='text-2xl font-bold'>Edit Account Lead</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="product" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="subProduct" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub-Product <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="caseName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Case Name" className="shadow" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="lanApplicationNo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>LAN/Application No <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter LAN/Application No" className="shadow" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="bank" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank/NBFC Name <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="reportedLoanAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reported Loan Amount by Broker (in ₹) <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter Amount" className="shadow" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="reportedPayoutPercentage" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reported Payout %age from Bank <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="Enter %age" className="shadow" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="caseType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Type <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="serviceProvider" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Provider <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        <FormField control={form.control} name="spCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>SP Code <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Auto Populated" readOnly className="shadow bg-gray-100" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="disbursementDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Disbursement Date <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="date" className="shadow" disabled={isReadOnly} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="pddCleared" render={({ field }) => (
                            <FormItem>
                                <FormLabel>PDD Cleared <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
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

                        {watchPddCleared === 'Yes' && (
                            <FormField control={form.control} name="pddClearedDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PDD Cleared Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" className="shadow" disabled={isReadOnly} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Feedback / Status <span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                    <FormControl>
                                        <SelectTrigger className="shadow"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Invoice Raised">Invoice Raised</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button type="button" onClick={() => navigate(-1)} variant="outline">Back</Button>
                        {!isReadOnly && <Button type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">Save</Button>}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditAccountLead;
