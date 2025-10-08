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
import FilterSection from './FilterSection';
import { useQuery } from '@tanstack/react-query';
import { apiListNewLead } from '@/services/lead.api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import EditLeadAdvisor from './EditLeadAdvisor';
import { useNavigate } from 'react-router-dom';





const statusKeyMap = {
    "Allocated": "allocated",
    "Approved": "approved",
    "Docs Query": "docs",
    "Under Process": "process",
};

const statusColors = {
    total: "text-[#3b82f6]",         // Blue
    new: "text-[#f59e0b]",          // Amber
    allocated: "text-[#10b981]",    // Emerald
    docs: "text-[#facc15]",         // Yellow
    approved: "text-[#ef4444]",     // Red
    process: "text-[#3b82f6]",      // Blue
};

const sliderColors = {
    total: "#3b82f6",       // Blue
    new: "#f59e0b",        // Amber
    allocated: "#10b981",  // Emerald
    docs: "#facc15",       // Yellow
    approved: "#ef4444",   // Red
    process: "#3b82f6",    // Blue
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


// mapping of product type -> edit path 
const editProductPathMap = {
    "Personal Loan": "/admin/edit_personal_loan",
    "Business Loan": "/admin/edit_business_loan",
    "Home Loan": "/admin/edit_home_loan",
    "Loan Against Property": "/admin/edit_loan_against_property",
    "Car Loan": "/admin/edit_car_loan",
    "Used Car Loan": "/admin/edit_used_car_loan",      // remaining
    "Insurance": "/admin/edit_insurance",
    "Services": "/admin/edit_services",
    "Others": "/admin/edit_others"
}

const NewLead = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [newLeadsData, setNewLeadsData] = useState([]);
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [total, setTotal] = useState(null);
    const [showEditAdvisor, setShowEditAdvisor] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    const navigate = useNavigate();

    // fetching new leads on component mount and on filtering
    const {
        isError: isNewLeadsError,
        error: newLeadsError,
        refetch
    } = useQuery({
        queryKey: ['new-leads', filterParams],
        queryFn: async () => {
            const res = await apiListNewLead(filterParams);
            console.log("📦 queryFn response of my lead:", res);
            setNewLeadsData(res?.data?.data || []);
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

        if (newLeadsData?.leads?.length > 0) {
            setLeads(newLeadsData?.leads);
        }
        if (newLeadsData?.stats) {
            setStats(newLeadsData?.stats);
        }
        if (newLeadsData?.total) {
            setTotal(newLeadsData?.total);
        }
    }, [newLeadsData]);


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



    console.log("newLeadsData>>", newLeadsData);
    // console.log("leads array >>", leads);
    // console.log("total>>", total);
    // console.log("stats>>", stats);

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
                    <h1 className=' text-2xl text-bold'>New Leads</h1>
                </div>
                {!showEditAdvisor && <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>}
            </div>

            {isNewLeadsError && (
                <Alert variant="destructive">{getErrorMessage(newLeadsError)}</Alert>
            )}


            {!showEditAdvisor && (
                <>
                    {/* slider */}
                    {!showFilter && <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 shadow mt-4 border border-gray-100 rounded-md ">

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



                    </div>}


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
                                        <TableCell>{lead?.loanRequirementAmount || lead?.insuranceAmount || lead?.amount}</TableCell>
                                        <TableCell>{lead.clientName}</TableCell>
                                        <TableCell>{lead.mobileNo}</TableCell>
                                        <TableCell>{lead.createdAt.split('T')[0]}</TableCell>
                                        <TableCell>{lead?.advisorId?.name}</TableCell>
                                        <TableCell>{lead.allocatedTo?.name}</TableCell>
                                        <TableCell>{lead?.history[lead?.history?.length - 1].feedback}</TableCell>
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
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setShowEditAdvisor(true);
                                                }}
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
                </>
            )}

            {showEditAdvisor && (
                <EditLeadAdvisor
                    lead={selectedLead}
                    onClose={() => setShowEditAdvisor(false)}
                    refetch={refetch}
                />
            )}

        </div>
    )
}

export default NewLead
