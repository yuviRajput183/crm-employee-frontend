import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const designations = [
    { id: 1, department: "Admin Department", designation: "administrator" },
    { id: 2, department: "Admin Department", designation: "Partner" },
    { id: 3, department: "Calling Department", designation: "Calling Executive" },
    { id: 4, department: "Operations", designation: "Operational Manager" },
    { id: 5, department: "Sales Department", designation: "Area Sales Head" },
    { id: 6, department: "Sales Department", designation: "Sales Executive" },
    { id: 7, department: "Sales Department", designation: "Sales Manager" },
];


const ListDesignation = () => {
    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Designation</h1>
            </div>

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Department Name</TableHead>
                            <TableHead className="text-white">Designation Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {designations.map((item, index) => (
                            <TableRow key={item.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{item.department}</TableCell>
                                <TableCell>{item.designation}</TableCell>
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

                {/* Add Another Designation Button */}
                <div className="mt-4 ">
                    <Button className="bg-blue-500 hover:bg-blue-800 text-white">
                        Add Another Designation
                    </Button>
                </div>

            </div>

        </div>
    )
}

export default ListDesignation
