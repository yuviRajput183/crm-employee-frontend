import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { apiListServiceProvider } from '@/services/serviceProvider.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListServiceProvider = () => {
    const [providers, setProviders] = useState([]);
    const navigate = useNavigate();

    const { isLoading, isError, error } = useQuery({
        queryKey: ['serviceProviders'],
        queryFn: async () => {
            const res = await apiListServiceProvider();
            setProviders(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
    });

    return (
        <div className='bg-white rounded shadow p-3'>
            {/* Heading */}
            <div className='flex gap-2 items-center pb-2 p-2 border-b-2'>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='text-2xl text-bold'>List Service Provider</h1>
            </div>

            {isError && (
                <Alert variant="destructive">Error loading service providers: {error?.message}</Alert>
            )}

            {isLoading ? (
                <p className="p-4 text-center">Loading...</p>
            ) : (
                <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full mt-4">
                    <Table className="w-[98%] mx-auto">
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900">
                                <TableHead className="text-white">S.No</TableHead>
                                <TableHead className="text-white">Legal Name</TableHead>
                                <TableHead className="text-white">Type</TableHead>
                                <TableHead className="text-white">State</TableHead>
                                <TableHead className="text-white">GSTIN</TableHead>
                                <TableHead className="text-white">Code</TableHead>
                                <TableHead className="text-white">Billing Format</TableHead>
                                <TableHead className="text-white">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providers.length > 0 ? (
                                providers.map((prov, index) => (
                                    <TableRow key={prov._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{prov.legalName}</div>
                                                {prov.alias && <div className="text-gray-500">Alias: {prov.alias}</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{prov.type}</TableCell>
                                        <TableCell>
                                            {prov.state}
                                            {prov.stateCode && ` (${prov.stateCode})`}
                                        </TableCell>
                                        <TableCell>{prov.gstin || "N/A"}</TableCell>
                                        <TableCell>{prov.code || "N/A"}</TableCell>
                                        <TableCell>{prov.billingFormat || "N/A"}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate(`/admin/edit_service_provider/${prov?._id}`)}
                                                variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                                                <Pencil size={14} />
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No Service Providers found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default ListServiceProvider
