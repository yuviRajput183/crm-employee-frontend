import React, { useEffect, useState } from 'react'
import deletee from "@/assets/images/image.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiListAllLeads, apiDeleteAttachments } from '@/services/attachments.api';
import { apiListAdvisor } from '@/services/advisor.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';



const DeleteAttachments = () => {

    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [selectedLeadIds, setSelectedLeadIds] = useState([]);

    // Filter form state
    const [loanType, setLoanType] = useState('');
    const [leadFeedback, setLeadFeedback] = useState('');
    const [advisorName, setAdvisorName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // fetching all leads on component mount and on filtering
    const {
        isError: isLeadsError,
        error: leadsError,
        data: queryData,
        refetch
    } = useQuery({
        queryKey: ['delete-attachments-leads', filterParams],
        queryFn: async () => {
            const res = await apiListAllLeads(filterParams);
            console.log("📦 queryFn response of list leads:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching all leads :", err);
        }
    });

    // Query to fetch all advisors on component mount
    const {
        isError: isAdvisorsError,
        error: advisorsError,
    } = useQuery({
        queryKey: ['all-advisors-delete-attachments'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisors:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.error("Error fetching advisors:", err);
        }
    });

    // Mutation for deleting attachments
    const deleteAttachmentsMutation = useMutation({
        mutationFn: apiDeleteAttachments,
        onSuccess: (res) => {
            console.log("Delete attachments success:", res);
            // Clear selection and refetch
            setSelectedLeadIds([]);
            refetch();
            alert("Attachments deleted successfully!");
        },
        onError: (err) => {
            console.error("Error deleting attachments:", err);
            alert(getErrorMessage(err));
        }
    });

    const handleFilter = async () => {
        const cleanParams = {};

        if (loanType) cleanParams.productType = loanType;
        if (leadFeedback) cleanParams.feedback = leadFeedback;
        if (advisorName) cleanParams.advisorName = advisorName;
        if (fromDate) cleanParams.fromDate = fromDate;
        if (toDate) cleanParams.toDate = toDate;

        console.log("submitting values for filter in handle Filter>>", cleanParams);

        // Only update filterParams - this will trigger the query automatically
        setFilterParams(cleanParams);
    }

    const handleSelectLead = (leadId, checked) => {
        if (checked) {
            setSelectedLeadIds(prev => [...prev, leadId]);
        } else {
            setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedLeadIds(leads.map(lead => lead._id));
        } else {
            setSelectedLeadIds([]);
        }
    };

    const handleDeleteAttachments = () => {
        if (selectedLeadIds.length === 0) {
            alert("Please select at least one lead to delete attachments.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete attachments for ${selectedLeadIds.length} lead(s)?`)) {
            deleteAttachmentsMutation.mutate(selectedLeadIds);
        }
    };


    // Update leads when query data changes
    useEffect(() => {
        console.log("query data >>>", queryData);

        if (queryData?.data?.data?.leads?.length > 0) {
            setLeads(queryData.data.data?.leads);
        } else if (queryData?.data?.data) {
            setLeads([]);
        }
    }, [queryData]);


    console.log("all leads >>>", queryData);

    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex items-center gap-2 pb-2 border-b-2  '>
                <Avatar >
                    <AvatarImage src={deletee} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Delete Attachments</h1>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 shadow mt-4 border border-gray-100 rounded-md p-4 bg-white">
                {/* Loan Type Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Loan Type</label>
                    <select
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Business Loan">Business Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Loan Against Property">Loan Against Property</option>
                        <option value="Car Loan">Car Loan</option>
                        <option value="Used Car Loan">Used Car Loan</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Private Funding">Private Funding</option>
                        <option value="Professional Loan">Professional Loan</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Lead Feedback Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Lead Feedback</label>
                    <select
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        value={leadFeedback}
                        onChange={(e) => setLeadFeedback(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Allocated">Allocated</option>
                        <option value="Docs Query">Docs Query</option>
                        <option value="Loan Approved">Loan Approved</option>
                        <option value="Loan Disbursed">Loan Disbursed</option>
                        <option value="Loan Rejected">Loan Rejected</option>
                        <option value="Under Process">Under Process</option>
                    </select>
                </div>

                {/* Advisor Name Dropdown */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Advisor Name</label>
                    <select
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        value={advisorName}
                        onChange={(e) => setAdvisorName(e.target.value)}
                    >
                        <option value="">Select</option>
                        {advisors.map((advisor) => (
                            <option key={advisor._id} value={advisor.name}>
                                {advisor.name} - {advisor.advisorCode}
                            </option>
                        ))}
                    </select>
                </div>

                {/* From Date Picker */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">From Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        placeholder="DD/MM/YYYY"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                {/* To Date Picker */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">To Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2 text-sm text-gray-700"
                        placeholder="DD/MM/YYYY"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                {/* Show Button */}
                <div className="flex items-end">
                    <button
                        className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded w-full"
                        onClick={handleFilter}
                    >
                        SHOW
                    </button>
                </div>
            </div>

            {isLeadsError && (
                <Alert variant="destructive">{getErrorMessage(leadsError)}</Alert>
            )}
            {isAdvisorsError && (
                <Alert variant="destructive">{getErrorMessage(advisorsError)}</Alert>
            )}
            {deleteAttachmentsMutation.isError && (
                <Alert variant="destructive">{getErrorMessage(deleteAttachmentsMutation.error)}</Alert>
            )}

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">

                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Sr. No</TableHead>
                            <TableHead className="text-white">Lead No</TableHead>
                            <TableHead className="text-white">Product Type</TableHead>
                            <TableHead className="text-white">Advisor Name</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">Lead Date</TableHead>
                            <TableHead className="text-white">Customer Name</TableHead>
                            <TableHead className="text-white">Mobile No</TableHead>
                            <TableHead className="text-white">Allocated To</TableHead>
                            <TableHead className="text-white">Feedback</TableHead>
                            <TableHead className="text-white">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={leads.length > 0 && selectedLeadIds.length === leads.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    Select
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <TableRow
                                key={lead.leadNo}
                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{lead?.leadNo}</TableCell>
                                <TableCell>{lead?.productType}</TableCell>
                                <TableCell>{lead?.advisorId?.name}</TableCell>
                                <TableCell>{(lead?.loanRequirementAmount || lead?.insuranceAmount || lead?.amount)?.toLocaleString()}</TableCell>
                                <TableCell>{lead?.createdAt?.split('T')[0]}</TableCell>
                                <TableCell>{lead?.clientName}</TableCell>
                                <TableCell>{lead?.mobileNo}</TableCell>
                                <TableCell>{lead?.allocatedTo?.name}</TableCell>
                                <TableCell>{lead?.history?.[lead?.history?.length - 1]?.feedback}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedLeadIds.includes(lead._id)}
                                        onCheckedChange={(checked) => handleSelectLead(lead._id, checked)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4">
                <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleDeleteAttachments}
                    disabled={deleteAttachmentsMutation.isLoading || selectedLeadIds.length === 0}
                >
                    {deleteAttachmentsMutation.isLoading ? 'Deleting...' : 'Delete Attachments'}
                </Button>
                {selectedLeadIds.length > 0 && (
                    <span className="ml-3 text-sm text-gray-600">
                        {selectedLeadIds.length} lead(s) selected
                    </span>
                )}
            </div>

        </div>
    )
}

export default DeleteAttachments
