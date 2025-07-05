import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

const bankers = [
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Axis Bank Ltd",
        name: "Mukesh Mittal",
        designation: "ASM",
        mobile: "9999999999",
        email: "a@a.com",
    },
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Bajaj Finserv Ltd",
        name: "Om Parkash",
        designation: "SM",
        mobile: "9416447862",
        email: "om.parkash@bajajfinserv.in",
    },
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Fullerton India Credit Company Ltd",
        name: "Sparsh Gupta",
        designation: "ASM",
        mobile: "9896278123",
        email: "sparsh.1@fullertonindia.com",
    },
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Axis Bank Ltd",
        name: "Mukesh Mittal",
        designation: "ASM",
        mobile: "9999999999",
        email: "a@a.com",
    },
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Bajaj Finserv Ltd",
        name: "Om Parkash",
        designation: "SM",
        mobile: "9416447862",
        email: "om.parkash@bajajfinserv.in",
    },
    {
        product: "Business Loan",
        state: "Haryana",
        city: "Hissar",
        bank: "Fullerton India Credit Company Ltd",
        name: "Sparsh Gupta",
        designation: "ASM",
        mobile: "9896278123",
        email: "sparsh.1@fullertonindia.com",
    },

    // Add more dummy objects here as needed...
];



const ListBankerDetails = () => {
    return (
        <div className=' bg-white rounded shadow p-3 w-full'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Banker Details</h1>
            </div>

            <div className=" overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full ">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Product</TableHead>
                            <TableHead className="text-white">State</TableHead>
                            <TableHead className="text-white">City</TableHead>
                            <TableHead className="text-white">Bank</TableHead>
                            <TableHead className="text-white">Banker Name</TableHead>
                            <TableHead className="text-white">Designation</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Email Id</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {bankers.map((b, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{b.product}</TableCell>
                                <TableCell>{b.state}</TableCell>
                                <TableCell>{b.city}</TableCell>
                                <TableCell>{b.bank}</TableCell>
                                <TableCell>{b.name}</TableCell>
                                <TableCell>{b.designation}</TableCell>
                                <TableCell>{b.mobile}</TableCell>
                                <TableCell>{b.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Button */}
            <div className="mt-4">
                <Button className=" bg-blue-500 hover:bg-blue-500">Add Another Banker Details</Button>
            </div>
        </div>
    )
}

export default ListBankerDetails
