import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { apiListEmployee } from '@/services/employee.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useNavigate } from 'react-router-dom';




const ListEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();


    // query to  fetch all the employees on component mount
    const {
        isError: isListEmployeesError,
        error: listEmployeesError,
    } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await apiListEmployee();
            console.log("📦 queryFn response of list employee:", res);
            setEmployees(res?.data?.data?.employees || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching departments:", err);
        }
    });


    return (
        <div className=' bg-white rounded shadow  py-3 w-full'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 px-2'>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Employees</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit mt-2 border-b-2 text-[15px] mr-2'>Users Licenses : 5 of 5 Used</p>

            {isListEmployeesError && (
                <Alert variant="destructive">{getErrorMessage(listEmployeesError)}</Alert>
            )}

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
                        {employees?.map((emp, index) => (
                            <TableRow key={emp?._id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <TableCell>{emp?.name}</TableCell>
                                <TableCell>{emp?.department?.name}</TableCell>
                                <TableCell>{emp?.designation}</TableCell>
                                <TableCell>{emp?.mobile}</TableCell>
                                <TableCell>{emp?.email}</TableCell>
                                <TableCell>{emp?.isActive ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="default" size="sm" className="bg-blue-500"
                                        onClick={() => navigate("/admin/add_employee", { state: { employee: emp } })}
                                    >
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
                <Button
                    onClick={() => navigate("/admin/add_employee")}
                    className=" bg-blue-500 hover:bg-blue-500"
                >
                    Add Another Employee
                </Button>
            </div>

        </div>
    )
}

export default ListEmployee;
