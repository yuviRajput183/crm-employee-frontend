import React, { useState, useEffect } from 'react';
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

const CibilReportPage = ({ bureauTitle, bureauValue, fields }) => {
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        name: '',
        mobile: '',
        pan: ''
    });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        name: '',
        mobile: '',
        pan: '',
        gender: '',
        consent: false
    });

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                page,
                name: filters.name,
                mobile: filters.mobile,
                pan: filters.pan
            }).toString();

            const res = await axios.get(`${baseURL}/cibil-reports/${bureauValue}?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setHistory(res.data.data.reports);
                setTotalPages(res.data.data.pages);
            }
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [filters, page, bureauValue]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!formData.consent) {
            alert("Please provide consent to generate the report.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData, consent: 'Y' };
            
            const res = await axios.post(`${baseURL}/cibil-reports/${bureauValue}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                alert(`${bureauTitle} report generated successfully!`);
                setFormData({
                    first_name: '', last_name: '', name: '', mobile: '', pan: '', gender: '', consent: false
                });
                setPage(1);
                fetchHistory();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id, fileName) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${baseURL}/cibil-reports/${id}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Failed to download report");
        }
    };

    return (
        <div className='px-6 py-3 bg-white rounded shadow min-h-screen'>
            <h1 className='text-2xl font-bold pb-2 border-b-2 mb-4'>{bureauTitle} Credit Report</h1>

            {/* Generation Form */}
            <form onSubmit={handleGenerate} className="bg-gray-50 p-4 rounded border mb-8 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                    {fields.includes('first_name') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input required name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                    )}
                    {fields.includes('last_name') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input required name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                    )}
                    {fields.includes('name') && (
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                    )}
                    {fields.includes('mobile') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Mobile Number</label>
                            <input required name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full p-2 border rounded" maxLength={10} />
                        </div>
                    )}
                    {fields.includes('pan') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">PAN Number</label>
                            <input required name="pan" value={formData.pan} onChange={handleInputChange} className="w-full p-2 border rounded uppercase" maxLength={10} />
                        </div>
                    )}
                    {fields.includes('gender') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleInputChange} className="w-4 h-4" />
                    <label htmlFor="consent" className="text-sm">I authorize generation of my credit report.</label>
                </div>

                <button disabled={loading} type="submit" className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </form>

            <h2 className='text-xl font-bold mb-4'>Report History</h2>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">S.No</TableHead>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Mob No</TableHead>
                            <TableHead className="text-white">PAN No</TableHead>
                            <TableHead className="text-white">Generated Date & Time</TableHead>
                            <TableHead className="text-white text-center">Report</TableHead>
                        </TableRow>
                        <TableRow className="bg-gray-100">
                            <TableHead></TableHead>
                            <TableHead>
                                <input 
                                    className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" 
                                    placeholder="Filter..." 
                                    value={filters.name} 
                                    onChange={e => { setFilters(prev => ({...prev, name: e.target.value})); setPage(1); }} 
                                />
                            </TableHead>
                            <TableHead>
                                <input 
                                    className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" 
                                    placeholder="Filter..." 
                                    value={filters.mobile} 
                                    onChange={e => { setFilters(prev => ({...prev, mobile: e.target.value})); setPage(1); }} 
                                />
                            </TableHead>
                            <TableHead>
                                <input 
                                    className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm text-black font-normal focus:outline-none focus:ring-1 focus:ring-green-600" 
                                    placeholder="Filter..." 
                                    value={filters.pan} 
                                    onChange={e => { setFilters(prev => ({...prev, pan: e.target.value})); setPage(1); }} 
                                />
                            </TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historyLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-4">Loading history...</TableCell></TableRow>
                        ) : history?.length > 0 ? (
                            history.map((item, index) => (
                                <TableRow key={item._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.mobile}</TableCell>
                                    <TableCell>{item.pan}</TableCell>
                                    <TableCell>{new Date(item.generatedAt).toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <button 
                                            onClick={() => handleDownload(item._id, item.pdfFileName)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            View
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={6} className="text-center py-4">No reports found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1 font-semibold text-gray-700">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CibilReportPage;
