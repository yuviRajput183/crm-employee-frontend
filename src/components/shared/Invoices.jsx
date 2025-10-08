import React, { useEffect, useState } from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Monitor } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdvisorInvoicesFilter from './AdvisorInvoicesFilter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiListInvoices } from '@/services/invoices.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import AddInvoiceForm from './AddInvoiceForm';
import { useInvoice } from '@/lib/hooks/useInvoice';
import { useNavigate } from 'react-router-dom';


const payoutData = [
    {
        label: "Gross Amount",
        value: "39,13,093",
        color: "bg-red-500",
        iconColor: "text-red-500"
    },
    {
        label: "Total Payout",
        value: "38,40,072",
        color: "bg-blue-500",
        iconColor: "text-blue-500",
    },
    {
        label: "TDS Amount",
        value: "38,186",
        color: "bg-teal-400",
        iconColor: "text-teal-400"
    },
    {
        label: "GST Amount",
        value: "73,021",
        color: "bg-amber-400",
        iconColor: "text-amber-400"
    },
];


const filterSchema = z.object({
    loanServiceType: z.string().optional(),
    advisorName: z.string().optional(),
    customerName: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});


const Invoices = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [showAddInvoice, setShowAddInvoice] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);

    const navigate = useNavigate();


    // fetching new leads on component mount and on filtering
    const {
        isError: isInvoicesLeadsError,
        error: invoicesLeadsError,
        data: queryData,
        refetch
    } = useQuery({
        queryKey: ['advisor-payouts', filterParams], // Changed queryKey name for clarity
        queryFn: async () => {
            const res = await apiListInvoices(filterParams);
            console.log("📦 queryFn response of list invoices:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching my list invoices:", err);
        }
    });


    // Update leads when query data changes
    useEffect(() => {
        if (queryData?.data?.data?.length > 0) {
            setLeads(queryData.data.data);
        } else if (queryData?.data?.data) {
            // Handle case where advisorPayouts might be empty or structured differently
            setLeads([]);
        }
    }, [queryData]);


    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            loanServiceType: '',
            advisorName: '',
            customerName: '',
            fromDate: '',
            toDate: '',
        },
    })


    const handleFilter = async (values) => {
        console.log("submitting values for filter in handle Filter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '' && val !== undefined)
        );

        // Only update filterParams - this will trigger the query automatically
        setFilterParams(cleanParams);
        setShowFilter(false);
        // Remove refetch() call - it's causing duplicate API calls
    }

    const { deleteInvoice } = useInvoice();
    const { mutateAsync, isLoading, isError, error } = deleteInvoice;

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {

            const res = await mutateAsync(id);

            console.log("res>>", res);
            if (res?.data?.success) {
                refetch();
            }
        }
    };



    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Invoices</h1>
                </div>
                {!showAddInvoice && <div className=' flex items-center gap-2'>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowAddInvoice(!showAddInvoice)}>Add +</Button>
                </div>}
            </div>

            {isInvoicesLeadsError && (
                <Alert variant="destructive">{getErrorMessage(invoicesLeadsError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}


            {showAddInvoice ? <AddInvoiceForm onClose={() => setShowAddInvoice(false)} /> : <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
                    {payoutData.map((item, index) => (
                        <div
                            key={index}
                            className={` cursor-pointer text-white p-5 rounded-md shadow-md flex items-center justify-between ${item.color} opacity-`}
                        >
                            <div>
                                <h2 className="text-md font-semibold">{item.label}</h2>
                                <p className="text-xl font-bold mt-1">{item.value}</p>
                            </div>
                            <div className="bg-white/80 p-2 rounded shadow-md">
                                <Monitor className={`w-5 h-5 ${item.iconColor}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {showFilter && <AdvisorInvoicesFilter showFilter={showFilter} form={form} handleFilter={handleFilter}></AdvisorInvoicesFilter>}


                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900">
                                <TableHead className="text-white">Lead No</TableHead>
                                <TableHead className="text-white">Loan Type</TableHead>
                                <TableHead className="text-white">Customer Name</TableHead>
                                <TableHead className="text-white">Advisor Name</TableHead>
                                <TableHead className="text-white">Invoice Date</TableHead>
                                <TableHead className="text-white">Disbursal Date</TableHead>
                                <TableHead className="text-white">Invoice No</TableHead>
                                <TableHead className="text-white">Disbursal Amt</TableHead>
                                <TableHead className="text-white">Payout %</TableHead>
                                <TableHead className="text-white">Payout Amt</TableHead>
                                <TableHead className="text-white">TDS %</TableHead>
                                <TableHead className="text-white">TDS Amt</TableHead>
                                <TableHead className="text-white">GST %</TableHead>
                                <TableHead className="text-white">GST Amt</TableHead>
                                <TableHead className="text-white">Receivable Amt</TableHead>
                                <TableHead className="text-white">Edit</TableHead>
                                <TableHead className="text-white">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead, index) => (
                                <TableRow key={lead?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                    <TableCell>{lead.leadNo}</TableCell>
                                    <TableCell>{lead.loanServiceType}</TableCell>
                                    <TableCell>{lead.customerName}</TableCell>
                                    <TableCell>{lead.advisorName}</TableCell>
                                    <TableCell>{lead.invoiceDate?.split('T')[0]}</TableCell>
                                    <TableCell>{lead.disbursalDate?.split('T')[0]}</TableCell>
                                    <TableCell>{lead.invoiceNo}</TableCell>
                                    <TableCell>{lead.disbursalAmount}</TableCell>
                                    <TableCell>{lead.payoutPercent}</TableCell>
                                    <TableCell>{lead.payoutAmount}</TableCell>
                                    <TableCell>{lead.tdsPercent}</TableCell>
                                    <TableCell>{lead.tdsAmount}</TableCell>
                                    <TableCell>{lead.gstPercent}</TableCell>
                                    <TableCell>{lead.gstAmount}</TableCell>
                                    <TableCell>{lead.netReceivableAmount}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => navigate(`/admin/edit_invoices/${lead?._id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs">Edit</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            loading={isLoading}
                                            onClick={() => handleDelete(lead?._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>}
        </div>
    )
}

export default Invoices;
