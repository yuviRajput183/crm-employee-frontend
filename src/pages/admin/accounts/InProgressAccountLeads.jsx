import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageLoader from '@/components/loaders/PageLoader';

const InProgressAccountLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');
            const res = await axios.get(`${baseURL}/account-leads/in-progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeads(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching in-progress leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const allIds = leads.map(lead => lead._id);
    const isAllSelected = leads.length > 0 && selectedIds.length === allIds.length;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    if (loading) return <PageLoader />;

    return (
        <div className='px-6 py-3 bg-white rounded shadow min-h-screen'>
            <div className='flex gap-2 items-center pb-2 border-b-2'>
                <Avatar>
                    <AvatarFallback>IP</AvatarFallback>
                </Avatar>
                <h1 className='text-2xl font-bold'>In Progress Leads</h1>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white w-10">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 cursor-pointer accent-green-600"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll} 
                                />
                            </TableHead>
                            <TableHead className="text-white">S.No</TableHead>
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Case Name</TableHead>
                            <TableHead className="text-white">Tranche</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">Payment UID</TableHead>
                            <TableHead className="text-white">LAN No</TableHead>
                            <TableHead className="text-white">Location</TableHead>
                            <TableHead className="text-white">Product</TableHead>
                            <TableHead className="text-white">Bank</TableHead>
                            <TableHead className="text-white">SP Name</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length > 0 ? leads.map((lead, leadIndex) => (
                                <TableRow key={lead._id} className={leadIndex % 2 === 0 ? "bg-gray-100" : ""}>
                                    <TableCell>
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 cursor-pointer accent-green-600"
                                            checked={selectedIds.includes(lead._id)}
                                            onChange={() => handleSelectRow(lead._id)}
                                        />
                                    </TableCell>
                                    <TableCell>{leadIndex + 1}</TableCell>
                                    <TableCell>
                                        <button 
                                            className="text-blue-600 hover:underline"
                                            onClick={() => window.location.href = `/admin/lead_stages/${lead._id}`}
                                        >
                                            {lead.leadNo || '-'}
                                        </button>
                                    </TableCell>
                                    <TableCell>{lead.caseName}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>₹{lead.reportedLoanAmount?.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{lead.lanApplicationNo}</TableCell>
                                    <TableCell>{lead.location?.name || '-'}</TableCell>
                                    <TableCell>{lead.product?.name || '-'}</TableCell>
                                    <TableCell>{lead.bank?.name || lead.bank?.bankName || '-'}</TableCell>
                                    <TableCell>{lead.serviceProvider?.legalName || '-'}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                                            {lead.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => window.location.href = `/admin/account_edit_lead/${lead._id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            View
                                        </button>
                                    </TableCell>
                                </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={14} className="text-center py-4">No in-progress leads found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default InProgressAccountLeads;
