import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

// Dummy city data
const cities = [
    { id: 1, state: "Andhra Pradesh", city: "Adilabad" },
    { id: 2, state: "Andhra Pradesh", city: "Amala Puram" },
    { id: 3, state: "Andhra Pradesh", city: "Anantpur" },
    { id: 4, state: "Andhra Pradesh", city: "Bhimavaram" },
    { id: 5, state: "Andhra Pradesh", city: "Chirala" },
    // Add more data as needed...
];



const ListCity = () => {
    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Cities</h1>
            </div>

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">State Name</TableHead>
                            <TableHead className="text-white">City Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {cities.map((item, index) => (
                            <TableRow key={item.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{item.state}</TableCell>
                                <TableCell>{item.city}</TableCell>
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

                {/* Add Another City Button */}
                <div className="mt-4">
                    <Button className="bg-blue-500 hover:bg-blue-800 text-white">
                        Add Another City
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default ListCity
