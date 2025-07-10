import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";


const performanceData = [
    {
        leadNo: 0,
        loanType: "Total",
        customerName: "",
        bankName: "",
        disbursalAmt: 0,
        disbursalDate: "",
        month: "",
    },
];


const MyPerformance = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={barchart} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>My Performance</h1>
                </div>
                <Button className=" bg-purple-950 px-10">Show Filter</Button>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Loan Type</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Bank Name</TableHead>
                            <TableHead className="text-white">Disbursal Amt.</TableHead>
                            <TableHead className="text-white">Disbursal Date</TableHead>
                            <TableHead className="text-white">Month</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {performanceData.map((row, index) => (
                            <TableRow
                                key={index}
                                className="bg-orange-400 text-black font-medium"
                            >
                                <TableCell>{row.leadNo}</TableCell>
                                <TableCell>{row.loanType}</TableCell>
                                <TableCell>{row.customerName || "-"}</TableCell>
                                <TableCell>{row.bankName || "-"}</TableCell>
                                <TableCell>{row.disbursalAmt}</TableCell>
                                <TableCell>{row.disbursalDate || "-"}</TableCell>
                                <TableCell>{row.month || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default MyPerformance
