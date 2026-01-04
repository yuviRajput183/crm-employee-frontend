import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiListAllDrafts } from '@/services/lead.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '../ui/alert';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

// mapping of product type -> edit path 
const editProductPathMap = {
    "Personal Loan": "/advisor/edit_personal_loan",
    "Business Loan": "/advisor/edit_business_loan",
    "Home Loan": "/advisor/edit_home_loan",
    "Loan Against Property": "/advisor/edit_loan_against_property",
    "Car Loan": "/advisor/edit_car_loan",
    "Used Car Loan": "/advisor/edit_used_car_loan",
    "Insurance": "/advisor/edit_insurance",
    "Services": "/advisor/edit_services",
    "Others": "/advisor/edit_others"
}

const Draft = () => {

    const [draftsData, setDraftsData] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // fetching all drafts on component mount
    const {
        isError: isDraftsError,
        error: draftsError,
        refetch
    } = useQuery({
        queryKey: ['all-drafts'],
        queryFn: async () => {
            const res = await apiListAllDrafts();
            console.log("📦 queryFn response of all drafts:", res);
            setDraftsData(res?.data?.data || []);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("drafts data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching drafts:", err);
        }
    });

    useEffect(() => {
        if (draftsData?.length > 0) {
            setDrafts(draftsData);
        }
    }, [draftsData]);

    // Filter drafts based on search term
    const filteredDrafts = drafts.filter(draft => {
        const searchLower = searchTerm.toLowerCase();
        return (
            draft?.clientName?.toLowerCase().includes(searchLower) ||
            draft?.mobileNo?.includes(searchTerm) ||
            draft?.productType?.toLowerCase().includes(searchLower) ||
            draft?.emailId?.toLowerCase().includes(searchLower)
        );
    });

    const handleSearch = () => {
        // Search is already handled by filteredDrafts
        console.log("Searching for:", searchTerm);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');  // DD/MM/YYYY format
    };

    console.log("draftsData>>", draftsData);
    console.log("drafts array >>", drafts);


    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={barchart} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Draft Applications</h1>
                </div>
            </div>


            {isDraftsError && (
                <Alert variant="destructive">{getErrorMessage(draftsError)}</Alert>
            )}


            {/* Search Bar */}
            <div className="flex justify-center mt-4 mb-4">
                <div className="flex w-full max-w-xl">
                    <Input
                        type="text"
                        placeholder="Search.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        onClick={handleSearch}
                        className="rounded-l-none bg-teal-600 hover:bg-teal-700"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-teal-700 text-white hover:bg-teal-700">
                            <TableHead className="text-white">Product Type</TableHead>
                            <TableHead className="text-white">Lead Date</TableHead>
                            <TableHead className="text-white">Client Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Email Id</TableHead>
                            <TableHead className="text-white">Loan Amount</TableHead>
                            <TableHead className="text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=" ">
                        {filteredDrafts.map((draft, index) => (
                            <TableRow
                                key={draft._id || index}
                                className={index % 2 === 0 ? "bg-gray-50" : ""}
                            >
                                <TableCell>{draft.productType || '-'}</TableCell>
                                <TableCell>{formatDate(draft.createdAt)}</TableCell>
                                <TableCell>{draft.clientName || '-'}</TableCell>
                                <TableCell>{draft.mobileNo || '-'}</TableCell>
                                <TableCell>{draft.emailId || '-'}</TableCell>
                                <TableCell>{draft.loanRequirementAmount || draft.amount || '-'}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => navigate(`${editProductPathMap[draft.productType]}/${draft?._id}?isDraft=true`)}
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredDrafts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                                    No draft applications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default Draft
