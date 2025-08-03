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



const leadStatusData = [
    { label: "Total Leads", count: 33, percent: 0, colorKey: "total" },
    { label: "New Leads", count: 0, percent: 0, colorKey: "new" },
    { label: "Allocated", count: 9, percent: 27, colorKey: "allocated" },
    { label: "Docs Query", count: 3, percent: 9, colorKey: "docs" },
    { label: "Approved", count: 6, percent: 18, colorKey: "approved" },
    { label: "Under Process", count: 15, percent: 45, colorKey: "process" },
];

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

const leads = [
    { leadNo: 647, productType: "Loan Against Property", amount: "698984", customer: "Naman/Akil", mobile: "9467222014", leadDate: "02/07/2025", advisor: "Sachin Soni", allocatedTo: "Juhi", feedback: "Allocated" },
    { leadNo: 646, productType: "Loan Against Property", amount: "3000000", customer: "Naveen (Lucky)", mobile: "9215200475", leadDate: "02/07/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 645, productType: "Home Loan", amount: "5000000", customer: "Anand Kumar", mobile: "9997052979", leadDate: "01/07/2025", advisor: "Rohit Aggarwal", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 644, productType: "Home Loan", amount: "10000000", customer: "Jai Bharat", mobile: "9813815885", leadDate: "01/07/2025", advisor: "Hitesh Grover", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 643, productType: "Home Loan", amount: "3000000", customer: "Rohit Singla", mobile: "9999999999", leadDate: "28/06/2025", advisor: "Shivam", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 642, productType: "Loan Against Property", amount: "5000000", customer: "Ravi Kumar", mobile: "8814904501", leadDate: "26/06/2025", advisor: "Sahil Grover", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 641, productType: "Home Loan", amount: "12500000", customer: "Anju Bala", mobile: "8510885101", leadDate: "23/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Docs Query" },
    { leadNo: 640, productType: "Home Loan", amount: "1500000", customer: "Vinod", mobile: "7404940200", leadDate: "21/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Under Process" },
    { leadNo: 639, productType: "Home Loan", amount: "3000000", customer: "Amit Saini", mobile: "7988409216", leadDate: "19/06/2025", advisor: "Rubal Shridhar", allocatedTo: "Pankaj", feedback: "Under Process" },
    { leadNo: 638, productType: "Loan Against Property", amount: "10000000", customer: "Roshan", mobile: "8860176797", leadDate: "17/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Docs Query" },
    { leadNo: 637, productType: "Home Loan", amount: "3960000", customer: "Sunita Rani", mobile: "9052690300", leadDate: "17/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Approved" },
    { leadNo: 636, productType: "Loan Against Property", amount: "2900000", customer: "Shyam Kumawat", mobile: "9414283308", leadDate: "15/06/2025", advisor: "Shivam", allocatedTo: "Pankaj", feedback: "Under Process" },
    { leadNo: 635, productType: "Home Loan", amount: "7200000", customer: "Manoj Sharma", mobile: "9999999999", leadDate: "13/06/2025", advisor: "Rohit Aggarwal", allocatedTo: "Juhi", feedback: "Allocated" },
    { leadNo: 634, productType: "Loan Against Property", amount: "1500000", customer: "Arun Jain", mobile: "9444011223", leadDate: "10/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Docs Query" },
    { leadNo: 633, productType: "Home Loan", amount: "8500000", customer: "Vikram Bedi", mobile: "9876543210", leadDate: "09/06/2025", advisor: "Sachin Soni", allocatedTo: "Juhi", feedback: "Under Process" },
    { leadNo: 632, productType: "Loan Against Property", amount: "4300000", customer: "Rajeev Sethi", mobile: "9654321876", leadDate: "08/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Loan Approved" },
    { leadNo: 631, productType: "Home Loan", amount: "3100000", customer: "Kavita Mehta", mobile: "8888812345", leadDate: "06/06/2025", advisor: "Shivam", allocatedTo: "Juhi", feedback: "Allocated" },
    { leadNo: 630, productType: "Loan Against Property", amount: "9800000", customer: "Deepak Rana", mobile: "9812312312", leadDate: "04/06/2025", advisor: "Sachin Soni", allocatedTo: "Juhi", feedback: "Docs Query" },
    { leadNo: 629, productType: "Home Loan", amount: "2700000", customer: "Anita Kapoor", mobile: "9876534567", leadDate: "02/06/2025", advisor: "Rohit Aggarwal", allocatedTo: "Pankaj", feedback: "Under Process" },
    { leadNo: 628, productType: "Home Loan", amount: "5600000", customer: "Suresh Verma", mobile: "9988776655", leadDate: "01/06/2025", advisor: "Hitesh Grover", allocatedTo: "Pankaj", feedback: "Loan Approved" },
    { leadNo: 627, productType: "Loan Against Property", amount: "3500000", customer: "Rina Das", mobile: "9445566778", leadDate: "30/05/2025", advisor: "Shivam", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 626, productType: "Home Loan", amount: "6000000", customer: "Devansh Mehta", mobile: "9877098765", leadDate: "28/05/2025", advisor: "Sahil Grover", allocatedTo: "Juhi", feedback: "Docs Query" },
    { leadNo: 625, productType: "Loan Against Property", amount: "12000000", customer: "Payal Joshi", mobile: "9654098765", leadDate: "26/05/2025", advisor: "Sachin Soni", allocatedTo: "Pankaj", feedback: "Loan Approved" },
    { leadNo: 624, productType: "Home Loan", amount: "8700000", customer: "Bhavesh Goyal", mobile: "9845098763", leadDate: "25/05/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Under Process" },
    { leadNo: 623, productType: "Loan Against Property", amount: "9100000", customer: "Sameer Arora", mobile: "9812054321", leadDate: "23/05/2025", advisor: "Hitesh Grover", allocatedTo: "Pankaj", feedback: "Docs Query" },
    { leadNo: 622, productType: "Home Loan", amount: "7000000", customer: "Isha Chauhan", mobile: "9321432111", leadDate: "21/05/2025", advisor: "Rohit Aggarwal", allocatedTo: "Pankaj", feedback: "Allocated" },
    { leadNo: 621, productType: "Loan Against Property", amount: "8000000", customer: "Meena Sharma", mobile: "9990008888", leadDate: "20/05/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Loan Approved" },
    { leadNo: 620, productType: "Home Loan", amount: "3000000", customer: "Mohit Jain", mobile: "9221122233", leadDate: "18/05/2025", advisor: "Sachin Soni", allocatedTo: "Pankaj", feedback: "Under Process" },
    { leadNo: 619, productType: "Loan Against Property", amount: "4500000", customer: "Yash Verma", mobile: "9812398765", leadDate: "16/05/2025", advisor: "Shivam", allocatedTo: "Juhi", feedback: "Docs Query" },
    { leadNo: 618, productType: "Home Loan", amount: "7800000", customer: "Pooja Singh", mobile: "9448399999", leadDate: "14/05/2025", advisor: "Sahil Grover", allocatedTo: "Juhi", feedback: "Allocated" }
];


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

const NewLead = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [newLeadsData, setNewLeadsData] = useState([]);
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [total, setTotal] = useState(null);

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
                <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
            </div>

            {isNewLeadsError && (
                <Alert variant="destructive">{getErrorMessage(newLeadsError)}</Alert>
            )}


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


                {/* {leadStatusData.map((item, index) => (
                    <div key={index} className="p-4 flex flex-col gap-2 bg-white ">
                        <h2 className="font-semibold text-gray-700">{item.label}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-800 font-medium text-lg">{item.count}</span>
                            {item.label !== "Total Leads" && (
                                <span className={`text-xl font-semibold ${statusColors[item.colorKey]}`}>
                                    {item.percent}%
                                </span>
                            )}
                        </div>
                        {item.percent !== undefined && (
                            <Slider
                                defaultValue={[item.percent]}
                                max={100}
                                step={1}
                                disabled
                                className="mt-2"
                                style={{
                                    background: `linear-gradient(to right, ${sliderColors[item.colorKey]} ${item.percent}%, #e5e7eb ${item.percent}%)`,
                                    height: "6px",
                                    borderRadius: "9999px",
                                }}
                                thumbClassName={`border-2 ${statusColors[item.colorKey]} bg-white`}
                            />
                        )}
                    </div>
                ))} */}


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

export default NewLead
