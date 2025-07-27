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
import { Check, Pencil, X } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiListAdvisorLogin } from '@/services/advisor.api'
import { getErrorMessage } from '@/lib/helpers/get-message'
import { Alert } from '@/components/ui/alert'
import { useAdvisor } from '@/lib/hooks/useAdvisor'




const ListAdvisorLogin = () => {
    const [advisorLogins, setAdvisorLogins] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ loginName: '', password: '' });



    const navigate = useNavigate();

    // query to  fetch list of employee login on component mount
    const {
        isError: isListAdvisorLoginError,
        error: listAdvisorLoginError,
        refetch
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListAdvisorLogin();
            console.log("📦 queryFn response of list advisor login:", res);
            setAdvisorLogins(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list advisor login api :", err);
        }
    });


    // When edit button is clicked
    const handleEdit = (index, emp) => {
        setEditingIndex(index);
        setEditForm({ loginName: emp.loginName, password: emp.password });
    };

    // when cancel button is clicked
    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({ loginName: '', password: '' });
    };



    // query to update advisor login credentials
    const { updateAdvisorCredentials } = useAdvisor();
    const { mutateAsync, isLoading, isError, error } = updateAdvisorCredentials;

    const handleUpdate = async (advisorId) => {
        try {
            const payload = {
                loginName: editForm.loginName,
                password: editForm.password,
                userId: advisorId
            };

            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res?.data?.message);
                await refetch(); // refresh list
                setEditingIndex(null);
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Update failed.");
        }
    };


    return (
        <div className="bg-white rounded shadow  p-3 w-full">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 border-black '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Advisors Login</h1>
            </div>

            {isListAdvisorLoginError && (
                <Alert variant="destructive">{getErrorMessage(listAdvisorLoginError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}

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
                                <TableCell>{emp?.referenceId?.name}</TableCell>
                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.loginName}
                                            onChange={(e) => setEditForm({ ...editForm, loginName: e.target.value })}
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        emp.loginName
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.password}
                                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        emp.password
                                    )}
                                </TableCell>

                                <TableCell className="flex gap-2">
                                    {editingIndex === index ? (
                                        <>
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleUpdate(emp?._id)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Update"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                disabled={isLoading}
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-800"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(index, emp)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Button */}
            <div className="mt-4">
                <Button
                    onClick={() => navigate("/admin/add_advisor_login")}
                    className="bg-blue-700 hover:bg-blue-800"
                >
                    Add Another Login
                </Button>
            </div>

        </div>
    )
}

export default ListAdvisorLogin
