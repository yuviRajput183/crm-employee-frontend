import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ReviewAgreementList = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    useEffect(() => {
        const fetchPendingAgreements = async () => {
            try {
                const res = await axios.get(`${baseURL}/esign/admin/pending`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                if (res.data.success) {
                    setPartners(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch pending agreements", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingAgreements();
    }, []);

    const handleReviewClick = (cp) => {
        navigate(`/admin/review_channel_partner_agreement/${cp._id}`, {
            state: { channelPartnerId: cp._id, partnerDetails: cp }
        });
    };

    return (
        <div className="p-6 bg-white rounded shadow mx-auto mt-6 min-h-screen">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Review Agreements (Pending Admin e-Sign)</h1>
            <p className="text-gray-600 mb-6">List of Channel Partners whose agreements need admin co-signing.</p>
            
            <div className="border rounded overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f0f4f8]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Channel Partner</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Registration Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">User Signed At</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : partners.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No channel partners found.</td></tr>
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
                                        {cp.userEsignRequest?.signedAt ? new Date(cp.userEsignRequest.signedAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-r">
                                        {cp.adminEsignStatus === 'APPROVED' ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Approved</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">Pending Admin Sign</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {cp.adminEsignStatus === 'APPROVED' ? (
                                            <Button 
                                                onClick={() => handleReviewClick(cp)}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                View
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => handleReviewClick(cp)}
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                            >
                                                Review & Sign
                                            </Button>
                                        )}
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

export default ReviewAgreementList;
