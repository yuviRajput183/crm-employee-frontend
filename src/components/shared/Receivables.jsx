import React from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const receivables = [
    {
        leadNo: 622,
        loanType: "Car Loan",
        customer: "Tarun Kataria",
        advisor: "Manoj Kumar",
        paymentAgainst: "Receivable Amount",
        receivedDate: "11/06/2025",
        receivedAmt: 16229,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 622,
        loanType: "Car Loan",
        customer: "Tarun Kataria",
        advisor: "Manoj Kumar",
        paymentAgainst: "GST Amount",
        receivedDate: "11/06/2025",
        receivedAmt: 2981,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 618,
        loanType: "Car Loan",
        customer: "Sumit Rana",
        advisor: "Hitesh Grover",
        paymentAgainst: "Receivable Amount",
        receivedDate: "11/06/2025",
        receivedAmt: 15435,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 618,
        loanType: "Car Loan",
        customer: "Sumit Rana",
        advisor: "Hitesh Grover",
        paymentAgainst: "GST Amount",
        receivedDate: "11/06/2025",
        receivedAmt: 2835,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 607,
        loanType: "Home Loan",
        customer: "Gulshan",
        advisor: "Sunder Singh",
        paymentAgainst: "GST Amount",
        receivedDate: "18/06/2025",
        receivedAmt: 1507,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 607,
        loanType: "Home Loan",
        customer: "Gulshan",
        advisor: "Sunder Singh",
        paymentAgainst: "Receivable Amount",
        receivedDate: "07/06/2025",
        receivedAmt: 8203,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 606,
        loanType: "Home Loan",
        customer: "Anurag G",
        advisor: "Sunder Singh",
        paymentAgainst: "Receivable Amount",
        receivedDate: "12/06/2025",
        receivedAmt: 10143,
        refNo: "ICIN216318395640",
        remarks: "NEFT",
    },
    {
        leadNo: 606,
        loanType: "Home Loan",
        customer: "Anurag G",
        advisor: "Sunder Singh",
        paymentAgainst: "GST Amount",
        receivedDate: "18/06/2025",
        receivedAmt: 1863,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 605,
        loanType: "Home Loan",
        customer: "Aaditya V V",
        advisor: "Sunder Singh",
        paymentAgainst: "Receivable Amount",
        receivedDate: "20/06/2025",
        receivedAmt: 11378,
        refNo: "",
        remarks: "",
    },
    {
        leadNo: 602,
        loanType: "Home Loan",
        customer: "Amit S/O Ved Parkash",
        advisor: "Himanshu Sachdeva",
        paymentAgainst: "Receivable Amount",
        receivedDate: "26/03/2025",
        receivedAmt: 58500,
        refNo: "",
        remarks: "",
    },
];


const Receivables = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Receivable Payout</h1>
                </div>
                <div className=' flex items-center gap-2'>
                    <Button className=" bg-purple-950 px-10">Show Filter</Button>
                    <Button className=" bg-purple-950 px-10">Add +</Button>
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Loan Type</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Payment Against</TableHead>
                            <TableHead className="text-white">Received Date</TableHead>
                            <TableHead className="text-white">Received Amt.</TableHead>
                            <TableHead className="text-white">Ref. No</TableHead>
                            <TableHead className="text-white">Remarks</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                            <TableHead className="text-white">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receivables.map((item, index) => (
                            <TableRow key={`${item.leadNo}-${index}`} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{item.leadNo}</TableCell>
                                <TableCell>{item.loanType}</TableCell>
                                <TableCell>{item.customer}</TableCell>
                                <TableCell>{item.advisor}</TableCell>
                                <TableCell>{item.paymentAgainst}</TableCell>
                                <TableCell>{item.receivedDate}</TableCell>
                                <TableCell>{item.receivedAmt}</TableCell>
                                <TableCell>{item.refNo || "-"}</TableCell>
                                <TableCell>{item.remarks || "-"}</TableCell>
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

export default Receivables
