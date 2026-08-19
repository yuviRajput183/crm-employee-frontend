import React, { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { apiListLocation } from '@/services/location.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListLocation = () => {
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    const { isLoading, isError, error } = useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const res = await apiListLocation();
            setLocations(res?.data?.data || []);
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
                <h1 className='text-2xl text-bold'>List Location</h1>
            </div>

            {isError && (
                <Alert variant="destructive">Error loading locations: {error?.message}</Alert>
            )}

            {isLoading ? (
                <p className="p-4 text-center">Loading locations...</p>
            ) : (
                <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full mt-4">
                    <Table className="w-[98%] mx-auto">
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900">
                                <TableHead className="text-white">S.No</TableHead>
                                <TableHead className="text-white">Name</TableHead>
                                <TableHead className="text-white">State</TableHead>
                                <TableHead className="text-white">Mobile</TableHead>
                                <TableHead className="text-white">Email</TableHead>
                                <TableHead className="text-white">Signatory</TableHead>
                                <TableHead className="text-white">Bank Account</TableHead>
                                <TableHead className="text-white">Documents</TableHead>
                                <TableHead className="text-white">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.length > 0 ? (
                                locations.map((loc, index) => (
                                    <TableRow key={loc._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{loc.name}</TableCell>
                                        <TableCell>{loc.state}</TableCell>
                                        <TableCell>{loc.mobile}</TableCell>
                                        <TableCell>{loc.email}</TableCell>
                                        <TableCell>
                                            {loc.authorizedSignatoryName ? (
                                                <div className="text-sm">
                                                    <div>{loc.authorizedSignatoryName}</div>
                                                    <div className="text-gray-500">{loc.authorizedSignatoryDesignation}</div>
                                                </div>
                                            ) : (
                                                "N/A"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {loc.accountNumber ? (
                                                <div className="text-sm">
                                                    <div>A/C: {loc.accountNumber}</div>
                                                    <div className="text-gray-500">IFSC: {loc.ifscCode}</div>
                                                </div>
                                            ) : (
                                                "N/A"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 text-sm text-blue-600">
                                                {loc.stampAndSign ? (
                                                    <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/uploads/stamps/${loc.stampAndSign}`} target="_blank" rel="noreferrer">
                                                        Stamp & Sign
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => navigate(`/admin/edit_location/${loc?._id}`)}
                                                variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                                                <Pencil size={14} />
                                                Edit Location
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">No Locations found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default ListLocation
