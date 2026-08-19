import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReviewChannelPartner = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for the partner being reviewed
    const mockPartner = {
        name: "Acme Associates",
        mobile: "9876543210",
        email: "contact@acme.com",
        pan: "ABCDE1234F",
        aadhaar: "123456789012",
        accountNo: "1234567890",
        ifsc: "HDFC0001234"
    };

    // State for Document Review status
    const [docs, setDocs] = useState({
        pan: { status: 'PENDING', comment: '' },
        aadhaar: { status: 'PENDING', comment: '' },
        cheque: { status: 'PENDING', comment: '' }
    });

    const [activeReject, setActiveReject] = useState(null); // which doc is being rejected
    const [tempComment, setTempComment] = useState('');

    const handleAccept = (docKey) => {
        setDocs(prev => ({ ...prev, [docKey]: { status: 'ACCEPTED', comment: '' } }));
    };

    const handleRejectClick = (docKey) => {
        setActiveReject(docKey);
        setTempComment('');
    };

    const handleConfirmReject = () => {
        if (!tempComment.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setDocs(prev => ({ 
            ...prev, 
            [activeReject]: { status: 'REJECTED', comment: tempComment } 
        }));
        setActiveReject(null);
    };

    const handleFinalize = () => {
        const hasRejected = Object.values(docs).some(d => d.status === 'REJECTED');
        const hasPending = Object.values(docs).some(d => d.status === 'PENDING');

        if (hasPending) {
            alert('Please accept or reject all documents before finalizing.');
            return;
        }

        if (hasRejected) {
            alert('Review finalized. The partner will be notified to re-upload the rejected documents.');
        } else {
            alert('Review finalized. Channel Partner is now APPROVED!');
        }
        navigate('/admin/list_channel_partner');
    };

    const renderReviewRow = (title, docKey, fileName) => {
        const docState = docs[docKey];

        return (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-4">
                <div className="flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-blue-600 underline cursor-pointer">View Document ({fileName})</p>
                    
                    {docState.status === 'REJECTED' && (
                        <p className="text-sm text-red-600 mt-1"><strong>Rejected:</strong> {docState.comment}</p>
                    )}
                    {docState.status === 'ACCEPTED' && (
                        <p className="text-sm text-green-600 mt-1 font-medium">✓ Accepted</p>
                    )}
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                    {activeReject === docKey ? (
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Reason for rejection..." 
                                value={tempComment} 
                                onChange={(e) => setTempComment(e.target.value)}
                                className="w-48 text-sm"
                            />
                            <Button size="sm" variant="destructive" onClick={handleConfirmReject}>Confirm</Button>
                            <Button size="sm" variant="ghost" onClick={() => setActiveReject(null)}>Cancel</Button>
                        </div>
                    ) : (
                        <>
                            <Button 
                                size="sm" 
                                variant={docState.status === 'ACCEPTED' ? 'default' : 'outline'} 
                                className={docState.status === 'ACCEPTED' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                onClick={() => handleAccept(docKey)}
                            >
                                {docState.status === 'ACCEPTED' ? 'Accepted' : 'Accept'}
                            </Button>
                            <Button 
                                size="sm" 
                                variant={docState.status === 'REJECTED' ? 'destructive' : 'outline'}
                                className={docState.status === 'REJECTED' ? '' : 'text-red-600 hover:text-red-700 border-red-200'}
                                onClick={() => handleRejectClick(docKey)}
                            >
                                {docState.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded shadow max-w-5xl mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-6">Review Channel Partner</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Details Summary */}
                <div className="bg-gray-50 p-4 rounded border">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Partner Details</h2>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">{mockPartner.name}</span>
                        
                        <span className="text-gray-500">Mobile:</span>
                        <span className="font-medium">{mockPartner.mobile}</span>
                        
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{mockPartner.email}</span>
                        
                        <span className="text-gray-500">PAN:</span>
                        <span className="font-medium">{mockPartner.pan}</span>
                        
                        <span className="text-gray-500">Aadhaar:</span>
                        <span className="font-medium">{mockPartner.aadhaar}</span>

                        <span className="text-gray-500">Account No:</span>
                        <span className="font-medium">{mockPartner.accountNo}</span>
                        
                        <span className="text-gray-500">IFSC:</span>
                        <span className="font-medium">{mockPartner.ifsc}</span>
                    </div>
                </div>

                {/* Documents Review */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Submitted Documents</h2>
                    <p className="text-sm text-gray-500 mb-4">Review and accept or reject the uploaded documents.</p>
                    
                    <div className="border rounded px-4">
                        {renderReviewRow("PAN Card", "pan", "pan_image.jpg")}
                        {renderReviewRow("Aadhaar Card", "aadhaar", "aadhaar_combined.pdf")}
                        {renderReviewRow("Cancelled Cheque", "cheque", "cheque_scan.png")}
                    </div>
                </div>
            </div>

            <div className="flex justify-end border-t pt-4">
                <Button onClick={handleFinalize} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Finalize Review
                </Button>
            </div>
        </div>
    );
};

export default ReviewChannelPartner;
