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
import { ChevronDown, ChevronRight, Download, FolderArchive, Check, X, CheckCheck } from 'lucide-react';

const ReportedAccountLeads = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [expandedBundleIds, setExpandedBundleIds] = useState({});
    const [filters, setFilters] = useState({
        bundleName: '',
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

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

    const fetchBundles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${baseURL}/reported-bundles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setBundles(res.data.data);
                // By default expand bundles
                if (res.data.data.length > 0) {
                    const defaultExpanded = {};
                    res.data.data.forEach(b => { defaultExpanded[b._id] = true; });
                    setExpandedBundleIds(defaultExpanded);
                }
            }
        } catch (error) {
            console.error("Error fetching reported bundles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const toggleBundle = (bundleId) => {
        setExpandedBundleIds(prev => ({
            ...prev,
            [bundleId]: !prev[bundleId]
        }));
    };

    const expandAll = () => {
        const allExpanded = {};
        bundles.forEach(b => { allExpanded[b._id] = true; });
        setExpandedBundleIds(allExpanded);
    };

    const collapseAll = () => {
        setExpandedBundleIds({});
    };

    // Accept single lead: status changes to "Reported"
    const handleAcceptLead = async (bundleId, leadId) => {
        try {
            setActionLoading(prev => ({ ...prev, [leadId]: true }));
            const token = localStorage.getItem('token');
            const res = await axios.put(`${baseURL}/reported-bundles/${bundleId}/leads/${leadId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // Update local state directly for instant feedback
                setBundles(prevBundles => 
                    prevBundles.map(bundle => {
                        if (bundle._id !== bundleId) return bundle;
                        return {
                            ...bundle,
                            leads: (bundle.leads || []).map(lead => 
                                lead._id === leadId ? { ...lead, status: 'Reported' } : lead
                            )
                        };
                    })
                );
            }
        } catch (error) {
            console.error("Error accepting lead", error);
            alert("Error accepting lead: " + (error.response?.data?.message || error.message));
        } finally {
            setActionLoading(prev => ({ ...prev, [leadId]: false }));
        }
    };

    // Reject single lead: status remains "Ready to report", removed from bundle and Reported Leads tab
    const handleRejectLead = async (bundleId, leadId, leadNo) => {
        const confirmReject = window.confirm(`Are you sure you want to reject Lead ${leadNo || ''}? It will be removed from this bundle and returned to In Progress Leads with status 'Ready to report'.`);
        if (!confirmReject) return;

        try {
            setActionLoading(prev => ({ ...prev, [leadId]: true }));
            const token = localStorage.getItem('token');
            const res = await axios.put(`${baseURL}/reported-bundles/${bundleId}/leads/${leadId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                alert("Lead rejected! Removed from Reported Leads and returned to In Progress Leads.");
                // If the bundle was deleted because it became empty, remove it completely
                if (res.data.data?.bundleDeleted) {
                    setBundles(prev => prev.filter(b => b._id !== bundleId));
                } else {
                    // Refresh bundles to keep calculations and lists in sync
                    fetchBundles();
                }
            }
        } catch (error) {
            console.error("Error rejecting lead", error);
            alert("Error rejecting lead: " + (error.response?.data?.message || error.message));
        } finally {
            setActionLoading(prev => ({ ...prev, [leadId]: false }));
        }
    };

    // Accept all leads in a bundle
    const handleAcceptAll = async (bundleId) => {
        const confirmAcceptAll = window.confirm("Accept all leads in this bundle and change their status to 'Reported'?");
        if (!confirmAcceptAll) return;

        try {
            setActionLoading(prev => ({ ...prev, [bundleId]: true }));
            const token = localStorage.getItem('token');
            const res = await axios.put(`${baseURL}/reported-bundles/${bundleId}/accept-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setBundles(prevBundles => 
                    prevBundles.map(bundle => {
                        if (bundle._id !== bundleId) return bundle;
                        return {
                            ...bundle,
                            leads: (bundle.leads || []).map(lead => ({ ...lead, status: 'Reported' }))
                        };
                    })
                );
            }
        } catch (error) {
            console.error("Error accepting all leads", error);
            alert("Error accepting all leads: " + (error.response?.data?.message || error.message));
        } finally {
            setActionLoading(prev => ({ ...prev, [bundleId]: false }));
        }
    };

    const downloadBundleExcel = (bundle) => {
        try {
            const reportRows = [];
            let serialNo = 1;

            (bundle.leads || []).forEach((lead) => {
                const tranches = lead.tranches || [];

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

                if (tranches.length > 0) {
                    tranches.forEach(t => {
                        processRow(t.amount, t);
                    });
                } else {
                    processRow(lead.reportedLoanAmount, null);
                }
            });

            if (reportRows.length === 0) {
                alert("No leads found in this bundle to download.");
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(reportRows);
            const colWidths = Object.keys(reportRows[0]).map(key => {
                const maxLen = Math.max(
                    key.length,
                    ...reportRows.map(row => String(row[key] ?? '').length)
                );
                return { wch: Math.min(Math.max(maxLen + 2, 10), 45) };
            });
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reported Cases");

            const safeName = (bundle.bundleName || "Cases_Reported").replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `${safeName}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error("Error exporting bundle excel", error);
            alert("Error downloading excel: " + error.message);
        }
    };

    // Filter bundles and their leads based on filter inputs
    const filteredBundles = bundles.reduce((acc, bundle) => {
        const df = filters;
        const bundleMatches = checkMatch(bundle.bundleName, df.bundleName);

        const matchingLeads = (bundle.leads || []).filter(lead => {
            const leadMatches = 
                checkMatch(lead.leadNo, df.bundleName) &&
                checkMatch(lead.caseName, df.caseName) &&
                checkMatch(lead.reportedLoanAmount, df.amount) &&
                checkMatch(lead.lanApplicationNo, df.lanApplicationNo) &&
                checkMatch(lead.location?.name, df.location) &&
                checkMatch(lead.product?.name, df.product) &&
                checkMatch(lead.bank?.name || lead.bank?.bankName, df.bank) &&
                checkMatch(lead.serviceProvider?.legalName, df.spName) &&
                checkMatch(lead.status, df.status);

            const tranchesMatch = (lead.tranches || []).some(t =>
                checkMatch(t.amount, df.amount) ||
                checkMatch(t.trancheNumber ? `T${t.trancheNumber}` : '', df.tranche) ||
                checkMatch(t.paymentUid, df.paymentUid)
            );

            if (df.tranche || df.paymentUid) {
                return tranchesMatch;
            }

            return leadMatches || tranchesMatch;
        });

        const hasSpecificFilter = Object.values(df).some(v => v !== '');
        if (!hasSpecificFilter) {
            acc.push(bundle);
        } else if (bundleMatches || matchingLeads.length > 0) {
            acc.push({
                ...bundle,
                leads: matchingLeads.length > 0 ? matchingLeads : bundle.leads
            });
        }

        return acc;
    }, []);

    const totalBundlesCount = bundles.length;
    const totalCasesCount = bundles.reduce((sum, b) => sum + (b.leads?.length || 0), 0);
    const totalVolumeAmount = bundles.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    if (loading) return <PageLoader />;

    return (
        <div className='px-6 py-3 bg-white rounded shadow min-h-screen'>
            {/* Header section */}
            <div className='flex gap-2 items-center pb-2 border-b-2 justify-between flex-wrap'>
                <div className='flex gap-2 items-center'>
                    <Avatar>
                        <AvatarFallback className="bg-emerald-700 text-white font-bold">RL</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='text-2xl font-bold'>Reported Leads</h1>
                        <p className="text-xs text-gray-500">Accept or reject reported leads in bundles</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 text-xs bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
                        <div>
                            <span className="text-gray-500">Total Bundles:</span>{' '}
                            <span className="font-bold text-gray-800">{totalBundlesCount}</span>
                        </div>
                        <div className="border-l border-gray-300 pl-4">
                            <span className="text-gray-500">Total Cases:</span>{' '}
                            <span className="font-bold text-gray-800">{totalCasesCount}</span>
                        </div>
                        <div className="border-l border-gray-300 pl-4">
                            <span className="text-gray-500">Total Volume:</span>{' '}
                            <span className="font-bold text-emerald-700">₹{totalVolumeAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            onClick={expandAll} 
                            variant="outline" 
                            size="sm"
                            className="text-xs text-gray-700 hover:bg-gray-100"
                        >
                            Expand All
                        </Button>
                        <Button 
                            onClick={collapseAll} 
                            variant="outline" 
                            size="sm"
                            className="text-xs text-gray-700 hover:bg-gray-100"
                        >
                            Collapse All
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[72vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-900 text-white hover:bg-emerald-900">
                            <TableHead className="text-white w-12 text-center">View</TableHead>
                            <TableHead className="text-white">S.No</TableHead>
                            <TableHead className="text-white">Bundle Name / Lead No</TableHead>
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
                            <TableHead className="text-white text-center min-w-[200px]">Action</TableHead>
                        </TableRow>
                        <TableRow className="bg-gray-100">
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.bundleName} onChange={e => handleFilterChange('bundleName', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.caseName} onChange={e => handleFilterChange('caseName', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.tranche} onChange={e => handleFilterChange('tranche', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.amount} onChange={e => handleFilterChange('amount', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.paymentUid} onChange={e => handleFilterChange('paymentUid', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.lanApplicationNo} onChange={e => handleFilterChange('lanApplicationNo', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.product} onChange={e => handleFilterChange('product', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.bank} onChange={e => handleFilterChange('bank', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.spName} onChange={e => handleFilterChange('spName', e.target.value)} /></TableHead>
                            <TableHead><input className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600" placeholder="Filter..." value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} /></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredBundles.length > 0 ? filteredBundles.flatMap((bundle, bundleIndex) => {
                            const isExpanded = !!expandedBundleIds[bundle._id];
                            const rows = [];
                            const pendingLeads = (bundle.leads || []).filter(l => l.status !== 'Reported');
                            const pendingCount = pendingLeads.length;

                            // 1. Bundle Master Row
                            rows.push(
                                <TableRow 
                                    key={bundle._id} 
                                    className="bg-emerald-50/70 border-b-2 border-emerald-300 hover:bg-emerald-100/70 transition-colors"
                                >
                                    {/* Dropdown toggle button */}
                                    <TableCell className="text-center p-2">
                                        <button 
                                            type="button"
                                            onClick={() => toggleBundle(bundle._id)}
                                            className="p-1 rounded hover:bg-emerald-200 text-emerald-800 transition-colors focus:outline-none"
                                            title={isExpanded ? "Click to collapse bundle" : "Click to view leads in bundle"}
                                        >
                                            {isExpanded ? (
                                                <ChevronDown className="w-5 h-5 text-emerald-700" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-emerald-700" />
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell className="font-bold text-gray-700">{bundleIndex + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FolderArchive className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span className="font-bold text-emerald-950 text-sm">
                                                {bundle.bundleName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-gray-700 text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                                            {bundle.leads?.length || 0} Case(s)
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="font-bold text-emerald-800">
                                        ₹{(bundle.totalAmount || 0).toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                    <TableCell>
                                        {pendingCount === 0 ? (
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-900 rounded text-xs font-bold border border-emerald-300">
                                                Reported
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold border border-amber-300" title={`${pendingCount} lead(s) pending acceptance`}>
                                                Pending ({pendingCount})
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            <Button
                                                onClick={() => downloadBundleExcel(bundle)}
                                                size="sm"
                                                variant="outline"
                                                className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 h-7 text-xs flex items-center gap-1 font-semibold"
                                                title="Download Excel report for this bundle"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Excel
                                            </Button>

                                            {pendingCount > 0 && (
                                                <Button
                                                    onClick={() => handleAcceptAll(bundle._id)}
                                                    size="sm"
                                                    disabled={actionLoading[bundle._id]}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs flex items-center gap-1 font-semibold"
                                                    title="Accept all pending leads in this bundle"
                                                >
                                                    <CheckCheck className="w-3.5 h-3.5" />
                                                    Accept All
                                                </Button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => toggleBundle(bundle._id)}
                                                className="text-xs text-blue-600 hover:underline font-medium ml-1"
                                            >
                                                {isExpanded ? "Hide" : `View (${bundle.leads?.length || 0})`}
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );

                            // 2. Leads inside the bundle (when expanded)
                            if (isExpanded && bundle.leads && bundle.leads.length > 0) {
                                bundle.leads.forEach((lead, leadIndex) => {
                                    const isAccepted = lead.status === 'Reported';
                                    const isLeadLoading = !!actionLoading[lead._id];

                                    // Main lead row
                                    rows.push(
                                        <TableRow 
                                            key={`${bundle._id}-${lead._id}`} 
                                            className={`${leadIndex % 2 === 0 ? "bg-white" : "bg-gray-50/70"} border-l-4 ${isAccepted ? 'border-l-emerald-500' : 'border-l-amber-400'} hover:bg-blue-50/40`}
                                        >
                                            <TableCell className="text-center text-gray-400 text-xs">
                                                •
                                            </TableCell>
                                            <TableCell className="pl-4 text-xs font-semibold text-gray-600">
                                                {bundleIndex + 1}.${leadIndex + 1}
                                            </TableCell>
                                            <TableCell>
                                                <button 
                                                    className="text-blue-600 hover:underline font-medium text-sm"
                                                    onClick={() => window.location.href = `/admin/lead_stages/${lead._id}`}
                                                    title="View Lead Stages"
                                                >
                                                    {lead.leadNo || '-'}
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{lead.caseName}</TableCell>
                                            <TableCell className="text-gray-400 text-center">-</TableCell>
                                            <TableCell className="font-semibold text-gray-800">
                                                ₹{lead.reportedLoanAmount?.toLocaleString('en-IN')}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-center">-</TableCell>
                                            <TableCell className="text-sm">{lead.lanApplicationNo || '-'}</TableCell>
                                            <TableCell className="text-sm">{lead.location?.name || '-'}</TableCell>
                                            <TableCell className="text-sm">{lead.product?.name || '-'}</TableCell>
                                            <TableCell className="text-sm">{lead.bank?.name || lead.bank?.bankName || '-'}</TableCell>
                                            <TableCell className="text-sm">{lead.serviceProvider?.legalName || '-'}</TableCell>
                                            <TableCell>
                                                {isAccepted ? (
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                                                        Reported
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                                                        Ready to report
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {/* Accept & Reject buttons for leads that are pending acceptance */}
                                                    {!isAccepted ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleAcceptLead(bundle._id, lead._id)}
                                                                disabled={isLeadLoading}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
                                                                title="Accept lead and change status to Reported"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectLead(bundle._id, lead._id, lead.leadNo)}
                                                                disabled={isLeadLoading}
                                                                className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
                                                                title="Reject lead - status remains Ready to report and it will be returned to In Progress Leads"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mr-1">
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            Accepted
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => window.location.href = `/admin/account_edit_lead/${lead._id}`}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-medium"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );

                                    // Associated Tranches underneath the lead
                                    if (lead.tranches && lead.tranches.length > 0) {
                                        lead.tranches.forEach((t, tIndex) => {
                                            rows.push(
                                                <TableRow 
                                                    key={`${bundle._id}-${lead._id}-${t._id}`} 
                                                    className="bg-green-50/60 border-l-4 border-l-green-600 hover:bg-green-100/50"
                                                >
                                                    <TableCell className="text-center text-green-700 text-xs">↳</TableCell>
                                                    <TableCell className="pl-6 text-xs text-gray-500 font-semibold">
                                                        {bundleIndex + 1}.${leadIndex + 1}.${tIndex + 1}
                                                    </TableCell>
                                                    <TableCell className="text-gray-400">-</TableCell>
                                                    <TableCell className="text-gray-500 italic text-xs">↳ Tranche Split</TableCell>
                                                    <TableCell className="font-bold text-blue-600 text-xs">T{t.trancheNumber}</TableCell>
                                                    <TableCell className="font-bold text-green-700 text-xs">
                                                        ₹{t.amount?.toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-mono">{t.paymentUid}</TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                    <TableCell>
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                                            {t.status || 'FOUND'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-400 text-center">-</TableCell>
                                                </TableRow>
                                            );
                                        });
                                    }
                                });
                            } else if (isExpanded && (!bundle.leads || bundle.leads.length === 0)) {
                                rows.push(
                                    <TableRow key={`${bundle._id}-empty`} className="bg-gray-50">
                                        <TableCell colSpan={14} className="text-center py-3 text-sm text-gray-500 italic">
                                            No leads found in this bundle.
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            return rows;
                        }) : (
                            <TableRow>
                                <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FolderArchive className="w-8 h-8 text-gray-300" />
                                        <p className="font-medium">No reported lead bundles found.</p>
                                        <p className="text-xs text-gray-400">Export leads from the "In Progress Leads" tab to create your first bundle.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ReportedAccountLeads;
