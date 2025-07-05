import React from 'react';
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

// Dummy Employee List
const employees = [
    {
        name: 'Admin',
        department: 'Admin Department',
        designation: 'administrator',
        mobile: '9052963000',
        email: 'contact@loansahayak.com',
        active: 'Yes',
    },
    {
        name: 'Ankit',
        department: 'Calling Department',
        designation: 'Calling Executive',
        mobile: '9812364628',
        email: '',
        active: 'No',
    },
    {
        name: 'Cancelled',
        department: 'Admin Department',
        designation: 'administrator',
        mobile: '9992792999',
        email: '',
        active: 'No',
    },
    {
        name: 'Juhi',
        department: 'Sales Department',
        designation: 'Sales Executive',
        mobile: '9813877339',
        email: 'parul150115@gmail.com',
        active: 'Yes',
    },
    {
        name: 'Juhi Gandhi',
        department: 'Admin Department',
        designation: 'administrator',
        mobile: '8099600000',
        email: '',
        active: 'Yes',
    },
    {
        name: 'Pankaj',
        department: 'Operations',
        designation: 'Operational Manager',
        mobile: '9052962000',
        email: 'pankajunwanted@gmail.com',
        active: 'Yes',
    },
    {
        name: 'Rohit',
        department: 'Sales Department',
        designation: 'Sales Executive',
        mobile: '7854884525',
        email: '',
        active: 'No',
    },
    {
        name: 'test',
        department: 'Sales Department',
        designation: 'Sales Manager',
        mobile: '9999999999',
        email: '',
        active: 'No',
    },
    {
        name: 'Yuvraj',
        department: 'Admin Department',
        designation: 'administrator',
        mobile: '9350435963',
        email: '',
        active: 'No',
    },
    {
        name: 'Yuvraj',
        department: 'Calling Department',
        designation: 'Calling Executive',
        mobile: '9876543210',
        email: '',
        active: 'Yes',
    },
];
const ListEmployee = () => {
    return (
        <div className=' bg-white rounded shadow  py-3 w-full'>
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


            {/* Scrollable wrapper - does NOT push layout */}
            <div className=" overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 ">
                <Table className="">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Employee Name</TableHead>
                            <TableHead className="text-white">Department</TableHead>
                            <TableHead className="text-white">Designation</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Email Id</TableHead>
                            <TableHead className="text-white">Active</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((emp, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.designation}</TableCell>
                                <TableCell>{emp.mobile}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.active}</TableCell>
                                <TableCell>
                                    <Button variant="default" size="sm" className="bg-blue-500">
                                        Edit Employee
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Button */}
            <div className="mt-4">
                <Button className=" bg-blue-500 hover:bg-blue-500">Add Another Employee</Button>
            </div>

        </div>
    )
}

export default ListEmployee;
