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
import { apiListAdvisorMyLead } from '@/services/lead.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '../ui/alert';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import AdvisorLeadFilter from './AdvisorLeadFilter';

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


// Filter schema for advisor leads
const filterSchema = z.object({
    productType: z.string().optional(),
    feedback: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})


// mapping of product type -> edit path 
const editProductPathMap = {
    "Personal Loan": "/advisor/edit_personal_loan",
    "Business Loan": "/advisor/edit_business_loan",
    "Home Loan": "/advisor/edit_home_loan",
    "Loan Against Property": "/advisor/edit_loan_against_property",
    "Car Loan": "/advisor/edit_car_loan",
    "Used Car Loan": "/advisor/edit_used_car_loan",
    "Insurance": "/advisor/edit_insurance",
    "Services": "/advisor/edit_services",
    "Others": "/advisor/edit_others"
}

const AdvisorMyLead = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [myLeadsData, setMyLeadsData] = useState(null);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [total, setTotal] = useState(null);

    const navigate = useNavigate();

    // fetching advisor my leads on component mount and on filtering
    const {
        isError: isMyLeadsError,
        error: myLeadsError,
        refetch
    } = useQuery({
        queryKey: ['advisor-my-leads', filterParams],
        queryFn: async () => {
            const res = await apiListAdvisorMyLead(filterParams);
            console.log("📦 queryFn response of advisor my lead:", res);
            setMyLeadsData(res?.data?.data || null);
            return res;
        },
        enabled: true,  // for fetching on component mount
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisor my leads:", err);
        }
    });

    useEffect(() => {
        // Always update leads, stats, and total based on API response
        // This ensures empty responses correctly clear the data
        setLeads(myLeadsData?.leads || []);
        setStats(myLeadsData?.stats || null);
        setTotal(myLeadsData?.total || null);
    }, [myLeadsData]);


    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            productType: '',
            feedback: '',
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


            <>
                {/* slider */}
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

                {/* Custom Filter Component */}
                <AdvisorLeadFilter
                    handleFilter={handleFilter}
                    form={form}
                    showFilter={showFilter}
                />

                {/* table */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900">
                                <TableHead className="text-white">Lead No</TableHead>
                                <TableHead className="text-white">Product Type</TableHead>
                                <TableHead className="text-white">Amount</TableHead>
                                <TableHead className="text-white">Customer Name</TableHead>
                                <TableHead className="text-white">Mobile No</TableHead>
                                <TableHead className="text-white">Lead Date</TableHead>
                                <TableHead className="text-white">Allocated To</TableHead>
                                <TableHead className="text-white">Feedback</TableHead>
                                <TableHead className="text-white">View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className=" ">
                            {leads.length > 0 ? (
                                leads.map((lead, index) => (
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
                                        <TableCell>{lead?.allocatedTo?.name}</TableCell>
                                        <TableCell>{lead?.history[lead?.history?.length - 1]?.feedback}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate(`${editProductPathMap[lead.productType]}/${lead?._id}`)}
                                                variant="default"
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                        No leads found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Add Button */}
                {/* <div className="mt-4">
                    <Button className=" bg-blue-500 hover:bg-blue-500">Export</Button>
                </div> */}
            </>

        </div>
    )
}

export default AdvisorMyLead
