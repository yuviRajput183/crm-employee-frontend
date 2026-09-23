import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';
import EsignButton from '@/components/shared/EsignButton';

const AddChannelPartnerAgreement = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = previousState.channelPartnerId;
    
    const [userEsignSigned, setUserEsignSigned] = useState(false);
    const [adminEsignSigned, setAdminEsignSigned] = useState(false);
    const [adminEsignDocUrl, setAdminEsignDocUrl] = useState('');

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/list_channel_partner');
            return;
        }

        const fetchStatuses = async () => {
            try {
                // Fetch User eSign status
                const userRes = await axios.get(`${baseURL}/esign/channel-partners/${channelPartnerId}/active`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                if (userRes.data.success && userRes.data.data && userRes.data.data.status === "SIGNED") {
                    setUserEsignSigned(true);
                }

                // Fetch Admin eSign status
                const adminRes = await axios.get(`${baseURL}/esign/admin/channel-partners/${channelPartnerId}/active`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                if (adminRes.data.success && adminRes.data.data && adminRes.data.data.status === "SIGNED") {
                    setAdminEsignSigned(true);
                    setAdminEsignDocUrl(adminRes.data.data.signedDocumentUrl);
                }
            } catch (err) {
                console.error("Failed to fetch esign statuses:", err);
            }
        };

        fetchStatuses();
        
        // Polling every 10 seconds just in case they complete it on another device/tab
        const intervalId = setInterval(fetchStatuses, 10000);
        return () => clearInterval(intervalId);
    }, [channelPartnerId, navigate, baseURL]);

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

                {channelPartnerId && (
                    <div className="mt-8">
                        <EsignButton 
                            channelPartnerId={channelPartnerId} 
                            hideContinueButton={true}
                        />
                    </div>
                )}

                {/* Status messages based on signatures */}
                {userEsignSigned && !adminEsignSigned && (
                    <Alert className="mt-6 bg-yellow-50 text-yellow-800 border-yellow-300">
                        <span className="font-semibold">eSign is pending at admin level.</span> Please wait for the admin to co-sign the agreement.
                    </Alert>
                )}

                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/admin/add_channel_partner_documents_review', { state: previousState })}
                        className="px-8"
                    >
                        Back
                    </Button>
                    
                    {adminEsignSigned && (
                        <Button
                            onClick={() => {
                                navigate('/admin/add_channel_partner_code_creation', {
                                    state: { ...previousState, agreementUrl: adminEsignDocUrl }
                                });
                            }}
                            className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Continue to Next Stage
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerAgreement;
