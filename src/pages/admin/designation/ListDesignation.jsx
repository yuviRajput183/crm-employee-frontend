import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiListDepartment } from '@/services/department.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useNavigate } from 'react-router-dom';
import { useDepartment } from '@/lib/hooks/useDepartment';




const ListDesignation = () => {
    const [designations, setDesignations] = useState([]);
    const [editingRow, setEditingRow] = useState({ deptId: null, index: null });
    const [editForm, setEditForm] = useState({ designation: '', oldDesignation: '' });

    const navigate = useNavigate();

    // query to  fetch list of department and their designations on component mount
    const {
        isError: isListDepartmentError,
        error: listDepartmentError,
        refetch
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListDepartment();
            console.log("📦 queryFn response of list designation:", res);
            setDesignations(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list designation api :", err);
        }
    });


    console.log("designations>>", designations);

    const handleEdit = (deptId, desg, index) => {
        setEditingRow({ deptId, index });
        setEditForm({ designation: desg, oldDesignation: desg });
    };

    const handleCancel = () => {
        setEditingRow({ deptId: null, index: null });
        setEditForm({ designation: '', oldDesignation: '' });
    };


    const { updateDesignation } = useDepartment();
    const { mutateAsync, isLoading, isError, error } = updateDesignation;
    const handleUpdate = async () => {
        try {
            const payload = {
                departmentId: editingRow.deptId,
                oldDesignation: editForm.oldDesignation,
                newDesignation: editForm.designation,
            };

            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res.data.message);
                await refetch();
                handleCancel();
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert('Update failed');
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
                <h1 className=' text-2xl text-bold'>List Designation</h1>
            </div>

            {isListDepartmentError && (
                <Alert variant="destructive">{getErrorMessage(listDepartmentError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}


            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white">
                            <TableHead className="text-white">Department Name</TableHead>
                            <TableHead className="text-white">Designation Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {designations?.map((item) =>
                            item?.designations?.map((desg, index) => {
                                const isEditing = editingRow.deptId === item._id && editingRow.index === index;
                                return (
                                    <TableRow key={item._id + '-' + index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <input
                                                    value={editForm.designation}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, designation: e.target.value })
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                desg
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isEditing ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={handleUpdate}
                                                        disabled={isLoading}
                                                        className="text-green-600 hover:text-green-800"
                                                        variant="ghost"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        onClick={handleCancel}
                                                        className="text-red-600 hover:text-red-800"
                                                        variant="ghost"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => handleEdit(item._id, desg, index)}
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 ml-auto"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* Add Another Designation Button */}
                <div className="mt-4 ">
                    <Button
                        onClick={() => navigate("/admin/add_designation")}
                        className="bg-blue-500 hover:bg-blue-800 text-white"
                    >
                        Add Another Designation
                    </Button>
                </div>

            </div>

        </div>
    )
}

export default ListDesignation
