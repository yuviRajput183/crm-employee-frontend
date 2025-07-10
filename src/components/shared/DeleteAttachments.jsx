import React from 'react'
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



const leadsData = [
    {
        srNo: 1,
        leadNo: 647,
        productType: "Loan Against Property",
        advisor: "Sachin Soni",
        amount: 698984,
        leadDate: "02/07/2025",
        customer: "Naman/Akil",
        mobile: "9467222014",
        allocatedTo: "Juhi",
        feedback: "Allocated",
    },
    {
        srNo: 2,
        leadNo: 646,
        productType: "Loan Against Property",
        advisor: "Parul Gandhi",
        amount: 3000000,
        leadDate: "02/07/2025",
        customer: "Naveen (Lucky)",
        mobile: "9215200475",
        allocatedTo: "Pankaj",
        feedback: "Allocated",
    },
    {
        srNo: 3,
        leadNo: 645,
        productType: "Insurance",
        advisor: "Parul Gandhi",
        amount: 60000,
        leadDate: "01/07/2025",
        customer: "Gourav",
        mobile: "9999999999",
        allocatedTo: "Juhi",
        feedback: "Policy Issued",
    },
    // Add more rows as needed
];



const DeleteAttachments = () => {
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

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
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
                        {leadsData.map((lead, index) => (
                            <TableRow
                                key={lead.leadNo}
                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                            >
                                <TableCell>{lead.srNo}</TableCell>
                                <TableCell>{lead.leadNo}</TableCell>
                                <TableCell>{lead.productType}</TableCell>
                                <TableCell>{lead.advisor}</TableCell>
                                <TableCell>{lead.amount.toLocaleString()}</TableCell>
                                <TableCell>{lead.leadDate}</TableCell>
                                <TableCell>{lead.customer}</TableCell>
                                <TableCell>{lead.mobile}</TableCell>
                                <TableCell>{lead.allocatedTo}</TableCell>
                                <TableCell>{lead.feedback}</TableCell>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default DeleteAttachments
