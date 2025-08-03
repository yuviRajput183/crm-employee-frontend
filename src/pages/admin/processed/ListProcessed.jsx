import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiListProcessed } from '@/services/processed.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useProcessedBy } from '@/lib/hooks/useProcessedBy';




const ListProcessed = () => {
    const [processedByList, setProcessedByList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ processedBy: '' });

    const navigate = useNavigate();

    const {
        isError: isListProcessedError,
        error: listProcessedError,
        refetch
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListProcessed();
            console.log("📦 queryFn response of list processed:", res);
            setProcessedByList(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list processed api :", err);
        }
    });


    const { updateProcessedBy } = useProcessedBy();
    const { mutateAsync, isLoading, isError, error } = updateProcessedBy;


    const handleEdit = (index, item) => {
        setEditingIndex(index);
        setEditForm({ processedBy: item.processedBy });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({ processedBy: '' });
    };

    const handleUpdate = async (processedById) => {
        try {
            const payload = {
                processedBy: editForm.processedBy,
                processedById,
            };

            console.log("Updating ProcessedBy:", payload);

            const res = await mutateAsync(payload);

            if (res?.data?.success) {
                alert(res?.data?.message || "Updated successfully!");
                await refetch();
                setEditingIndex(null);
            }
        } catch (err) {
            console.error("Update error:", err);
            alert('Update failed.');
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
                <h1 className=' text-2xl text-bold'>List Processed By</h1>
            </div>

            {isListProcessedError && (
                <Alert variant="destructive">{getErrorMessage(listProcessedError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}


            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table className=" md:w-[95%]">
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Processed By Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {processedByList.map((item, index) => (
                            <TableRow key={item._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.processedBy}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, processedBy: e.target.value })
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        item.processedBy
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {editingIndex === index ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdate(item._id)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Update"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-800"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 ml-auto"
                                            onClick={() => handleEdit(index, item)}
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Another Button */}
                <div className="mt-4">
                    <Button
                        onClick={() => navigate("/admin/add_processed_by")}
                        className="bg-blue-500 hover:bg-blue-800 text-white">
                        ADD ANOTHER PROCESSED BY
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ListProcessed
