import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const employeeLogins = [
    { name: "Admin", login: "admin", password: "hello12" },
    { name: "Juhi Gandhi", login: "9992792999", password: "hello12" },
    { name: "Pankaj", login: "pankaj", password: "Pankaj@5964" },
    { name: "test", login: "test", password: "test" },
    { name: "Juhi", login: "juhi", password: "juhi12" },
    { name: "Cancelled", login: "juhigi", password: "hello12" },
    { name: "Ankit", login: "ankit", password: "ankit" },
    { name: "Yuvraj", login: "yuvraj", password: "yuvraj" },
    { name: "Yuvraj", login: "yuvi", password: "yuvraj" },
];


const ListEmployeeLogin = () => {
    return (
        <div className="bg-white rounded shadow  p-3 w-full">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Employees</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit mt-2 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p>


            {/* Table */}
            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className=" bg-teal-800 text-white">
                            <TableHead className="text-white">Employee Name</TableHead>
                            <TableHead className="text-white">Login Name</TableHead>
                            <TableHead className="text-white">Login Password</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeLogins.map((emp, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.login}</TableCell>
                                <TableCell>{emp.password}</TableCell>
                                <TableCell>
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <Pencil size={16} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Button */}
            <div className="mt-4">
                <Button className="bg-blue-700 hover:bg-blue-800">Add Another Login</Button>
            </div>
        </div>
    )
}

export default ListEmployeeLogin
