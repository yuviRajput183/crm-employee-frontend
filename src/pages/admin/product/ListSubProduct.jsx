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

const ListSubProduct = () => {
    const [products, setProducts] = useState([]);
    const [editingRow, setEditingRow] = useState({ prodId: null, index: null });
    const [editForm, setEditForm] = useState({ subProduct: '', oldSubProduct: '' });

    const navigate = useNavigate();

    // query to fetch list of product and their sub products on component mount
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
            console.error("Error fetching list product api :", err);
        }
    });

    console.log("products>>", products);

    const handleEdit = (prodId, subProd, index) => {
        setEditingRow({ prodId, index });
        setEditForm({ subProduct: subProd, oldSubProduct: subProd });
    };

    const handleCancel = () => {
        setEditingRow({ prodId: null, index: null });
        setEditForm({ subProduct: '', oldSubProduct: '' });
    };

    const { updateSubProduct } = useProduct();
    const { mutateAsync, isLoading, isError, error } = updateSubProduct;
    const handleUpdate = async () => {
        try {
            const payload = {
                productId: editingRow.prodId,
                oldSubProduct: editForm.oldSubProduct,
                newSubProduct: editForm.subProduct,
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
                <h1 className=' text-2xl text-bold'>List Sub Product</h1>
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
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Product Name</TableHead>
                            <TableHead className="text-white">Sub Product Name</TableHead>
                            <TableHead className="text-white text-right md:pr-10">Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products?.map((item) =>
                            item?.subProducts?.map((subProd, index) => {
                                const isEditing = editingRow.prodId === item._id && editingRow.index === index;
                                return (
                                    <TableRow key={item._id + '-' + index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <input
                                                    value={editForm.subProduct}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, subProduct: e.target.value })
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                subProd
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
                                                    onClick={() => handleEdit(item._id, subProd, index)}
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

                {/* Add Another Sub Product Button */}
                <div className="mt-4 ">
                    <Button
                        onClick={() => navigate("/admin/add_sub_product")}
                        className="bg-blue-500 hover:bg-blue-800 text-white"
                    >
                        Add Another Sub Product
                    </Button>
                </div>

            </div>

        </div>
    )
}

export default ListSubProduct
