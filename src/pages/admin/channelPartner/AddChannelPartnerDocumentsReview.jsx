import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerDocumentsReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = previousState.channelPartnerId;
    const [status, setStatus] = useState(previousState.documentStatus || 'SUBMITTED');
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/list_channel_partner');
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${baseURL}/channel-partners/${channelPartnerId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                const cp = res.data.data;
                if (cp.documents) {
                    setStatus(cp.documents.status || 'SUBMITTED');
                    
                    // If rejected, kick them back to upload stage
                    if (cp.documents.status === 'REJECTED') {
                        navigate('/admin/add_channel_partner_documents', {
                            state: { ...previousState, partnerDetails: cp }
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch partner details", err);
            }
        };

        fetchDetails();
    }, [channelPartnerId, navigate, baseURL]);

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner - Documents Review</h1>
            </div>

            <ChannelPartnerStepper currentStage={7} />

            <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Document Review Status</h2>

                {status === 'SUBMITTED' && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-300 py-6 mb-6">
                        <span className="font-semibold block mb-2 text-lg">In Review</span> 
                        It takes around 24-72 hours to review your documents. Kindly wait for the approval.
                    </Alert>
                )}

                {status === 'APPROVED' && (
                    <Alert className="bg-green-50 text-green-800 border-green-300 py-6 mb-6">
                        <div className="mb-4">
                            <span className="font-semibold block mb-2 text-lg">Approved</span> 
                            Your documents are now approved.
                        </div>
                        <Button 
                            onClick={() => {
                                navigate('/admin/add_channel_partner_agreement', {
                                    state: previousState
                                });
                            }} 
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Continue to Agreement Generation
                        </Button>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default AddChannelPartnerDocumentsReview;
