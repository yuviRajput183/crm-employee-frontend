import React, { useEffect, useState } from 'react'
import deletee from "@/assets/images/image.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from '@tanstack/react-query';
import { apiListAllLeads } from '@/services/attachments.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';



const DeleteAttachments = () => {

    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);

    // fetching all leads on component mount and on filtering
    const {
        isError: isLeadsError,
        error: leadsError,
        data: queryData,
        // refetch
    } = useQuery({
        queryKey: ['advisor-payouts', filterParams], // Changed queryKey name for clarity
        queryFn: async () => {
            const res = await apiListAllLeads(filterParams);
            console.log("📦 queryFn response of list invoices:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching all leads :", err);
        }
    });

    const handleFilter = async (values) => {
        console.log("submitting values for filter in handle Filter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '' && val !== undefined)
        );

        // Only update filterParams - this will trigger the query automatically
        setFilterParams(cleanParams);
    }



    // Update leads when query data changes
    useEffect(() => {
        console.log("query data >>>", queryData);

        if (queryData?.data?.data?.leads?.length > 0) {
            setLeads(queryData.data.data?.leads);
        } else if (queryData?.data?.data) {
            setLeads([]);
        }
    }, [queryData]);


    console.log("all leads >>>", queryData);

    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex items-center gap-2 pb-2 border-b-2  '>
                <Avatar >
                    <AvatarImage src={deletee} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Delete Attachments</h1>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 shadow mt-4 border border-gray-100 rounded-md p-4 bg-white">
                {/* Loan Type Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Loan Type</label>
                    <select className="border rounded px-3 py-2 text-sm text-gray-700">
                        <option value="">Select</option>
                        <option value="home-loan">Home Loan</option>
                        <option value="lap">Loan Against Property</option>
                        <option value="insurance">Insurance</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                {/* Lead Feedback Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Lead Feedback</label>
                    <select className="border rounded px-3 py-2 text-sm text-gray-700">
                        <option value="">Select</option>
                        <option value="allocated">Allocated</option>
                        <option value="policy-issued">Policy Issued</option>
                        <option value="loan-disbursed">Loan Disbursed</option>
                        <option value="loan-rejected">Loan Rejected</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                {/* Advisor Name Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Advisor Name</label>
                    <select className="border rounded px-3 py-2 text-sm text-gray-700">
                        <option value="">Select</option>
                        <option value="Sachin Soni">Sachin Soni</option>
                        <option value="Parul Gandhi">Parul Gandhi</option>
                        <option value="Himanshu Sachdeva">Himanshu Sachdeva</option>
                        <option value="Shivam">Shivam</option>
                        {/* Add more dynamically */}
                    </select>
                </div>

                {/* From Date Picker */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">From Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        placeholder="DD/MM/YYYY"
                    />
                </div>

                {/* To Date Picker */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">To Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        placeholder="DD/MM/YYYY"
                    />
                </div>

                {/* Show Button */}
                <div className="flex items-end">
                    <button className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded w-full">
                        SHOW
                    </button>
                </div>
            </div>

            {isLeadsError && (
                <Alert variant="destructive">{getErrorMessage(leadsError)}</Alert>
            )}

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">

                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Sr. No</TableHead>
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Product Type</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">Lead Date</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Allocated To</TableHead>
                            <TableHead className="text-white">Feedback</TableHead>
                            <TableHead className="text-white">Select</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <TableRow
                                key={lead.leadNo}
                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{lead?.leadNo}</TableCell>
                                <TableCell>{lead?.productType}</TableCell>
                                <TableCell>{lead?.advisorId?.name}</TableCell>
                                <TableCell>{lead?.amount?.toLocaleString()}</TableCell>
                                <TableCell>{lead?.createdAt?.split('T')[0]}</TableCell>
                                <TableCell>{lead?.clientName}</TableCell>
                                <TableCell>{lead?.mobileNo}</TableCell>
                                <TableCell>{lead?.allocatedTo?.name}</TableCell>
                                <TableCell>{lead?.feedback}</TableCell>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4">
                <Button className=" bg-blue-500 hover:bg-blue-500">Delete Attachments</Button>
            </div>

        </div>
    )
}

export default DeleteAttachments
