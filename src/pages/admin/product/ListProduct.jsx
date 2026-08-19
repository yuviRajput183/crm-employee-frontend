import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiListProduct } from '@/services/product.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/lib/hooks/useProduct';

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ name: '' });

    const navigate = useNavigate();

    // query to  fetch list of product on component mount
    const {
        isError: isListProductError,
        error: listProductError,
        refetch
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await apiListProduct();
            console.log("📦 queryFn response of list product:", res);
            setProducts(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list products api :", err);
        }
    });


    // When edit button is clicked
    const handleEdit = (index, prod) => {
        setEditingIndex(index);
        setEditForm({ name: prod.name });
    };

    // when cancel button is clicked
    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({ name: '' });
    };

    // query to update product
    const { updateProduct } = useProduct();
    const { mutateAsync, isLoading, isError, error } = updateProduct;

    const handleUpdate = async (prodId) => {
        try {
            const payload = {
                name: editForm.name,
                productId: prodId
            };

            const res = await mutateAsync(payload);
            if (res?.data?.success) {
                alert(res?.data?.message);
                await refetch(); // refresh updated list
                setEditingIndex(null);
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Update failed.");
        }
    };

    return (
        <div className=' bg-white rounded shadow p-3 '>
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 p-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>List Product</h1>
            </div>


            {isListProductError && (
                <Alert variant="destructive">{getErrorMessage(listProductError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}


            <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 mt-2">
                <Table>
                    <TableHeader>
                        <TableRow className=" bg-teal-900 text-white hover:bg-teal-900 ">
                            <TableHead className="text-white">Product Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((prod, index) => (
                            <TableRow key={prod?._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <TableCell>
                                    {editingIndex === index ? (
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    ) : (
                                        prod.name
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingIndex === index ? (
                                        <div className="flex gap-2 justify-end pr-2">
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleUpdate(prod._id)}
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
                                        </div>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleEdit(index, prod)}
                                            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 ml-auto"
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                    )}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Add Button */}
                <div className="mt-4 ">
                    <Button
                        onClick={() => navigate("/admin/add_product")}
                        className="bg-blue-500 hover:bg-blue-800 text-white"
                    >
                        Add Another Product
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default ListProduct
