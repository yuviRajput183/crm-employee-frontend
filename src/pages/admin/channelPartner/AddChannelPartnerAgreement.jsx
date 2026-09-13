import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerAgreement = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = previousState.channelPartnerId;
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/list_channel_partner');
            return;
        }
    }, [channelPartnerId, navigate]);

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner - Agreement Generation</h1>
            </div>

            <ChannelPartnerStepper currentStage={8} />

            <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Generate and Sign Agreement</h2>

                <Alert className="bg-blue-50 text-blue-800 border-blue-300 py-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="font-semibold block mb-2 text-lg">Generate Agreement</span> 
                        Click the button to generate and download the agreement for this channel partner.
                    </div>
                    <Button 
                        onClick={async () => {
                            try {
                                const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/agreement/generate`, {}, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                    withCredentials: true
                                });
                                
                                // Download the file
                                const downloadRes = await axios.get(`${baseURL}/channel-partners/${channelPartnerId}/agreement/download`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                    responseType: 'blob',
                                    withCredentials: true
                                });
                                const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', res.data.data?.fileName || 'Connector-Agreement.pdf');
                                document.body.appendChild(link);
                                link.click();
                                link.remove();

                                navigate('/admin/add_channel_partner_code_creation', {
                                    state: { ...previousState, agreementUrl: res.data.url }
                                });
                            } catch (err) {
                                console.error("Failed to generate agreement", err);
                                alert(err.response?.data?.message || err.response?.data?.error || "Failed to generate agreement");
                            }
                        }} 
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[250px]"
                    >
                        Generate and Download Agreement
                    </Button>
                </Alert>
            </div>
        </div>
    );
};

export default AddChannelPartnerAgreement;
