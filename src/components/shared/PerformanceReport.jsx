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
import { apiGetPerformanceReport } from '@/services/reports.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import ReportsFilterSection from './ReportsFilterSection';

const PerformanceReport = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});

    const form = useForm({
        defaultValues: {
            loanType: '',
            advisorName: '',
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
        queryKey: ['performance-report', filterParams],
        queryFn: async () => {
            const res = await apiGetPerformanceReport(filterParams);
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
                        <AvatarFallback>RR</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl font-bold text-gray-700'>Performance Report</h1>
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
                hideStatus={true}
            />

            {/* table container */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table className="min-w-[2200px]">
                    <TableHeader>
                        <TableRow className="bg-[#1e4d46] text-white hover:bg-[#1e4d46]">
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Lead No</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Disbursal Date</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Client Name</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Product</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Disbursal Amt.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Advisor</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Bank</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Banker</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Disbursal Month</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Employee</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Gross Recd.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Gross Paid</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Gross Profit</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">TDS Paid</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">TDS Deducted</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Net Recd.</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Net Paid</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Cash Profit</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold">Processed By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={19} className="text-center py-10">Loading report data...</TableCell>
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
                                    <TableCell className="text-xs py-2 border-r">{row.disbursalAmt}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-blue-700">{row.advisor}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.bank}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.banker}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.disbursalMonth}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.employee}</TableCell>
                                    <TableCell className="text-xs py-2 border-r font-bold">{row.grossRecd}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.grossPaid}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-green-700 font-bold">{row.grossProfit}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.tdsPaid}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.tdsDeducted}</TableCell>
                                    <TableCell className="text-xs py-2 border-r font-bold">{row.netRecd}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.netPaid}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-blue-800 font-bold">{row.cashProfit}</TableCell>
                                    <TableCell className="text-xs py-2">{row.processedBy}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={19} className="text-center py-10 text-gray-500">No performance records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default PerformanceReport;
