import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiGetGSTReceivablesReport } from '@/services/reports.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import ReportsFilterSection from './ReportsFilterSection';

const GSTReceivableReport = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});

    const form = useForm({
        defaultValues: {
            loanType: '',
            advisorName: '',
            status: '',
            fromDate: '',
            toDate: '',
        },
    });

    const {
        data: reportData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gst-receivables-report', filterParams],
        queryFn: async () => {
            const res = await apiGetGSTReceivablesReport(filterParams);
            return res?.data?.data || [];
        },
        refetchOnWindowFocus: false,
    });

    const handleFilter = (values) => {
        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '')
        );
        setFilterParams(cleanParams);
    };

    return (
        <div className=' p-3 bg-white rounded shadow min-h-screen'>
            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar className=" rounded-none w-8 h-8">
                        <AvatarImage src={barchart} className=" object-contain" />
                        <AvatarFallback>GR</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl font-bold text-gray-700'>GST Receivable Report</h1>
                </div>
                <Button
                    className=" bg-[#4b3f5a] hover:bg-[#3d334a] px-10 rounded-md h-10"
                    onClick={() => setShowFilter(!showFilter)}
                >
                    {showFilter ? "Hide Filter" : "Show Filter"}
                </Button>
            </div>

            {isError && (
                <Alert variant="destructive" className="mt-4">
                    {getErrorMessage(error)}
                </Alert>
            )}

            <ReportsFilterSection
                form={form}
                showFilter={showFilter}
                handleFilter={handleFilter}
            />

            {/* table container */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table className="min-w-[1400px]">
                    <TableHeader>
                        <TableRow className="bg-[#1e4d46] text-white hover:bg-[#1e4d46]">
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Lead No</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Disbursal Date</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Client Name</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Product</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Advisor</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Bank</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Banker</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Invoice No</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Invoice Date</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Bill Amt.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">GST %age</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">GST Amt.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Received Amt.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Processed By</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Pending Amt.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={16} className="text-center py-10">Loading report data...</TableCell>
                            </TableRow>
                        ) : reportData?.data?.length > 0 ? (
                            reportData.data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-[#f1f5f4]" : "bg-white"} hover:bg-gray-100 transition-colors border-b`}
                                >
                                    <TableCell className="text-xs py-2 border-r">{row.leadNo}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.disbursalDate ? new Date(row.disbursalDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                                    <TableCell className="text-xs py-2 border-r font-medium text-[#1e4d46]">{row.clientName}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.product}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-blue-700">{row.advisor}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.bank}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.banker}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.invoiceNo}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.billAmt}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.gstPercentage}</TableCell>
                                    <TableCell className="text-xs py-2 border-r font-bold">{row.gstAmt}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-green-700 font-bold">{row.receivedAmt}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.processedBy}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-red-600 font-bold">{row.pendingAmt}</TableCell>
                                    <TableCell className="text-xs py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Received' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={16} className="text-center py-10 text-gray-500">No receivable records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default GSTReceivableReport;
