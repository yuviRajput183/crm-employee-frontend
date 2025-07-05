import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const departments = [
    { id: 1, name: "Admin Department" },
    { id: 2, name: "Calling Department" },
    { id: 3, name: "Operations" },
    { id: 4, name: "Sales Department" },
];


const ListDepartment = () => {
    return (
        <div className=' bg-white rounded shadow p-3 '>
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Department</h1>
            </div>

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className=" bg-teal-900 text-white ">
                            <TableHead className="text-white">Department Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {departments.map((dept, index) => (
                            <TableRow key={dept.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{dept.name}</TableCell>
                                <TableCell>
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

                {/* Add Button */}
                <div className="mt-4 ">
                    <Button className="bg-blue-500 hover:bg-blue-800 text-white">
                        Add Another Department
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default ListDepartment
