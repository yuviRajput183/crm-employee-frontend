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
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

const advisors = [
    {
        advisorCode: "DSA154",
        advisorName: "UV",
        mobile: "9350435960",
        email: "thunderyuvi911@gmail.com",
        active: "No",
    },
    {
        advisorCode: "DSA153",
        advisorName: "Yuvi",
        mobile: "9876543201",
        email: "thunderyuvi911@gmail.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA152",
        advisorName: "Yuvraj",
        mobile: "9801234567",
        email: "yuvraj091102@gmail.com",
        active: "No",
    },
    {
        advisorCode: "DSA151",
        advisorName: "Yuvi",
        mobile: "9876543210",
        email: "thunderyuvi911@gmail.com",
        active: "No",
    },
    {
        advisorCode: "DSA150",
        advisorName: "CA Davinder Sharma",
        mobile: "9814114154",
        email: "navitas@yahoo.co.in",
        active: "Yes",
    },
    {
        advisorCode: "DSA149",
        advisorName: "Geetansh Bhutani",
        mobile: "7400070010",
        email: "hello@loanbandhu.in",
        active: "Yes",
    },
    {
        advisorCode: "DSA148",
        advisorName: "Yuvraj",
        mobile: "9350435963",
        email: "thunderyuvi911@gmail.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA147",
        advisorName: "Rubal Shridhar",
        mobile: "9728977111",
        email: "rubalshridhar@gmail.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA146",
        advisorName: "Shivam",
        mobile: "9999999998",
        email: "a@a.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA145",
        advisorName: "Manoj Kumar",
        mobile: "8059136024",
        email: "A@A.COM",
        active: "Yes",
    },
    {
        advisorCode: "DSA144",
        advisorName: "Raushan Kumar Tiwari",
        mobile: "6299926797",
        email: "info@neoloansfin.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA144",
        advisorName: "Raushan Kumar Tiwari",
        mobile: "6299926797",
        email: "info@neoloansfin.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA144",
        advisorName: "Raushan Kumar Tiwari",
        mobile: "6299926797",
        email: "info@neoloansfin.com",
        active: "Yes",
    },
    {
        advisorCode: "DSA144",
        advisorName: "Raushan Kumar Tiwari",
        mobile: "6299926797",
        email: "info@neoloansfin.com",
        active: "Yes",
    }

]


const ListAdvisor = () => {
    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Employees</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit mt-2 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p>

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full">
                <Table className=" w-[98%] mx-auto">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Advisor Code</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Email Id</TableHead>
                            <TableHead className="text-white">Active</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {advisors.map((advisor, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{advisor.advisorCode}</TableCell>
                                <TableCell>{advisor.advisorName}</TableCell>
                                <TableCell>{advisor.mobile}</TableCell>
                                <TableCell>{advisor.email}</TableCell>
                                <TableCell>{advisor.active}</TableCell>
                                <TableCell>
                                    <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                                        <Pencil size={14} />
                                        Edit Advisor
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

export default ListAdvisor
