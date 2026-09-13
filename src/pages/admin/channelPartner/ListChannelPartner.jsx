import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ListChannelPartner = () => {
    const [channelPartners, setChannelPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axios.get(`${baseURL}/channel-partners`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data && res.data.success) {
                    setChannelPartners(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch channel partners:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const getName = (cp) => {
        return cp.businessDetails?.udyam?.enterpriseName 
            || cp.businessDetails?.gst?.legalName 
            || cp.panDetails?.fullName 
            || cp.aadhaarDetails?.fullName 
            || 'Unknown';
    };

    return (
        <div className="p-4 bg-white rounded shadow mx-auto mt-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h1 className="text-2xl font-bold">List Channel Partners</h1>
            </div>
            
            <div className="mt-8 border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : channelPartners.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No channel partners found.</td>
                            </tr>
                        ) : (
                            channelPartners.map(cp => (
                                <tr key={cp._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cp.code || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getName(cp)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cp.mobile || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cp.email || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            cp.status === 'active' ? 'bg-green-100 text-green-800' :
                                            cp.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {cp.status === 'pending_approval' ? 'Pending Approval' : 
                                             cp.status === 'active' ? 'Active' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/admin/view_channel_partner/${cp._id}`)}
                                        >
                                            View
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

export default ListChannelPartner;
