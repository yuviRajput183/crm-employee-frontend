import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiListBankers } from '@/services/banker.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';





const ListBankerDetails = () => {
    const [bankers, setBankers] = useState([]);
    const navigate = useNavigate();


    // query to  fetch all the bankers on component mount
    const {
        isError: isListBankersError,
        error: listBankersError,
    } = useQuery({
        queryKey: ['bankers'],
        queryFn: async () => {
            const res = await apiListBankers();
            console.log("📦 queryFn response of list bankers:", res);
            setBankers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list bankers:", err);
        }
    });

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

            {isListBankersError && (
                <Alert variant="destructive">{getErrorMessage(listBankersError)}</Alert>
            )}

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
                            <TableRow key={b?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{b.product}</TableCell>
                                <TableCell>{b?.city?.stateName}</TableCell>
                                <TableCell>{b?.city?.cityName}</TableCell>
                                <TableCell>{b?.bank?.name}</TableCell>
                                <TableCell>{b.bankerName}</TableCell>
                                <TableCell>{b.designation}</TableCell>
                                <TableCell>{b.mobile}</TableCell>
                                <TableCell>{b.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => navigate("/admin/add_banker_details", { state: { banker: b } })}
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
                <Button
                    onClick={() => navigate("/admin/add_banker_details")}
                    className=" bg-blue-500 hover:bg-blue-500">Add Another Banker Details</Button>
            </div>
        </div>
    )
}

export default ListBankerDetails
