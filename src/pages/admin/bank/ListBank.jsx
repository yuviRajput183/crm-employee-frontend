import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { apiListBank } from '@/services/bank.api';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useBank } from '@/lib/hooks/useBank';




const ListBank = () => {
    const [bankList, setBankList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ name: '' });


    const navigate = useNavigate();


    const {
        isError: isListBankError,
        error: listBankError,
        refetch
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListBank();
            console.log("📦 queryFn response of list banks:", res);
            setBankList(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list banks api :", err);
        }
    });


    // 🛠️ useMutation hook for update
    const { updateBankName } = useBank();
    const { mutateAsync, isLoading, isError, error } = updateBankName;

    const handleEdit = (index, bank) => {
        setEditingIndex(index);
        setEditForm({ name: bank.name });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({ name: '' });
    };

    const handleUpdate = async (bankId) => {
        try {
            const payload = {
                bankId,
                name: editForm.name
            };
            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res?.data?.message);
                await refetch();
                setEditingIndex(null);
            }
        } catch (err) {
            console.error("Bank update failed", err);
            alert("Update failed.");
        }
    };

    return (
        <div className=' bg-white rounded shadow p-3'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Bank</h1>
            </div>

            {isListBankError && (
                <Alert variant="destructive">{getErrorMessage(listBankError)}</Alert>
            )}

            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table className=" md:w-[90%]">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Bank Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {bankList?.map((bank, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, name: e.target.value })
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        bank?.name
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {editingIndex === index ? (
                                        <div className='flex gap-2 justify-end'>
                                            <button
                                                onClick={() => handleUpdate(bank._id)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleEdit(index, bank)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Another Designation Button */}
                <div className="mt-4 ">
                    <Button
                        onClick={() => navigate("/admin/add_bank")}
                        className="bg-blue-500 hover:bg-blue-800 text-white"
                    >
                        Add Another Bank
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ListBank
