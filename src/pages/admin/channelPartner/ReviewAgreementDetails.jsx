import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Loader2 } from 'lucide-react';
import { startAdminEsign, getAdminActiveEsign, getSignedDocument } from '@/services/esign.api';

const ReviewAgreementDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [partnerDetails, setPartnerDetails] = useState(location.state?.partnerDetails || null);
    const [isLoading, setIsLoading] = useState(!location.state?.partnerDetails);
    const [error, setError] = useState(null);
    const [adminEsignRequest, setAdminEsignRequest] = useState(null);
    const [isEsigning, setIsEsigning] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    useEffect(() => {
        const fetchData = async () => {
            if (!partnerDetails) {
                // Should ideally fetch CP details
            }
            
            try {
                const response = await getAdminActiveEsign(id);
                if (response.success && response.data) {
                    setAdminEsignRequest(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch admin eSign status:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSign = async (e, forceNew = false) => {
        e.preventDefault();
        try {
            setIsEsigning(true);
            setError(null);
            const response = await startAdminEsign(id, forceNew);
            if (response.success && response.data?.signingUrl) {
                window.location.href = response.data.signingUrl;
            } else {
                setError('Failed to start admin eSign.');
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsEsigning(false);
        }
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            setIsEsigning(true);
            const response = await getSignedDocument(adminEsignRequest._id);
            
            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const json = JSON.parse(text);
                throw new Error(json.message || "Failed to download signed document");
            }

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            let filename = `signed-agreement-${adminEsignRequest._id}.pdf`;
            const contentDisposition = response.headers && response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            setError(err.message || getErrorMessage(err));
        } finally {
            setIsEsigning(false);
        }
    };

    const handleContinue = () => {
        navigate('/admin/review_channel_partner_agreement');
    };

    if (isLoading) {
        return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /> Loading details...</div>;
    }

    return (
        <div className="p-6 bg-white rounded shadow mx-auto mt-6 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold">Review and Co-Sign Agreement</h1>
                <Button variant="outline" onClick={() => navigate('/admin/review_channel_partner_agreement')}>
                    Back to List
                </Button>
            </div>

            {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-lg font-bold mb-4">Channel Partner Details</h2>
                {partnerDetails && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold">{partnerDetails.panDetails?.fullName || partnerDetails.aadhaarDetails?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mobile</p>
                            <p className="font-semibold">{partnerDetails.mobile}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">User Signed Document</p>
                            {partnerDetails.userEsignRequest?.signedDocumentUrl ? (
                                <a href={`${baseURL.replace('/api/v1', '')}${partnerDetails.userEsignRequest.signedDocumentUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                    View Document
                                </a>
                            ) : (
                                <span>Not available in this view</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="border rounded p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Admin e-Sign</h3>
                <p className="text-gray-600 mb-6">
                    Review the user's signed agreement and complete your e-Sign via Aadhaar.
                </p>

                <div className="flex flex-col gap-4">
                    {(adminEsignRequest && (adminEsignRequest.status === "SIGNED" || adminEsignRequest.status === "SIGNED_PENDING_DOWNLOAD")) || partnerDetails?.adminEsignStatus === 'APPROVED' ? (
                        <div className="flex gap-4 items-center">
                            <Alert className="bg-green-50 text-green-800 border-green-300">
                                Admin e-Sign completed successfully.
                            </Alert>
                            {adminEsignRequest?._id ? (
                                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                                    Download Fully Signed Agreement
                                </Button>
                            ) : partnerDetails?.docStates?.adminSignedAgreementUrl || partnerDetails?.docStates?.signedAgreementUrl ? (
                                <a href={`${baseURL.replace('/api/v1', '')}${partnerDetails?.docStates?.adminSignedAgreementUrl || partnerDetails?.docStates?.signedAgreementUrl}`} target="_blank" rel="noreferrer">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        Download Fully Signed Agreement
                                    </Button>
                                </a>
                            ) : null}
                            <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Back to List
                            </Button>
                        </div>
                    ) : !adminEsignRequest ? (
                        <Button onClick={(e) => handleSign(e, false)} disabled={isEsigning} className="bg-blue-600 hover:bg-blue-700 text-white self-start">
                            {isEsigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Start Admin e-Sign
                        </Button>
                    ) : adminEsignRequest.status === "FAILED" || adminEsignRequest.status === "CANCELLED" || adminEsignRequest.status === "EXPIRED" ? (
                        <div className="flex items-center gap-4">
                            <span className="text-red-500 font-medium">Admin e-Sign Failed or Expired</span>
                            <Button onClick={(e) => handleSign(e, true)} disabled={isEsigning} variant="outline">
                                Retry e-Sign
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-yellow-600 font-medium">Current Status: {adminEsignRequest.status}</span>
                            <Button onClick={() => window.location.href = adminEsignRequest.signingUrl} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Resume Signing
                            </Button>
                            <Button onClick={(e) => handleSign(e, true)} disabled={isEsigning} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                Restart e-Sign
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewAgreementDetails;
