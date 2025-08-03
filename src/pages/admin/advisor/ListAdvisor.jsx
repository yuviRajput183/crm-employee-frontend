import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { apiListAdvisor } from '@/services/advisor.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { Alert } from '@/components/ui/alert'
import { useNavigate } from 'react-router-dom'



const ListAdvisor = () => {

    const [advisors, setAdvisors] = useState([]);
    const navigate = useNavigate();

    // query to  fetch all the advisor on component mount
    const {
        isError: isListAdvisorError,
        error: listAdvisorError,
    } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisor:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisords:", err);
        }
    });




    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Advisor</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit mt-2 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p>

            {isListAdvisorError && (
                <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
            )}

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full">
                <Table className=" w-[98%] mx-auto">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Advisor Code</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Email Id</TableHead>
                            <TableHead className="text-white">Active</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {advisors?.map((advisor, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{advisor.advisorCode}</TableCell>
                                <TableCell>{advisor.name}</TableCell>
                                <TableCell>{advisor.mobile}</TableCell>
                                <TableCell>{advisor.email}</TableCell>
                                <TableCell>{advisor.isActive ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => navigate(`/admin/edit_loan_advisor/${advisor?._id}`)}
                                        variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
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
                <Button onClick={() => navigate("/admin/add_loan_advisor")} className=" bg-blue-500 hover:bg-blue-500">Add Another Advisor</Button>
            </div>

        </div>
    )
}

export default ListAdvisor
