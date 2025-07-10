import React from 'react'
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

const leads = [
    { leadNo: 645, productType: "Insurance - Group Insurance", amount: "60000", customer: "Gourav", mobile: "9999999999", leadDate: "01/07/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 644, productType: "Loan Against Property", amount: "2000000", customer: "Gourav", mobile: "9996452441", leadDate: "01/07/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 643, productType: "Insurance - Group Insurance", amount: "63000", customer: "Rajesh Kumar", mobile: "9466736194", leadDate: "30/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 642, productType: "Loan Against Property", amount: "4500000", customer: "Priyanka Bansal", mobile: "9999999999", leadDate: "30/06/2025", advisor: "CA Davinder Sharma", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 641, productType: "Home Loan", amount: "2500000", customer: "Naveen (Lucky)", mobile: "9215200475", leadDate: "28/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 640, productType: "Home Loan", amount: "5000000", customer: "Raj Goyal", mobile: "9992816658", leadDate: "27/06/2025", advisor: "Sonu Kumar", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 639, productType: "Insurance - Group Insurance", amount: "100000", customer: "Ram Pal", mobile: "8295777487", leadDate: "24/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 638, productType: "Loan Against Property", amount: "3000000", customer: "Ishwar Singh", mobile: "9999999999", leadDate: "23/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 637, productType: "Loan Against Property", amount: "2085000", customer: "Mukesh Kumar", mobile: "7015727926", leadDate: "23/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 636, productType: "Insurance - Group Insurance", amount: "75000", customer: "Seema Sharma", mobile: "9988776655", leadDate: "22/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 635, productType: "Home Loan", amount: "4200000", customer: "Arun Jain", mobile: "9444011223", leadDate: "21/06/2025", advisor: "Sonu Kumar", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 634, productType: "Insurance - Group Insurance", amount: "50000", customer: "Poonam", mobile: "9988665544", leadDate: "21/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 633, productType: "Loan Against Property", amount: "1200000", customer: "Bhavesh Bhatia", mobile: "7896543210", leadDate: "20/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 632, productType: "Home Loan", amount: "3500000", customer: "Deepak Rana", mobile: "9812312312", leadDate: "20/06/2025", advisor: "CA Davinder Sharma", allocatedTo: "Juhi", feedback: "Loan Rejected" },
    { leadNo: 631, productType: "Loan Against Property", amount: "950000", customer: "Anjali Sharma", mobile: "9001234567", leadDate: "19/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 630, productType: "Insurance - Group Insurance", amount: "80000", customer: "Ravi Mehta", mobile: "9123456789", leadDate: "18/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 629, productType: "Home Loan", amount: "7600000", customer: "Neha Goyal", mobile: "9112233445", leadDate: "17/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 628, productType: "Loan Against Property", amount: "5400000", customer: "Ajay Kumar", mobile: "9876543211", leadDate: "15/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 627, productType: "Insurance - Group Insurance", amount: "67000", customer: "Rakesh Singh", mobile: "8899001122", leadDate: "14/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 626, productType: "Home Loan", amount: "4200000", customer: "Kiran", mobile: "9123456789", leadDate: "13/06/2025", advisor: "CA Davinder Sharma", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 625, productType: "Loan Against Property", amount: "2000000", customer: "Sahil Jain", mobile: "9988771122", leadDate: "12/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 624, productType: "Insurance - Group Insurance", amount: "90000", customer: "Swati Arora", mobile: "9876543001", leadDate: "11/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 623, productType: "Home Loan", amount: "8000000", customer: "Ravi Prakash", mobile: "9555123456", leadDate: "10/06/2025", advisor: "Sonu Kumar", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 622, productType: "Loan Against Property", amount: "3700000", customer: "Mansi Kapoor", mobile: "9448844555", leadDate: "09/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 621, productType: "Insurance - Group Insurance", amount: "95000", customer: "Amit Thakur", mobile: "9333345678", leadDate: "08/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 620, productType: "Home Loan", amount: "2100000", customer: "Isha Mehta", mobile: "9123478910", leadDate: "07/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Rejected" },
    { leadNo: 619, productType: "Loan Against Property", amount: "3600000", customer: "Shreya Kapoor", mobile: "9900876543", leadDate: "06/06/2025", advisor: "Himanshu Sachdeva", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 618, productType: "Insurance - Group Insurance", amount: "45000", customer: "Rohit Shetty", mobile: "9874512369", leadDate: "05/06/2025", advisor: "Parul Gandhi", allocatedTo: "Juhi", feedback: "Policy Issued" },
    { leadNo: 617, productType: "Home Loan", amount: "5600000", customer: "Shruti Sinha", mobile: "9999080808", leadDate: "04/06/2025", advisor: "CA Davinder Sharma", allocatedTo: "Juhi", feedback: "Loan Disbursed" },
    { leadNo: 616, productType: "Loan Against Property", amount: "3800000", customer: "Anshul Rawat", mobile: "9211112345", leadDate: "03/06/2025", advisor: "Parul Gandhi", allocatedTo: "Pankaj", feedback: "Loan Rejected" }
];

const leadStatusData = [
    { label: "Total Leads", count: 613, percent: 100, colorKey: "total" },
    { label: "Disbursed", count: 261, percent: 43, colorKey: "disbursed" },
    { label: "Policy Issued", count: 86, percent: 14, colorKey: "policy" },
    { label: "Invoice Raised", count: 8, percent: 1, colorKey: "invoice" },
    { label: "Rejected", count: 256, percent: 42, colorKey: "rejected" },
];

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


const MyLead = () => {
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
                <Button className=" bg-purple-950 px-10">Show Filter</Button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4 shadow mt-4 border border-gray-100 rounded-md ">
                {leadStatusData.map((item, index) => (
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
                ))}
            </div>

            {/* table */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] pverflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
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
                                <TableCell>{lead.amount}</TableCell>
                                <TableCell>{lead.customer}</TableCell>
                                <TableCell>{lead.mobile}</TableCell>
                                <TableCell>{lead.leadDate}</TableCell>
                                <TableCell>{lead.advisor}</TableCell>
                                <TableCell>{lead.allocatedTo}</TableCell>
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
