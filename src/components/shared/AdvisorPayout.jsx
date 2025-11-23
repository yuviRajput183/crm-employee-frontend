import React, { useEffect, useState } from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Monitor } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import AdvisorInvoicesFilter from './AdvisorInvoicesFilter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiListAdvisorPayouts } from '@/services/advisorPayout.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useAdvisorPayout } from '@/lib/hooks/useAdvisorPayout';
import { useNavigate } from 'react-router-dom';
import AddAdvisorPayout from './AddAdvisorPayout';


const filterSchema = z.object({
    loanServiceType: z.string().optional(),
    advisorName: z.string().optional(),
    clientName: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})

const AdvisorPayout = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [payoutData, setPayoutData] = useState([]);
    const [showAddAdvisorPayout, setShowAddAdvisorPayout] = useState(false);

    const navigate = useNavigate();

    // fetching new leads on component mount and on filtering
    const {
        isError: isNewLeadsError,
        error: newLeadsError,
        data: queryData,
        refetch
    } = useQuery({
        queryKey: ['advisor-payouts', filterParams], // Changed queryKey name for clarity
        queryFn: async () => {
            const res = await apiListAdvisorPayouts(filterParams);
            console.log("📦 queryFn response of list advisor payouts:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching my list advisor payouts:", err);
        }
    });



    // Update leads when query data changes
    useEffect(() => {
        console.log("inside use effect .....");
        if (queryData?.data?.data?.advisorPayouts?.length > 0) {
            setLeads(queryData.data.data.advisorPayouts);

            const totals = queryData.data.data.totals || {};
            setPayoutData([
                {
                    label: "Gross Amount",
                    value: totals.grossAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-red-500",
                    iconColor: "text-red-500"
                },
                {
                    label: "Total Payout",
                    value: totals.totalPayoutAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-blue-500",
                    iconColor: "text-blue-500"
                },
                {
                    label: "TDS Amount",
                    value: totals.totalTdsAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-teal-400",
                    iconColor: "text-teal-400"
                },
                {
                    label: "GST Amount",
                    value: totals.totalGstAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-amber-400",
                    iconColor: "text-amber-400"
                }
            ]);

        } else if (queryData?.data?.data) {
            // Handle case where advisorPayouts might be empty or structured differently
            setLeads([]);
        }
    }, [queryData]);




    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            loanServiceType: '', // Fixed: was 'productType', should match schema
            advisorName: '',
            clientName: '',
            fromDate: '',
            toDate: '',
        },
    })

    const handleFilter = async (values) => {
        console.log("submitting values for filter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '' && val !== undefined)
        );

        // Only update filterParams - this will trigger the query automatically
        setFilterParams(cleanParams);
        setShowFilter(false);
        // Remove refetch() call - it's causing duplicate API calls
    }


    const { deleteAdvisorPayout } = useAdvisorPayout();
    const { mutateAsync, isLoading, isError, error } = deleteAdvisorPayout;

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
                    <h1 className=' text-2xl text-bold'>Advisor Payout</h1>
                </div>
                {!showAddAdvisorPayout && <div className=' flex items-center gap-2'>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowAddAdvisorPayout(!showAddAdvisorPayout)}>Add +</Button>
                </div>
                }

            </div>

            {isNewLeadsError && (
                <Alert variant="destructive">{getErrorMessage(newLeadsError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}

            {showAddAdvisorPayout ?
                <AddAdvisorPayout /> :
                <>
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

                    {showFilter && <AdvisorInvoicesFilter form={form} handleFilter={handleFilter} showFilter={showFilter}></AdvisorInvoicesFilter>}

                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-green-900 text-white hover:bg-green-900 cursor-pointer">
                                    <TableHead className="text-white">Lead No</TableHead>
                                    <TableHead className="text-white">Loan Type</TableHead>
                                    <TableHead className="text-white">Advisor Name</TableHead>
                                    <TableHead className="text-white">Customer Name</TableHead>
                                    <TableHead className="text-white">Disbursal Amt</TableHead>
                                    <TableHead className="text-white">Disbursal Date</TableHead>
                                    <TableHead className="text-white">Payout %</TableHead>
                                    <TableHead className="text-white">Payout Amt</TableHead>
                                    <TableHead className="text-white">TDS %</TableHead>
                                    <TableHead className="text-white">TDS Amt</TableHead>
                                    <TableHead className="text-white">GST</TableHead>
                                    <TableHead className="text-white">Invoice Date</TableHead>
                                    <TableHead className="text-white">Invoice No</TableHead>
                                    <TableHead className="text-white">GST %</TableHead>
                                    <TableHead className="text-white">GST Amt</TableHead>
                                    <TableHead className="text-white">Payable Amt</TableHead>
                                    <TableHead className="text-white">Edit</TableHead>
                                    <TableHead className="text-white">Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead, index) => (
                                    <TableRow key={lead?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <TableCell>{lead?.leadId?.leadNo}</TableCell>
                                        <TableCell>{lead?.leadId?.productType}</TableCell>
                                        <TableCell>{lead?.advisorId?.name}</TableCell>
                                        <TableCell>{lead?.leadId?.clientName}</TableCell>
                                        <TableCell>{lead?.disbursalAmount}</TableCell>
                                        <TableCell>{lead?.disbursalDate?.split('T')[0]}</TableCell>
                                        <TableCell>{lead.payoutPercent}</TableCell>
                                        <TableCell>{lead.payoutAmount}</TableCell>
                                        <TableCell>{lead.tdsPercent}</TableCell>
                                        <TableCell>{lead.tdsAmount}</TableCell>
                                        <TableCell>{lead.gstApplicable ? "Applicable" : "Not Applicable"}</TableCell>
                                        <TableCell>{lead.invoiceDate?.split('T')[0]}</TableCell>
                                        <TableCell>{lead.invoiceNo}</TableCell>
                                        <TableCell>{lead.gstPercent}</TableCell>
                                        <TableCell>{lead.gstAmount}</TableCell>
                                        <TableCell>{lead.netPayableAmount}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate(`/admin/edit_advisor_payout/${lead?._id}`)}
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
                </>
            }


        </div>
    )
}

export default AdvisorPayout;