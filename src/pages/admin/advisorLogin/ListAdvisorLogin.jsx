import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pencil } from "lucide-react"
import { Button } from '@/components/ui/button'

const advisorLogins = [
    { name: "anoop", login: "8086086576", password: "1qazxsw2!@QW" },
    { name: "Basanta Kumar Khara", login: "8018819915", password: "Basanta@123" },
    { name: "BUSINESS STANDARD LOAN FINANCIAL SERVICES LTD", login: "7020531287", password: "Sushant@123" },
    { name: "DHAMELIYA AKASH DIPAKBHAI", login: "9898360245", password: "Vyom##27" },
    { name: "finsway", login: "8949529715", password: "Prat@1234" },
    { name: "Himanshu Sachdeva", login: "himanshu", password: "himanshu" },
    { name: "Pardeep Kumar", login: "pardeep", password: "123" },
    { name: "Parul Gandhi", login: "parul", password: "parul" },
    { name: "Parul Gandhi", login: "ls", password: "123" },
    { name: "Rahul R", login: "9372031154", password: "Imwhatim@12" },
    { name: "Raushan Kumar Tiwari", login: "6299926797", password: "Neoloans@123" },
    { name: "Ritik", login: "9755566192", password: "Ritik@143" },
    { name: "Rohit Aggarwal", login: "nishu", password: "nishu" },
    { name: "Sahil Grover", login: "9052962000", password: "sahil1234" },
    { name: "Shallu Kukreja", login: "shallu", password: "shallu" },
    { name: "Guru Kumar", login: "Guru@01.02", password: "Guru@01.02" },
]


const ListAdvisorLogin = () => {
    return (
        <div className="bg-white rounded shadow  p-3 w-full">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 border-black '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Employees</h1>
            </div>


            <div className="overflow-x-auto mt-3">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-teal-800 text-white">
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Login Name</TableHead>
                            <TableHead className="text-white">Login Password</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {advisorLogins.map((emp, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
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

export default ListAdvisorLogin
