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
    pddClearedDate: z.string().optional()
});

const AddAccountLead = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [products, setProducts] = useState([]);
    const [subProducts, setSubProducts] = useState([]);
    const [banks, setBanks] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);

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
        }
    });

    const watchProduct = form.watch("product");
    const watchServiceProvider = form.watch("serviceProvider");
    const watchPddCleared = form.watch("pddCleared");

    const fetchDropdowns = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');
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

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');
            const res = await axios.post(`${baseURL}/account-leads/create`, {
                ...data,
                reportedLoanAmount: Number(data.reportedLoanAmount),
                reportedPayoutPercentage: Number(data.reportedPayoutPercentage)
            }, {
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
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button type="button" onClick={() => navigate(-1)} variant="outline">Back</Button>
                        <Button type="submit" className="bg-blue-950 hover:bg-blue-400 text-white">Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddAccountLead;
