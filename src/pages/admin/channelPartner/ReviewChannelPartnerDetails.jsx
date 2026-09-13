import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Download, Check, X, ArrowLeft } from 'lucide-react';

const ReviewChannelPartnerDetails = () => {
    const { id: routeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = routeId || previousState.channelPartnerId;
    
    const [partnerDetails, setPartnerDetails] = useState(previousState.partnerDetails || {});
    const [status, setStatus] = useState('SUBMITTED');
    const [docStates, setDocStates] = useState({});
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/review_channel_partner_documents');
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${baseURL}/channel-partners/${channelPartnerId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                
                const cp = res.data.data;
                setPartnerDetails(cp);
                
                if (cp.documents) {
                    setStatus(cp.documents.status || 'SUBMITTED');
                    if (cp.documents.docStates) {
                        setDocStates(cp.documents.docStates);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch partner details", err);
            }
        };

        fetchDetails();
    }, [channelPartnerId, navigate, baseURL]);

    const { businessDetails, authPanDetails } = partnerDetails;
    const regType = businessDetails?.registrationType;

    const isPerson = regType === 'Individual' || regType === 'Sole Proprietorship' || regType === 'HUF';
    const hasAuthPan = authPanDetails && authPanDetails.fullName;
    const isUdyamRegistered = businessDetails?.udyam?.declarationType === "REGISTERED";
    const isGstRegistered = businessDetails?.gst?.declarationType === "REGISTERED";
    const isCompany = regType === 'Company';
    const isFirm = regType === 'Firm/LLP';

    const handleReviewAction = async (docKey, actionStatus, remark) => {
        try {
            const res = await axios.post(
                `${baseURL}/channel-partners/${channelPartnerId}/documents/${docKey}/review`,
                { status: actionStatus, remark },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                }
            );

            // Update local state
            const updatedDocStates = res.data.documents.docStates;
            setDocStates(updatedDocStates);
            setStatus(res.data.documents.status);

        } catch (err) {
            console.error("Failed to update document status", err);
            alert(err.response?.data?.message || "Failed to update document status");
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow mx-auto mt-6 min-h-screen">
            <div className="flex gap-4 items-center pb-4 border-b-2 mb-6">
                <button onClick={() => navigate('/admin/review_channel_partner_documents')} className="text-gray-500 hover:text-gray-800">
                    <ArrowLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                    CP
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Review Documents: {partnerDetails?.panDetails?.fullName || 'Partner'}</h1>
                    <p className="text-sm text-gray-500">{partnerDetails?.panDetails?.panNumber}</p>
                </div>
            </div>

            <div className="mt-8 max-w-6xl mx-auto">
                {status === 'SUBMITTED' && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-300 py-4 mb-6">
                        <span className="font-semibold block mb-1">Pending Review</span> 
                        Documents have been submitted and are awaiting your review.
                    </Alert>
                )}

                {status === 'APPROVED' && (
                    <Alert className="bg-green-50 text-green-800 border-green-300 py-4 mb-6">
                        <span className="font-semibold block mb-1">Fully Approved</span> 
                        All required documents for this channel partner have been approved.
                    </Alert>
                )}

                {status === 'REJECTED' && (
                    <Alert className="bg-red-50 text-red-800 border-red-300 py-4 mb-6">
                        <span className="font-semibold block mb-1">Action Required by Partner</span> 
                        One or more documents have been rejected. The partner must re-upload them.
                    </Alert>
                )}

                <div className="bg-white border rounded shadow-sm overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f0f4f8] text-sm text-gray-700 border-b">
                            <tr>
                                <th className="p-4 w-1/4 font-semibold border-r">DOCUMENT NAME</th>
                                <th className="p-4 w-1/3 font-semibold border-r">UPLOADED DOCUMENT</th>
                                <th className="p-4 w-1/6 font-semibold border-r text-center">STATUS</th>
                                <th className="p-4 w-1/4 font-semibold text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docStates['pan'] && <DocReviewRow title="PAN Card" docKey="pan" docState={docStates['pan']} onReview={handleReviewAction} />}
                            {docStates['bankProof'] && <DocReviewRow title="Cancelled Cheque / Bank Proof" docKey="bankProof" docState={docStates['bankProof']} onReview={handleReviewAction} />}
                            
                            {hasAuthPan && (
                                <>
                                    {docStates['authSignPan'] && <DocReviewRow title="Auth Signatory PAN" docKey="authSignPan" docState={docStates['authSignPan']} onReview={handleReviewAction} />}
                                    {docStates['authSignAadhaar'] && <DocReviewRow title="Auth Signatory Aadhaar" docKey="authSignAadhaar" docState={docStates['authSignAadhaar']} onReview={handleReviewAction} />}
                                    {docStates['authSignLetter'] && <DocReviewRow title="Auth Signatory Letter" docKey="authSignLetter" docState={docStates['authSignLetter']} onReview={handleReviewAction} />}
                                </>
                            )}
                            {isPerson && docStates['aadhaar'] && (
                                <DocReviewRow title="Aadhaar Card" docKey="aadhaar" docState={docStates['aadhaar']} onReview={handleReviewAction} />
                            )}
                            {isUdyamRegistered && docStates['udyamCert'] && (
                                <DocReviewRow title="Udyam Certificate" docKey="udyamCert" docState={docStates['udyamCert']} onReview={handleReviewAction} />
                            )}
                            {isGstRegistered && (
                                <>
                                    {docStates['gstCert'] && <DocReviewRow title="GST Certificate" docKey="gstCert" docState={docStates['gstCert']} onReview={handleReviewAction} />}
                                    {docStates['eInvoiceDeclaration'] && <DocReviewRow title="E-invoice Applicability Declaration" docKey="eInvoiceDeclaration" docState={docStates['eInvoiceDeclaration']} onReview={handleReviewAction} />}
                                </>
                            )}
                            {isCompany && (
                                <>
                                    {docStates['coi'] && <DocReviewRow title="Certificate of Incorporation" docKey="coi" docState={docStates['coi']} onReview={handleReviewAction} />}
                                    {docStates['aoa'] && <DocReviewRow title="Articles of Association" docKey="aoa" docState={docStates['aoa']} onReview={handleReviewAction} />}
                                    {docStates['moa'] && <DocReviewRow title="Memorandum of Association" docKey="moa" docState={docStates['moa']} onReview={handleReviewAction} />}
                                </>
                            )}
                            {isFirm && docStates['partnershipDeed'] && (
                                <DocReviewRow title="Firm Registration Proof" docKey="partnershipDeed" docState={docStates['partnershipDeed']} onReview={handleReviewAction} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DocReviewRow = ({ title, docKey, docState, onReview }) => {
    const status = docState?.status || 'SUBMITTED';
    const isApproved = status === 'APPROVED';
    const isRejected = status === 'REJECTED';
    const [isRejecting, setIsRejecting] = useState(false);
    const [remark, setRemark] = useState(docState?.remark || '');

    const handleApprove = () => {
        setIsRejecting(false);
        onReview(docKey, 'APPROVED', '');
    };

    const handleRejectSubmit = () => {
        if (!remark.trim()) {
            alert("Please enter a rejection reason.");
            return;
        }
        onReview(docKey, 'REJECTED', remark);
        setIsRejecting(false);
    };

    return (
        <tr className="border-b bg-gray-50">
            <td className="p-4 align-top border-r">
                <div className="font-semibold text-[15px]">{title}</div>
            </td>
            <td className="p-4 align-top border-r">
                <div className="bg-white border rounded p-2 flex justify-between items-center text-sm">
                    <span className="truncate text-gray-600 max-w-[200px]">
                        {docState?.url ? docState.url.split('/').pop() : `${title}_Uploaded.pdf`}
                    </span>
                    {docState?.url ? (
                        <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${docState.url}`} target="_blank" rel="noreferrer" className="hover:text-blue-500">
                            <Download size={16} />
                        </a>
                    ) : (
                        <button className="hover:text-blue-500" onClick={(e) => { e.preventDefault(); alert("File URL not available."); }}>
                            <Download size={16} />
                        </button>
                    )}
                </div>
                {isRejected && (
                    <div className="mt-2 text-xs text-red-600 font-semibold bg-red-50 p-2 rounded">
                        Reason: {docState?.remark}
                    </div>
                )}
            </td>
            <td className="p-4 align-top text-center border-r">
                {isApproved ? (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        <Check size={14} /> Approved
                    </div>
                ) : isRejected ? (
                    <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                        <X size={14} /> Rejected
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        Pending
                    </div>
                )}
            </td>
            <td className="p-4 align-top">
                {!isRejecting ? (
                    <div className="flex gap-2 justify-center">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleApprove}
                            className={`border-green-600 text-green-600 hover:bg-green-50 ${isApproved ? 'bg-green-50' : ''}`}
                        >
                            Approve
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsRejecting(true)}
                            className={`border-red-500 text-red-500 hover:bg-red-50 ${isRejected ? 'bg-red-50' : ''}`}
                        >
                            Reject
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <textarea 
                            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            placeholder="Enter rejection reason..."
                            rows={2}
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setIsRejecting(false)}>Cancel</Button>
                            <Button variant="destructive" size="sm" onClick={handleRejectSubmit}>Submit Reject</Button>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ReviewChannelPartnerDetails;
