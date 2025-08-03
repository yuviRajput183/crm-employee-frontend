import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';
import { Slider } from "@/components/ui/slider";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiListMyLead } from '@/services/lead.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '../ui/alert';
import FilterSection from './FilterSection';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


// const leadStatusData = [
//     // { label: "Total Leads", count: 613, percent: 100, colorKey: "total" },
//     { label: "Disbursed", count: 261, percent: 43, colorKey: "disbursed" },
//     { label: "Policy Issued", count: 86, percent: 14, colorKey: "policy" },
//     { label: "Invoice Raised", count: 8, percent: 1, colorKey: "invoice" },
//     { label: "Rejected", count: 256, percent: 42, colorKey: "rejected" },
// ];

const statusKeyMap = {
    "Loan Disbursed": "disbursed",
    "Policy Issued": "policy",
    "Invoice Raised": "invoice",
    "Loan Rejected": "rejected",
};


const statusColors = {
    total: "text-[#3b82f6]",       // Blue
    disbursed: "text-[#10b981]",   // Green
    policy: "text-[#f59e0b]",      // Amber
    invoice: "text-[#fbbf24]",     // Yellow
    rejected: "text-[#ef4444]",    // Red
};

const sliderColors = {
    total: "#3b82f6",
    disbursed: "#10b981",
    policy: "#f59e0b",
    invoice: "#fbbf24",
    rejected: "#ef4444",
};


// Optional schema (you can add validations later)
const filterSchema = z.object({
    productType: z.string().optional(),
    advisorName: z.string().optional(),
    clientName: z.string().optional(),
    feedback: z.string().optional(),
    allocatedTo: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})

const MyLead = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [myLeadsData, setMyLeadsData] = useState([]);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [total, setTotal] = useState(null);


    // fetching my leads on component mount and on filtering
    const {
        isError: isMyLeadsError,
        error: myLeadsError,
        refetch
    } = useQuery({
        queryKey: ['my-leads', filterParams],
        queryFn: async () => {
            const res = await apiListMyLead(filterParams);
            console.log("📦 queryFn response of my lead:", res);
            setMyLeadsData(res?.data?.data || []);
            return res;
        },
        enabled: true,  // for fetching on component mount
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching my leads:", err);
        }
    });

    useEffect(() => {

        if (myLeadsData?.leads?.length > 0) {
            setLeads(myLeadsData?.leads);
        }
        if (myLeadsData?.stats) {
            setStats(myLeadsData?.stats);
        }
        if (myLeadsData?.total) {
            setTotal(myLeadsData?.total);
        }
    }, [myLeadsData]);


    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            productType: '',
            advisorName: '',
            clientName: '',
            feedback: '',
            allocatedTo: '',
            fromDate: '',
            toDate: '',
        },
    })

    console.log("myLeadsData>>", myLeadsData);
    console.log("leads array >>", leads);
    console.log("total>>", total);
    console.log("stats>>", stats);

    const handleFilter = async (values) => {
        console.log("submitting values for filter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '')
        );

        // update local state for queryKey + pass to API
        setFilterParams(cleanParams);

        // manually trigger query
        refetch();
        setShowFilter(false);

    }



    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={barchart} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>My Leads</h1>
                </div>
                <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
            </div>


            {isMyLeadsError && (
                <Alert variant="destructive">{getErrorMessage(myLeadsError)}</Alert>
            )}



            {!showFilter && <div className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4 shadow mt-4 border border-gray-100 rounded-md ">


                {total && <div className="p-4 flex flex-col gap-2 bg-white ">
                    <h2 className="font-semibold text-gray-700">Total Leads</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium text-lg">{total}</span>
                    </div>
                    {total !== undefined && (
                        <Slider
                            defaultValue={[parseFloat(total)]}
                            max={100}
                            step={1}
                            disabled
                            className="mt-2"
                            style={{
                                background: `linear-gradient(to right, #3b82f6 ${total}%, #e5e7eb ${total}%)`,
                                height: "6px",
                                borderRadius: "9999px",
                            }}
                            thumbClassName={`border-2 text-[#3b82f6] bg-white`}
                        />
                    )}
                </div>}


                {stats && Object.entries(stats)?.map(([key, value]) => (
                    <div key={key} className="p-4 flex flex-col gap-2 bg-white ">
                        <h2 className="font-semibold text-gray-700">{key}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-800 font-medium text-lg">{value?.count}</span>
                            <span className={`text-xl font-semibold ${statusColors[statusKeyMap[key]]}`}>
                                {value?.percentage}
                            </span>
                        </div>
                        {value?.percentage !== undefined && (
                            <Slider
                                defaultValue={[parseFloat(value?.percentage)]}
                                max={100}
                                step={1}
                                disabled
                                className="mt-2"
                                style={{
                                    background: `linear-gradient(to right, ${sliderColors[statusKeyMap[key]]} ${value.percentage}%, #e5e7eb ${value.percentage}%)`,
                                    height: "6px",
                                    borderRadius: "9999px",
                                }}
                                thumbClassName={`border-2 ${statusColors[statusKeyMap[key]]} bg-white`}
                            />
                        )}
                    </div>
                ))}
            </div>
            }

            {showFilter && <FilterSection handleFilter={handleFilter} form={form} showFilter={showFilter}></FilterSection>}

            {/* table */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] pverflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Product Type</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Lead Date</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Allocated To</TableHead>
                            <TableHead className="text-white">Feedback</TableHead>
                            <TableHead className="text-white">View</TableHead>
                            <TableHead className="text-white">DSA</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=" ">
                        {leads.map((lead, index) => (
                            <TableRow
                                key={lead.leadNo}
                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                            >
                                <TableCell>{lead.leadNo}</TableCell>
                                <TableCell>{lead.productType}</TableCell>
                                <TableCell>{lead?.amount || "100"}</TableCell>
                                <TableCell>{lead.clientName}</TableCell>
                                <TableCell>{lead.mobileNo}</TableCell>
                                <TableCell>{lead.createdAt.split('T')[0]}</TableCell>
                                <TableCell>{lead?.advisorId?.name}</TableCell>
                                <TableCell>{lead?.allocatedTo?.name}</TableCell>
                                <TableCell>{lead.feedback}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-[#3f3849] hover:bg-[#2e2a35] text-white"
                                    >
                                        Change
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Button */}
            <div className="mt-4">
                <Button className=" bg-blue-500 hover:bg-blue-500">Export</Button>
            </div>

        </div>
    )
}

export default MyLead
