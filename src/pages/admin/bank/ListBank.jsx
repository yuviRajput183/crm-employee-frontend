import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const bankList = [
    "Aadhar Housing", "Aavas Financiers Ltd", "Aditya Birla Ltd", "Axis Bank Ltd",
    "Bajaj Finserv Ltd", "Canara Bank", "Care Health Insurance", "DCB Ltd", "Equitas",
    "Fullerton India Credit Company Ltd", "HDFC Bank Ltd", "HDFC Ergo", "HDFC SALES LTD",
    "Hero Housing", "Hinduja Housing Finance Ltd", "ICICI Bank Ltd"
];


const ListBank = () => {
    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Bank</h1>
            </div>

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table className=" md:w-[90%]">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Bank Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {bankList.map((bank, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{bank}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Another Designation Button */}
                <div className="mt-4 ">
                    <Button className="bg-blue-500 hover:bg-blue-800 text-white">
                        Add Another Bank
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ListBank
