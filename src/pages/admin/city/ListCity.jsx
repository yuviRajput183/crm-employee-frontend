import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiListCity } from '@/services/city.api';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { useCity } from '@/lib/hooks/useCity';





const ListCity = () => {
    const [cities, setCities] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ cityName: '' });

    const navigate = useNavigate();

    const {
        isError: isListCityError,
        error: listCityError,
        refetch
    } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await apiListCity();
            console.log("📦 queryFn response of list city:", res);
            setCities(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list cities api :", err);
        }
    });


    // 🖊️ Edit button
    const handleEdit = (index, city) => {
        setEditingIndex(index);
        setEditForm({ cityName: city.cityName });
    };

    // ❌ Cancel edit
    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({ cityName: '' });
    };

    const { updateCityName } = useCity(); // 🔁 You must define this in useCity.js
    const { mutateAsync, isLoading, isError, error } = updateCityName;

    // ✅ Update city
    const handleUpdate = async (cityId, stateName) => {
        try {
            const payload = {
                cityId,
                cityName: editForm.cityName,
                stateName
            };
            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res?.data?.message);
                await refetch(); // refresh list
                setEditingIndex(null);
            }
        } catch (err) {
            console.error("City update failed", err);
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
                <h1 className=' text-2xl text-bold'>List Cities</h1>
            </div>

            {isListCityError && (
                <Alert variant="destructive">{getErrorMessage(listCityError)}</Alert>
            )}


            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">State Name</TableHead>
                            <TableHead className="text-white">City Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {cities.map((item, index) => (
                            <TableRow key={item?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>{item.stateName}</TableCell>
                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.cityName}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, cityName: e.target.value })
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        item.cityName
                                    )}
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    {editingIndex === index ? (
                                        <>
                                            {/* ✅ Confirm */}
                                            <button
                                                onClick={() => handleUpdate(item._id, item.stateName)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <Check size={18} />
                                            </button>

                                            {/* ❌ Cancel */}
                                            <button
                                                onClick={handleCancel}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
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

                {/* Add Another City Button */}
                <div className="mt-4">
                    <Button
                        onClick={() => navigate("/admin/add_city")}
                        className="bg-blue-500 hover:bg-blue-800 text-white"
                    >
                        Add Another City
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default ListCity
