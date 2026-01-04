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
import { useQuery } from '@tanstack/react-query';
import { apiMyAdvisorPayout } from '@/services/advisorPayout.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Input } from '../ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

const productTypes = [
    "All Product Types",
    "Personal Loan",
    "Business Loan",
    "Home Loan",
    "Loan Against Property",
    "Car Loan",
    "Used Car Loan",
    "Insurance",
    "Services",
    "Others"
];

const paymentStatuses = [
    "All Payment Status",
    "Pending",
    "Paid"
];



const MyPayout = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [payoutData, setPayoutData] = useState([
        {
            label: "Total Disbursal",
            value: "0",
            color: "bg-red-500",
            iconColor: "text-red-500"
        },
        {
            label: "Total Payout",
            value: "0",
            color: "bg-blue-500",
            iconColor: "text-blue-500",
        },
        {
            label: "Paid Amount",
            value: "0",
            color: "bg-teal-400",
            iconColor: "text-teal-400"
        },
        {
            label: "Pending Amount",
            value: "0",
            color: "bg-amber-400",
            iconColor: "text-amber-400"
        },
    ]);

    // fetching my payouts on component mount and on filtering
    const {
        isError: isPayoutsError,
        error: payoutsError,
        data: queryData,
        refetch
    } = useQuery({
        queryKey: ['my-advisor-payout', filterParams],
        queryFn: async () => {
            const res = await apiMyAdvisorPayout(filterParams);
            console.log("📦 queryFn response of my advisor payout:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching my advisor payouts:", err);
        }
    });


    // Update leads and payoutData when query data changes
    useEffect(() => {
        console.log("inside use effect .....");
        if (queryData?.data?.data?.advisorPayouts?.length > 0) {
            setLeads(queryData.data.data.advisorPayouts);

            const totals = queryData.data.data.totals || {};
            setPayoutData([
                {
                    label: "Total Disbursal",
                    value: totals.totalDisbursalAmount?.toLocaleString("en-IN") ?? "0",
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
                    label: "Paid Amount",
                    value: totals.paidAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-teal-400",
                    iconColor: "text-teal-400"
                },
                {
                    label: "Pending Amount",
                    value: totals.pendingAmount?.toLocaleString("en-IN") ?? "0",
                    color: "bg-amber-400",
                    iconColor: "text-amber-400"
                }
            ]);

        } else if (queryData?.data?.data) {
            // Handle case where advisorPayouts might be empty
            setLeads([]);
        }
    }, [queryData]);




    // Filter state
    const [productType, setProductType] = useState('All Product Types');
    const [paymentStatus, setPaymentStatus] = useState('All Payment Status');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleFilter = () => {
        const cleanParams = {};

        if (productType && productType !== 'All Product Types') {
            cleanParams.productType = productType;
        }
        if (paymentStatus && paymentStatus !== 'All Payment Status') {
            cleanParams.paymentStatus = paymentStatus;
        }
        if (fromDate) {
            cleanParams.fromDate = fromDate;
        }
        if (toDate) {
            cleanParams.toDate = toDate;
        }

        console.log("submitting values for filter>>", cleanParams);
        setFilterParams(cleanParams);
    }


    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>My Payout</h1>
                </div>
                <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
            </div>

            {isPayoutsError && (
                <Alert variant="destructive">{getErrorMessage(payoutsError)}</Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
                {payoutData.map((item, index) => (
                    <div
                        key={index}
                        className={` cursor-pointer text-white p-5 rounded-md shadow-md flex items-center justify-between ${item.color}`}
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

            {showFilter && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    {/* Product Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                        <Select value={productType} onValueChange={setProductType}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="All Product Types" />
                            </SelectTrigger>
                            <SelectContent>
                                {productTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="All Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* From Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="bg-white"
                        />
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="bg-white"
                        />
                    </div>

                    {/* Show Button */}
                    <div className="flex items-end">
                        <Button
                            onClick={handleFilter}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-8 w-full"
                        >
                            SHOW
                        </Button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900 cursor-pointer">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Loan Type</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Disbursal Amt.</TableHead>
                            <TableHead className="text-white">Disbursal Date</TableHead>
                            <TableHead className="text-white">Payout %</TableHead>
                            <TableHead className="text-white">Payout Amt.</TableHead>
                            <TableHead className="text-white">TDS %</TableHead>
                            <TableHead className="text-white">TDS Amt.</TableHead>
                            <TableHead className="text-white">GST</TableHead>
                            <TableHead className="text-white">Invoice Date</TableHead>
                            <TableHead className="text-white">Invoice No</TableHead>
                            <TableHead className="text-white">GST %</TableHead>
                            <TableHead className="text-white">GST Amt.</TableHead>
                            <TableHead className="text-white">Paid Amt.</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <TableRow key={lead?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{lead?.leadId?.leadNo || '-'}</TableCell>
                                <TableCell>{lead?.leadId?.productType || '-'}</TableCell>
                                <TableCell>{lead?.leadId?.clientName || '-'}</TableCell>
                                <TableCell>{lead?.disbursalAmount || '-'}</TableCell>
                                <TableCell>{lead?.disbursalDate?.split('T')[0] || '-'}</TableCell>
                                <TableCell>{lead?.payoutPercent || '-'}</TableCell>
                                <TableCell>{lead?.payoutAmount || '-'}</TableCell>
                                <TableCell>{lead?.tdsPercent || '-'}</TableCell>
                                <TableCell>{lead?.tdsAmount || '-'}</TableCell>
                                <TableCell>{lead?.gstApplicable ? "Applicable" : "Not Applicable"}</TableCell>
                                <TableCell>{lead?.invoiceDate?.split('T')[0] || '-'}</TableCell>
                                <TableCell>{lead?.invoiceNo || '-'}</TableCell>
                                <TableCell>{lead?.gstPercent || '-'}</TableCell>
                                <TableCell>{lead?.gstAmount || '-'}</TableCell>
                                <TableCell>{lead?.paidAmount || '-'}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${lead?.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        lead?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {lead?.status || '-'}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {leads.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={16} className="text-center text-gray-500 py-8">
                                    No payout records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default MyPayout
