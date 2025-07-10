import React from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Monitor } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";


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

const leads = [
    {
        leadNo: 634, loanType: "Loan Against Property", advisor: "Himanshu Sachdeva", customer: "Ishwar Singh",
        disbursalAmt: "30,00,000", disbursalDate: "17/05/2025", payoutPct: "1.35", payoutAmt: "40500",
        tdsPct: "0", tdsAmt: "0", gst: "Applicable", invoiceDate: "12/06/2025", invoiceNo: "6/2025-26",
        gstPct: "18", gstAmt: "7290", payableAmt: "47790"
    },
    {
        leadNo: 633, loanType: "Loan Against Property", advisor: "Himanshu Sachdeva", customer: "Mukesh Kumar",
        disbursalAmt: "20,85,000", disbursalDate: "31/05/2025", payoutPct: "1.35", payoutAmt: "28148",
        tdsPct: "0", tdsAmt: "0", gst: "Applicable", invoiceDate: "12/06/2025", invoiceNo: "7/2025-26",
        gstPct: "18", gstAmt: "5067", payableAmt: "33215"
    },
    {
        leadNo: 632, loanType: "Home Loan", advisor: "Ravinder", customer: "Amar Tools Company",
        disbursalAmt: "53,33,900", disbursalDate: "28/02/2025", payoutPct: "1.08", payoutAmt: "57608",
        tdsPct: "2", tdsAmt: "1152", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "56454"
    },
    {
        leadNo: 631, loanType: "Car Loan", advisor: "Manoj Kumar", customer: "Tarun Kataria",
        disbursalAmt: "18,40,000", disbursalDate: "13/05/2025", payoutPct: "0.882", payoutAmt: "16229",
        tdsPct: "2", tdsAmt: "325", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "15904"
    },
    {
        leadNo: 630, loanType: "Car Loan", advisor: "Hitesh Grover", customer: "Sumit Rana",
        disbursalAmt: "17,50,000", disbursalDate: "14/05/2025", payoutPct: "0.7938", payoutAmt: "13892",
        tdsPct: "0", tdsAmt: "0", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "13892"
    },
    {
        leadNo: 629, loanType: "Home Loan", advisor: "Sunder Singh", customer: "Gulshan",
        disbursalAmt: "9,30,000", disbursalDate: "31/01/2025", payoutPct: "0.8", payoutAmt: "7440",
        tdsPct: "2", tdsAmt: "149", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "7291"
    },
    {
        leadNo: 628, loanType: "Home Loan", advisor: "Sunder Singh", customer: "Anurag G",
        disbursalAmt: "11,50,000", disbursalDate: "30/11/2024", payoutPct: "0.8", payoutAmt: "9200",
        tdsPct: "2", tdsAmt: "184", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "9016"
    },
    {
        leadNo: 627, loanType: "Home Loan", advisor: "Sunder Singh", customer: "Aaditya V V",
        disbursalAmt: "12,90,000", disbursalDate: "28/02/2025", payoutPct: "0.8", payoutAmt: "10320",
        tdsPct: "2", tdsAmt: "206", gst: "Not Applicable", invoiceDate: "", invoiceNo: "", gstPct: "0", gstAmt: "0", payableAmt: "10114"
    },
    {
        leadNo: 626, loanType: "Home Loan", advisor: "Himanshu Sachdeva", customer: "Dhiraj Chopra",
        disbursalAmt: "50,00,000", disbursalDate: "31/03/2025", payoutPct: "0.9", payoutAmt: "45000",
        tdsPct: "0", tdsAmt: "0", gst: "Applicable", invoiceDate: "30/05/2025", invoiceNo: "5/2025-26",
        gstPct: "18", gstAmt: "8100", payableAmt: "53100"
    },
    {
        leadNo: 625, loanType: "Home Loan", advisor: "Himanshu Sachdeva", customer: "Amit S/O Ved Parkash",
        disbursalAmt: "6,50,000", disbursalDate: "28/02/2025", payoutPct: "0.9", payoutAmt: "5850",
        tdsPct: "0", tdsAmt: "0", gst: "Applicable", invoiceDate: "20/03/2025", invoiceNo: "2/2024-25",
        gstPct: "18", gstAmt: "1053", payableAmt: "6903"
    },

    // Generating 20 more entries
    ...Array.from({ length: 20 }, (_, i) => {
        const baseLead = 624 - i;
        return {
            leadNo: baseLead,
            loanType: i % 3 === 0 ? "Car Loan" : i % 3 === 1 ? "Home Loan" : "Loan Against Property",
            advisor: ["Parul Gandhi", "Himanshu Sachdeva", "Sunder Singh", "Ravinder"][i % 4],
            customer: ["Ravi", "Anjali", "Dinesh", "Shalini", "Harsh", "Meena"][i % 6],
            disbursalAmt: `${(Math.floor(Math.random() * 30) + 10) * 100000}`,
            disbursalDate: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}/0${(i % 6) + 1}/2025`,
            payoutPct: "1.2",
            payoutAmt: `${(Math.floor(Math.random() * 10) + 5) * 1000}`,
            tdsPct: "2",
            tdsAmt: `${(Math.floor(Math.random() * 500))}`,
            gst: i % 2 === 0 ? "Applicable" : "Not Applicable",
            invoiceDate: i % 2 === 0 ? `0${(i % 6) + 1}/06/2025` : "",
            invoiceNo: i % 2 === 0 ? `${i + 1}/2025-26` : "",
            gstPct: i % 2 === 0 ? "18" : "0",
            gstAmt: i % 2 === 0 ? `${(Math.floor(Math.random() * 1000))}` : "0",
            payableAmt: `${(Math.floor(Math.random() * 10) + 5) * 1000}`,
        };
    }),
];



const AdvisorPayout = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Advisor Payout</h1>
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

            {/* Table */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Loan Type</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Disbursal Amt</TableHead>
                            <TableHead className="text-white">Disbursal Date</TableHead>
                            <TableHead className="text-white">Payout %</TableHead>
                            <TableHead className="text-white">Payout Amt</TableHead>
                            <TableHead className="text-white">TDS %</TableHead>
                            <TableHead className="text-white">TDS Amt</TableHead>
                            <TableHead className="text-white">GST</TableHead>
                            <TableHead className="text-white">Invoice Date</TableHead>
                            <TableHead className="text-white">Invoice No</TableHead>
                            <TableHead className="text-white">GST %</TableHead>
                            <TableHead className="text-white">GST Amt</TableHead>
                            <TableHead className="text-white">Payable Amt</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                            <TableHead className="text-white">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <TableRow key={lead.leadNo} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{lead.leadNo}</TableCell>
                                <TableCell>{lead.loanType}</TableCell>
                                <TableCell>{lead.advisor}</TableCell>
                                <TableCell>{lead.customer}</TableCell>
                                <TableCell>{lead.disbursalAmt}</TableCell>
                                <TableCell>{lead.disbursalDate}</TableCell>
                                <TableCell>{lead.payoutPct}</TableCell>
                                <TableCell>{lead.payoutAmt}</TableCell>
                                <TableCell>{lead.tdsPct}</TableCell>
                                <TableCell>{lead.tdsAmt}</TableCell>
                                <TableCell>{lead.gst}</TableCell>
                                <TableCell>{lead.invoiceDate}</TableCell>
                                <TableCell>{lead.invoiceNo}</TableCell>
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

export default AdvisorPayout
