import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import * as XLSX from 'xlsx';
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
    const [filters, setFilters] = useState({
        leadNo: '',
        caseName: '',
        tranche: '',
        amount: '',
        paymentUid: '',
        lanApplicationNo: '',
        location: '',
        product: '',
        bank: '',
        spName: '',
        status: ''
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const checkMatch = (value, filterVal) => {
        if (!filterVal) return true;
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(filterVal.toLowerCase());
    };

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

    const filteredLeads = leads.reduce((acc, lead) => {
        const df = filters;
        const mainMatches = 
            checkMatch(lead.leadNo, df.leadNo) &&
            checkMatch(lead.caseName, df.caseName) &&
            checkMatch(lead.reportedLoanAmount, df.amount) &&
            checkMatch(lead.lanApplicationNo, df.lanApplicationNo) &&
            checkMatch(lead.location?.name, df.location) &&
            checkMatch(lead.product?.name, df.product) &&
            checkMatch(lead.bank?.name || lead.bank?.bankName, df.bank) &&
            checkMatch(lead.serviceProvider?.legalName, df.spName) &&
            checkMatch(lead.status, df.status) &&
            checkMatch('', df.tranche) &&
            checkMatch('', df.paymentUid);

        const matchingTranches = (lead.tranches || []).filter(t => 
            checkMatch(lead.leadNo, df.leadNo) &&
            checkMatch(lead.caseName, df.caseName) &&
            checkMatch(t.amount, df.amount) &&
            checkMatch(lead.lanApplicationNo, df.lanApplicationNo) &&
            checkMatch(lead.location?.name, df.location) &&
            checkMatch(lead.product?.name, df.product) &&
            checkMatch(lead.bank?.name || lead.bank?.bankName, df.bank) &&
            checkMatch(lead.serviceProvider?.legalName, df.spName) &&
            checkMatch(t.status || 'FOUND', df.status) &&
            checkMatch(t.trancheNumber ? `T${t.trancheNumber}` : '', df.tranche) &&
            checkMatch(t.paymentUid, df.paymentUid)
        );

        if (mainMatches) {
            acc.push({ ...lead, tranches: df.tranche || df.paymentUid ? matchingTranches : lead.tranches });
        } else if (matchingTranches.length > 0) {
            acc.push({ ...lead, tranches: matchingTranches });
        }
        
        return acc;
    }, []);

    const allIds = filteredLeads.flatMap(lead => {
        if (lead.tranches && lead.tranches.length > 0) {
            return lead.tranches.map(t => t._id);
        }
        return [lead._id];
    });
    const isAllSelected = filteredLeads.length > 0 && selectedIds.length === allIds.length;

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

    const [invoiceDate, setInvoiceDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });

    const handleGeneratePdf = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');
            const res = await axios.post(`${baseURL}/account-invoices/generate`, {
                selectedLeadIds: selectedIds,
                invoiceDate: new Date(invoiceDate).toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                alert("Invoice PDF generated successfully!");
                // Clear selection and refresh
                setSelectedIds([]);
                fetchLeads();
                if (res.data.data && res.data.data.invoicePdfUrl) {
                    const fileUrl = `${baseURL.replace('/api/v1', '')}${res.data.data.invoicePdfUrl}`;
                    const filename = res.data.data.invoicePdfUrl.split('/').pop() || 'Invoice.pdf';
                    
                    fetch(fileUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const blobUrl = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                            window.URL.revokeObjectURL(blobUrl);
                        })
                        .catch(err => {
                            console.error("Error downloading file via blob, falling back to open:", err);
                            window.open(fileUrl, '_blank');
                        });
                }
            }
        } catch (error) {
            console.error("Error generating PDF", error);
            alert(error.response?.data?.message || "Error generating PDF");
        }
    };

    const selectedLeads = leads.filter(lead => {
        if (selectedIds.includes(lead._id)) return true;
        if (lead.tranches && lead.tranches.some(t => selectedIds.includes(t._id))) return true;
        return false;
    });

    const [exporting, setExporting] = useState(false);

    const handleExportAsExcel = async () => {
        if (selectedIds.length === 0 || selectedLeads.length === 0) {
            alert("Please select at least one lead from the table to export.");
            return;
        }

        try {
            setExporting(true);
            const reportRows = [];
            let serialNo = 1;

            selectedLeads.forEach((lead) => {
                // If lead has tranches and any of its tranches are selected, process each selected tranche
                const selectedTranches = (lead.tranches || []).filter(t => selectedIds.includes(t._id));

                const processRow = (amount, trancheObj = null) => {
                    const loanAmount = Number(amount) || 0;
                    const rkplPayoutPct = Number(lead.reportedPayoutPercentage) || 0;
                    const rkplTotalPayout = (lead.totalPayoutAmount && !trancheObj)
                        ? Number(lead.totalPayoutAmount)
                        : Math.round((loanAmount * rkplPayoutPct) / 100);

                    const givenPercent = Number(lead.serviceProvider?.dealPercentage) || 95;
                    const brokerPayoutPct = Number(((rkplPayoutPct * givenPercent) / 100).toFixed(2));
                    const totalBrokerPayout = Math.round((rkplTotalPayout * givenPercent) / 100);

                    const rkplUid = trancheObj 
                        ? (trancheObj.spUid || trancheObj.paymentUid || '')
                        : (lead.spUid || lead.paymentUid || lead.tranches?.[0]?.spUid || lead.tranches?.[0]?.paymentUid || '');

                    const brokerCode = lead.serviceProvider?.code || lead.spCode || "145243";
                    const brokerName = lead.serviceProvider?.legalName || "Urbanedge Loan Sahayak Private Limited";

                    reportRows.push({
                        "S.No.": serialNo++,
                        "Location": lead.location?.name || lead.location || '',
                        "Vertical": "Gagan Bhargav",
                        "Manager": "Utsav Gupta",
                        "Sub Manager": "Parul Gandhi",
                        "Customer Name": lead.caseName || '',
                        "Company Name": "RKPL",
                        "Loan Number": lead.lanApplicationNo || '',
                        "BANK": lead.bank?.name || lead.bank?.bankName || '',
                        "Product": lead.product?.name || lead.product || '',
                        "Reported Loan Amount By Broker": loanAmount,
                        "Reported RKPL Payout %": `${rkplPayoutPct.toFixed(2)}%`,
                        "Reported RKPL Total Payout Amount ": rkplTotalPayout,
                        "Invoice No": "",
                        "Lead No": lead.leadNo || '',
                        "RKPL UID": rkplUid,
                        "Source Type": "DSA",
                        "Broker Code": brokerCode,
                        "Broker Name": brokerName,
                        "Broker Payout %": `${brokerPayoutPct.toFixed(2)}%`,
                        "Total Broker Payout": totalBrokerPayout,
                        "GIVEN %": `${givenPercent}%`,
                        "Status": "Disbursed"
                    });
                };

                if (selectedTranches.length > 0) {
                    selectedTranches.forEach(t => {
                        processRow(t.amount, t);
                    });
                } else {
                    processRow(lead.reportedLoanAmount, null);
                }
            });

            if (reportRows.length === 0) {
                alert("No lead rows to export.");
                return;
            }

            // 1. Generate & download the Excel file
            const worksheet = XLSX.utils.json_to_sheet(reportRows);
            const colWidths = Object.keys(reportRows[0]).map(key => {
                const maxLen = Math.max(
                    key.length,
                    ...reportRows.map(row => String(row[key] ?? '').length)
                );
                return { wch: Math.min(Math.max(maxLen + 2, 10), 45) };
            });
            worksheet['!cols'] = colWidths;

            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Cases Reported`);

            const fileName = `Cases_Reported_${formattedDate}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            // 2. Call backend to bundle the exported leads into Reported Leads
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

            const selectedTrancheIds = [];
            selectedLeads.forEach(lead => {
                (lead.tranches || []).forEach(t => {
                    if (selectedIds.includes(t._id)) {
                        selectedTrancheIds.push(t._id);
                    }
                });
            });

            const res = await axios.post(`${baseURL}/reported-bundles/create`, {
                leadIds: selectedLeads.map(l => l._id),
                selectedTrancheIds,
                bundleDate: today.toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const bundle = res.data.data;
                alert(`Leads exported and bundled successfully into "${bundle.bundleName}"! They have been moved to Reported Leads.`);
                setSelectedIds([]);
                fetchLeads();
            }
        } catch (error) {
            console.error("Error exporting excel & bundling leads", error);
            alert("Error exporting excel: " + (error.response?.data?.message || error.message || ""));
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className='px-6 py-3 bg-white rounded shadow min-h-screen'>
            <div className='flex gap-2 items-center pb-2 border-b-2 justify-between'>
                <div className='flex gap-2 items-center'>
                    <Avatar>
                        <AvatarFallback>IP</AvatarFallback>
                    </Avatar>
                    <h1 className='text-2xl font-bold'>In Progress Leads</h1>
                </div>
                {selectedIds.length > 0 && (
                    <div className="flex gap-4 items-center">
                        <div>
                            <label className="text-sm font-semibold mr-2">Invoice Date:</label>
                            <input 
                                type="date" 
                                value={invoiceDate} 
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                            />
                        </div>
                        <Button 
                            onClick={handleGeneratePdf}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Generate Invoice
                        </Button>
                        <Button 
                            onClick={handleExportAsExcel}
                            disabled={exporting}
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            title="Export selected leads as Excel and bundle them into Reported Leads"
                        >
                            {exporting ? 'Exporting...' : 'Export as Excel'}
                        </Button>
                    </div>
                )}
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
                        <TableRow className="bg-gray-100">
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.leadNo} onChange={e => handleFilterChange('leadNo', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.caseName} onChange={e => handleFilterChange('caseName', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.tranche} onChange={e => handleFilterChange('tranche', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.amount} onChange={e => handleFilterChange('amount', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.paymentUid} onChange={e => handleFilterChange('paymentUid', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.lanApplicationNo} onChange={e => handleFilterChange('lanApplicationNo', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.product} onChange={e => handleFilterChange('product', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.bank} onChange={e => handleFilterChange('bank', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.spName} onChange={e => handleFilterChange('spName', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" placeholder="Filter..." value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} /></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length > 0 ? filteredLeads.flatMap((lead, leadIndex) => {
                            const rows = [];
                            
                            // 1. Push the main lead row
                            rows.push(
                                <TableRow key={lead._id} className={leadIndex % 2 === 0 ? "bg-gray-100" : ""}>
                                    <TableCell>
                                        {(!lead.tranches || lead.tranches.length === 0) && (
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 cursor-pointer accent-green-600"
                                                checked={selectedIds.includes(lead._id)}
                                                onChange={() => handleSelectRow(lead._id)}
                                            />
                                        )}
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
                            );

                            // 2. Push all its associated tranches underneath
                            if (lead.tranches && lead.tranches.length > 0) {
                                lead.tranches.forEach((t, tIndex) => {
                                    rows.push(
                                        <TableRow key={`${lead._id}-${t._id}`} className="bg-green-50 border-l-4 border-l-green-600">
                                            <TableCell>
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 cursor-pointer accent-green-600"
                                                    checked={selectedIds.includes(t._id)}
                                                    onChange={() => handleSelectRow(t._id)}
                                                />
                                            </TableCell>
                                            <TableCell className="pl-6 font-semibold text-gray-500">{t.customTrancheId || `${leadIndex + 1}.${tIndex + 1}`}</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell className="text-gray-500 italic">↳ Tranche Split</TableCell>
                                            <TableCell className="font-bold text-blue-600">{t.customTrancheId || `T${t.trancheNumber}`}</TableCell>
                                            <TableCell className="font-bold text-green-600">₹{t.amount?.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>{t.paymentUid}</TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                                    {t.status || 'FOUND'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-400">-</TableCell>
                                        </TableRow>
                                    );
                                });
                            }
                            
                            return rows;
                        }) : (
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
