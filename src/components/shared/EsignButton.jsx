import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { startEsign, getActiveEsign } from '@/services/esign.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Loader2 } from 'lucide-react';

const EsignButton = ({ channelPartnerId, onEsignComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [esignRequest, setEsignRequest] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchEsignStatus = async () => {
        try {
            const response = await getActiveEsign(channelPartnerId);
            if (response.success && response.data) {
                setEsignRequest(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch eSign status:", err);
        }
    };

    useEffect(() => {
        if (channelPartnerId) {
            fetchEsignStatus();
        }
    }, [channelPartnerId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSign = async (e) => {
        e.preventDefault();
        if (!selectedFile && !esignRequest?.signingUrl) {
            setError("Please upload the agreement document first.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await startEsign(channelPartnerId, selectedFile);
            if (response.success && response.data?.signingUrl) {
                window.location.href = response.data.signingUrl;
            } else {
                setError('Failed to start eSign.');
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (e) => {
        e.preventDefault();
        if (esignRequest?.signedDocumentUrl) {
            const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : "http://localhost:4000";
            window.open(`${backendUrl}${esignRequest.signedDocumentUrl}`, "_blank");
        }
    };

    const renderContent = () => {
        if (!esignRequest) {
            return (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Agreement PDF for eSign
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                    <Button onClick={handleSign} disabled={isLoading || !selectedFile} className="bg-blue-600 hover:bg-blue-700 text-white self-start">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Upload and Sign via Aadhaar
                    </Button>
                </div>
            );
        }

        switch (esignRequest.status) {
            case "SIGNED":
                return (
                    <div className="flex gap-4 items-center">
                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                            Download Signed Agreement
                        </Button>
                        <Button onClick={() => onEsignComplete && onEsignComplete(esignRequest)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Continue to Next Stage
                        </Button>
                    </div>
                );
            case "SIGNED_PENDING_DOWNLOAD":
                return (
                    <Button disabled className="bg-gray-400 text-white">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing signed document...
                    </Button>
                );
            case "FAILED":
            case "CANCELLED":
            case "EXPIRED":
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 font-medium">eSign Failed or Expired</span>
                        <Button onClick={() => { setEsignRequest(null); setError(null); }} disabled={isLoading} variant="outline">
                            Retry eSign
                        </Button>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-600 font-medium">Status: {esignRequest.status}</span>
                        <Button onClick={() => window.location.href = esignRequest.signingUrl} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Resume Signing
                        </Button>
                        <Button onClick={fetchEsignStatus} variant="outline" size="sm">
                            Refresh Status
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-2 my-4 p-4 border rounded shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Channel Partner Agreement eSign</h3>
            {error && <Alert variant="destructive">{error}</Alert>}
            <div>{renderContent()}</div>
        </div>
    );
};

export default EsignButton;
