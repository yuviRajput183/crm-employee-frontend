import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiGetMyPerformance, apiGetEmployeePerformance } from '@/services/invoices.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MyPerformanceFilter from './MyPerformanceFilter';


const filterSchema = z.object({
    loanServiceType: z.string().optional(),
    bankName: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});

// Helper function to get user role from localStorage
const getUserRole = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        return profile?.role?.toLowerCase() || "";
    } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        return "";
    }
};


const MyPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const userRole = getUserRole();

    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            loanServiceType: '',
            bankName: '',
            fromDate: '',
            toDate: '',
        },
    });

    // Fetch performance data from API - use different endpoint based on role
    const {
        isLoading,
        isError,
        error,
        data: queryData,
    } = useQuery({
        queryKey: ['my-performance', filterParams, userRole],
        queryFn: async () => {
            // Use employee-performance endpoint for employee role, advisor-performance for others
            const apiFunction = userRole === "employee" ? apiGetEmployeePerformance : apiGetMyPerformance;
            const res = await apiFunction(filterParams);
            console.log("📦 queryFn response of my performance:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching my performance data:", err);
        }
    });

    // Handle filter submission
    const handleFilter = async (values) => {
        console.log("submitting values for filter in handleFilter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '' && val !== undefined && val !== 'all')
        );

        // Update filterParams - this will trigger the query automatically
        setFilterParams(cleanParams);
        setShowFilter(false);
    };

    // Update performanceData when query data changes
    useEffect(() => {
        console.log("query data >>>", queryData);

        if (queryData?.data?.data?.performance?.length > 0) {
            setPerformanceData(queryData.data.data.performance);
        } else if (queryData?.data?.data) {
            setPerformanceData([]);
        }
    }, [queryData]);

    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={barchart} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>My Performance</h1>
                </div>
                <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>
                    {showFilter ? "Hide Filter" : "Show Filter"}
                </Button>
            </div>

            {isError && (
                <Alert variant="destructive" className="mt-4">{getErrorMessage(error)}</Alert>
            )}

            {showFilter && <MyPerformanceFilter showFilter={showFilter} form={form} handleFilter={handleFilter} />}

            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-500">Loading performance data...</p>
                </div>
            ) : (
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900">
                                <TableHead className="text-white">Lead No</TableHead>
                                <TableHead className="text-white">Loan Type</TableHead>
                                <TableHead className="text-white">Customer Name</TableHead>
                                <TableHead className="text-white">Bank Name</TableHead>
                                <TableHead className="text-white">Disbursal Amt.</TableHead>
                                <TableHead className="text-white">Disbursal Date</TableHead>
                                <TableHead className="text-white">Month</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {performanceData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                                        No performance data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                performanceData.map((row, index) => (
                                    <TableRow
                                        key={row._id || index}
                                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                                    >
                                        <TableCell>{row.leadNo}</TableCell>
                                        <TableCell>{row.loanType || row.loanServiceType}</TableCell>
                                        <TableCell>{row.customerName || "-"}</TableCell>
                                        <TableCell>{row.bankName || "-"}</TableCell>
                                        <TableCell>{row.disbursalAmt || row.disbursalAmount}</TableCell>
                                        <TableCell>{row.disbursalDate?.split('T')[0] || "-"}</TableCell>
                                        <TableCell>{row.month || "-"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default MyPerformance
