import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ReviewChannelPartnerList = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axios.get(`${baseURL}/channel-partners`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                // Filter partners who have submitted documents
                const submitted = res.data.data.filter(cp => 
                    cp.documents && (cp.documents.status === 'SUBMITTED' || cp.documents.status === 'REJECTED' || cp.documents.status === 'APPROVED')
                );
                
                setPartners(submitted);
            } catch (err) {
                console.error("Failed to fetch partners", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const handleReviewClick = (cp) => {
        navigate(`/admin/review_channel_partner_documents/${cp._id}`, {
            state: { channelPartnerId: cp._id, partnerDetails: cp }
        });
    };

    return (
        <div className="p-6 bg-white rounded shadow mx-auto mt-6 min-h-screen">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Review Channel Partner Documents</h1>
            <p className="text-gray-600 mb-6">List of Channel Partners who have submitted documents for review.</p>
            
            <div className="border rounded overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f0f4f8]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Channel Partner</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Registration Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Submitted At</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : partners.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No channel partners waiting for review.</td></tr>
                        ) : (
                            partners.map(cp => (
                                <tr key={cp._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap border-r">
                                        <div className="font-semibold text-sm">{cp.panDetails?.fullName || cp.aadhaarDetails?.fullName || 'Unknown Name'}</div>
                                        <div className="text-xs text-gray-500">{cp.panDetails?.panNumber || 'No PAN'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-r text-sm text-gray-600">
                                        {cp.businessDetails?.registrationType || 'Individual'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-r text-sm text-gray-600">
                                        {cp.documents?.submittedAt ? new Date(cp.documents.submittedAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-r">
                                        {cp.documents?.status === 'APPROVED' ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Approved</span>
                                        ) : cp.documents?.status === 'REJECTED' ? (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">Rejected</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">In Review</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Button 
                                            onClick={() => handleReviewClick(cp)}
                                            size="sm"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Review Documents
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewChannelPartnerList;
