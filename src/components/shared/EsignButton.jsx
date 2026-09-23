import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { startEsign, getActiveEsign, getSignedDocument } from '@/services/esign.api';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Loader2 } from 'lucide-react';

const EsignButton = ({ channelPartnerId, onEsignComplete, hideContinueButton }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [esignRequest, setEsignRequest] = useState(null);

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

    const handleSign = async (e, forceNew = false) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            const response = await startEsign(channelPartnerId, forceNew);
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

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await getSignedDocument(esignRequest._id);

            // Check if response is actually a JSON error wrapped in a blob
            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const json = JSON.parse(text);
                throw new Error(json.message || "Failed to download signed document");
            }

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            let filename = `signed-agreement-${esignRequest._id}.pdf`;
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
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (!esignRequest) {
            return (
                <div className="flex flex-col gap-4">
                    <Button onClick={(e) => handleSign(e, false)} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white self-start">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Agreement via Aadhaar
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
                        {!hideContinueButton && (
                            <Button onClick={() => onEsignComplete && onEsignComplete(esignRequest)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Continue to Next Stage
                            </Button>
                        )}
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
                        <Button onClick={(e) => handleSign(e, true)} disabled={isLoading} variant="outline">
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
                        <Button onClick={(e) => handleSign(e, true)} disabled={isLoading} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            Restart eSign
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
