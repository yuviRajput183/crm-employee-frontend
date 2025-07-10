import React from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Monitor } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';


const leads = [
    {
        leadNo: 634,
        loanType: "Loan Against Property",
        customer: "Ishwar Singh",
        advisor: "Himanshu Sachdeva",
        invoiceDate: "12/06/2025",
        disbursalDate: "17/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 3000000,
        payoutPct: 1.35,
        payoutAmt: 40500,
        tdsPct: 0,
        tdsAmt: 0,
        gst: 18,
        gstAmt: 7290,
        gstPct: 18,
        payableAmt: 47790,
    },
    {
        leadNo: 633,
        loanType: "Loan Against Property",
        customer: "Mukesh Kumar",
        advisor: "Himanshu Sachdeva",
        invoiceDate: "12/06/2025",
        disbursalDate: "15/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 2058000,
        payoutPct: 1.35,
        payoutAmt: 28148,
        tdsPct: 0,
        tdsAmt: 0,
        gst: 18,
        gstAmt: 5067,
        gstPct: 18,
        payableAmt: 33215,
    },
    {
        leadNo: 632,
        loanType: "Loan Against Property",
        customer: "Amar Tools Company",
        advisor: "Ravinder",
        invoiceDate: "23/06/2025",
        disbursalDate: "20/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 5333900,
        payoutPct: 1.21499,
        payoutAmt: 64806,
        tdsPct: 2,
        tdsAmt: 1296,
        gst: 18,
        gstAmt: 11665,
        gstPct: 18,
        payableAmt: 75175,
    },
    {
        leadNo: 622,
        loanType: "Car Loan",
        customer: "Tarun Kataria",
        advisor: "Manoj Kumar",
        invoiceDate: "11/06/2025",
        disbursalDate: "10/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 1840000,
        payoutPct: 0.9,
        payoutAmt: 16560,
        tdsPct: 2,
        tdsAmt: 331,
        gst: 18,
        gstAmt: 2981,
        gstPct: 18,
        payableAmt: 19210,
    },
    {
        leadNo: 619,
        loanType: "Loan Against Property",
        customer: "Naman/Akil",
        advisor: "Sachin Soni",
        invoiceDate: "02/07/2025",
        disbursalDate: "14/06/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 1417907,
        payoutPct: 1.35,
        payoutAmt: 19131,
        tdsPct: 2,
        tdsAmt: 383,
        gst: 18,
        gstAmt: 3444,
        gstPct: 18,
        payableAmt: 22192,
    },
    {
        leadNo: 618,
        loanType: "Car Loan",
        customer: "Sumit Rana",
        advisor: "Hitesh Grover",
        invoiceDate: "11/06/2025",
        disbursalDate: "14/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 1750000,
        payoutPct: 0.9,
        payoutAmt: 15750,
        tdsPct: 2,
        tdsAmt: 315,
        gst: 18,
        gstAmt: 2835,
        gstPct: 18,
        payableAmt: 18270,
    },
    {
        leadNo: 607,
        loanType: "Home Loan",
        customer: "Gulshan",
        advisor: "Sunder Singh",
        invoiceDate: "31/05/2025",
        disbursalDate: "30/05/2025",
        invoiceNo: "LS/2025-26",
        disbursalAmt: 930000,
        payoutPct: 0.9,
        payoutAmt: 8370,
        tdsPct: 2,
        tdsAmt: 167,
        gst: 18,
        gstAmt: 1507,
        gstPct: 18,
        payableAmt: 9710,
    },
    // Add more objects similarly...
];


const payoutData = [
    {
        label: "Gross Amount",
        value: "39,13,093",
        color: "bg-red-500",
        iconColor: "text-red-500"
    },
    {
        label: "Total Payout",
        value: "38,40,072",
        color: "bg-blue-500",
        iconColor: "text-blue-500",
    },
    {
        label: "TDS Amount",
        value: "38,186",
        color: "bg-teal-400",
        iconColor: "text-teal-400"
    },
    {
        label: "GST Amount",
        value: "73,021",
        color: "bg-amber-400",
        iconColor: "text-amber-400"
    },
];


const Invoices = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Invoices</h1>
                </div>
                <div className=' flex items-center gap-2'>
                    <Button className=" bg-purple-950 px-10">Show Filter</Button>
                    <Button className=" bg-purple-950 px-10">Add +</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
                {payoutData.map((item, index) => (
                    <div
                        key={index}
                        className={` cursor-pointer text-white p-5 rounded-md shadow-md flex items-center justify-between ${item.color} opacity-`}
                    >
                        <div>
                            <h2 className="text-md font-semibold">{item.label}</h2>
                            <p className="text-xl font-bold mt-1">{item.value}</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded shadow-md">
                            <Monitor className={`w-5 h-5 ${item.iconColor}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Loan Type</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Invoice Date</TableHead>
                            <TableHead className="text-white">Disbursal Date</TableHead>
                            <TableHead className="text-white">Invoice No</TableHead>
                            <TableHead className="text-white">Disbursal Amt</TableHead>
                            <TableHead className="text-white">Payout %</TableHead>
                            <TableHead className="text-white">Payout Amt</TableHead>
                            <TableHead className="text-white">TDS %</TableHead>
                            <TableHead className="text-white">TDS Amt</TableHead>
                            <TableHead className="text-white">GST %</TableHead>
                            <TableHead className="text-white">GST Amt</TableHead>
                            <TableHead className="text-white">Receivable Amt</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                            <TableHead className="text-white">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <TableRow key={lead.leadNo} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{lead.leadNo}</TableCell>
                                <TableCell>{lead.loanType}</TableCell>
                                <TableCell>{lead.customer}</TableCell>
                                <TableCell>{lead.advisor}</TableCell>
                                <TableCell>{lead.invoiceDate}</TableCell>
                                <TableCell>{lead.disbursalDate}</TableCell>
                                <TableCell>{lead.invoiceNo}</TableCell>
                                <TableCell>{lead.disbursalAmt.toLocaleString()}</TableCell>
                                <TableCell>{lead.payoutPct}</TableCell>
                                <TableCell>{lead.payoutAmt}</TableCell>
                                <TableCell>{lead.tdsPct}</TableCell>
                                <TableCell>{lead.tdsAmt}</TableCell>
                                <TableCell>{lead.gstPct}</TableCell>
                                <TableCell>{lead.gstAmt}</TableCell>
                                <TableCell>{lead.payableAmt}</TableCell>
                                <TableCell>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs">Edit</Button>
                                </TableCell>
                                <TableCell>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Invoices
