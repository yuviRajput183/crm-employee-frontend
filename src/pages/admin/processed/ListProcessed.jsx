import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const processedByList = [
    { id: 1, name: "Andromeda" },
    { id: 2, name: "Gagandeep" },
    { id: 3, name: "Jagbir Malik" },
    { id: 4, name: "JB Financial Services" },
    { id: 5, name: "Juhi" },
    { id: 6, name: "Loan Sahayak" },
    { id: 7, name: "Mohit Kundu" },
    { id: 8, name: "Pardeep Kumar" },
    { id: 9, name: "Parul Gandhi" },
    { id: 10, name: "RKPL" },
    { id: 11, name: "Sazal Jain" },
    { id: 12, name: "Sonu Soni" },
    { id: 13, name: "Sunita Rani" },
    { id: 14, name: "Veena Rani" },
];


const ListProcessed = () => {
    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Processed By</h1>
            </div>


            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table className=" md:w-[95%]">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Processed By Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {processedByList.map((item, index) => (
                            <TableRow key={item.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 ml-auto"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Another Button */}
                <div className="mt-4">
                    <Button className="bg-blue-500 hover:bg-blue-800 text-white">
                        ADD ANOTHER PROCESSED BY
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ListProcessed
