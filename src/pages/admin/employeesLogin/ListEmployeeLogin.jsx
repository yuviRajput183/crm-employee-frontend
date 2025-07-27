import React, { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
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
import { apiListEmployeeLogin } from '@/services/employee.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '@/lib/hooks/useEmployee';
import { Alert } from '@/components/ui/alert';



const ListEmployeeLogin = () => {

    const [employeeLogins, setEmployeeLogins] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); // track which row is being edited
    const [editForm, setEditForm] = useState({ loginName: '', password: '' });

    const navigate = useNavigate();


    // query to  fetch list of employee login on component mount
    const {
        isError: isListEmployeesLoginError,
        error: listEmployeesLoginError,
        refetch   //this allows us to manually trigger the query
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListEmployeeLogin();
            console.log("📦 queryFn response of list employee login:", res);
            setEmployeeLogins(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list employee login api :", err);
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


    // query to update employee login credentials
    const { updateEmployeeCredentials } = useEmployee();
    const { mutateAsync, isLoading, isError, error } = updateEmployeeCredentials;

    const handleUpdate = async (empId) => {
        console.log("empId>>", empId);

        try {
            const payload = {
                loginName: editForm.loginName,
                password: editForm.password,
                userId: empId
            };

            console.log("payload>>", payload);

            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res?.data?.message);
                await refetch(); // ✅ refresh the employee login list
                setEditingIndex(null);
            }

            // Refetch or locally update the state
        } catch (err) {
            console.error("Update error:", err);
            alert('Update failed.');
        }
    };


    return (
        <div className="bg-white rounded shadow  p-3 w-full">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Employees Login</h1>
            </div>

            {/* limit */}
            <p className=' ml-auto bg-green-300 w-fit mt-2 border-b-2 text-[15px]'>Users Licenses : 5 of 5 Used</p>

            {isListEmployeesLoginError && (
                <Alert variant="destructive">{getErrorMessage(listEmployeesLoginError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className=" bg-teal-800 text-white">
                            <TableHead className="text-white">Employee Name</TableHead>
                            <TableHead className="text-white">Login Name</TableHead>
                            <TableHead className="text-white">Login Password</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeLogins.map((emp, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <TableCell>
                                    {emp?.referenceId?.name}
                                </TableCell>

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
                                        <div className=''>
                                            {/* ✅ Update */}
                                            <button
                                                loading={isLoading}
                                                onClick={() => handleUpdate(emp?._id)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Update"
                                            >
                                                <Check size={18} />
                                            </button>

                                            {/* ❌ Cancel */}
                                            <button
                                                loading={isLoading}
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-800"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
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
                    onClick={() => navigate("/admin/add_login")}
                    className="bg-blue-700 hover:bg-blue-800"
                >
                    Add Another Login
                </Button>
            </div>
        </div>
    )
}

export default ListEmployeeLogin
