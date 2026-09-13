import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';
import { Trash2, Download } from 'lucide-react';

const AddChannelPartnerDocuments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = previousState.channelPartnerId;
    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    const [partnerDetails, setPartnerDetails] = useState(previousState.partnerDetails || {});
    const [docs, setDocs] = useState({});
    const [status, setStatus] = useState(previousState.documentStatus || 'DRAFT');
    const [error, setError] = useState('');
    const [docStates, setDocStates] = useState(previousState.docStates || {});

    const { businessDetails, authPanDetails } = partnerDetails;
    const regType = businessDetails?.registrationType;

    const isPerson = regType === 'Individual' || regType === 'Sole Proprietorship' || regType === 'HUF';
    const hasAuthPan = authPanDetails && authPanDetails.fullName;
    const isUdyamRegistered = businessDetails?.udyam?.declarationType === "REGISTERED";
    const isGstRegistered = businessDetails?.gst?.declarationType === "REGISTERED";
    const isCompany = regType === 'Company';
    const isFirm = regType === 'Firm/LLP';

    const getRequiredDocs = () => {
        const required = ['pan', 'bankProof'];
        if (hasAuthPan) {
            required.push('authSignPan', 'authSignAadhaar', 'authSignLetter');
        }
        if (isPerson) required.push('aadhaar');
        if (isUdyamRegistered) required.push('udyamCert');
        if (isGstRegistered) required.push('gstCert', 'eInvoiceDeclaration');
        if (isCompany) required.push('coi', 'moa', 'aoa');
        if (isFirm) required.push('partnershipDeed');
        return required;
    };

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
                setPartnerDetails(cp);
                
                // Set documents status if it exists
                if (cp.documents) {
                    setStatus(cp.documents.status);
                    if (cp.documents.docStates) {
                        setDocStates(cp.documents.docStates);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch partner details", err);
            }
        };

        fetchDetails();

    }, [channelPartnerId, navigate]);

    // Initialize required docStates if they are not already populated from DB
    useEffect(() => {
        if (Object.keys(docStates).length === 0 && Object.keys(partnerDetails).length > 0) {
            const initialStates = {};
            getRequiredDocs().forEach(doc => {
                initialStates[doc] = { status: 'PENDING', remark: '' };
            });
            setDocStates(initialStates);
        }
    }, [partnerDetails, docStates]);

    const handleFileChange = (e, docKey) => {
        const file = e.target.files[0];
        if (file) {
            setDocs(prev => ({ ...prev, [docKey]: file }));
            setDocStates(prev => ({ 
                ...prev, 
                [docKey]: { ...prev[docKey], status: 'UPLOADED' } 
            }));
        }
    };

    const handleRemoveFile = (docKey) => {
        setDocs(prev => {
            const newDocs = { ...prev };
            delete newDocs[docKey];
            return newDocs;
        });
        setDocStates(prev => ({ 
            ...prev, 
            [docKey]: { ...prev[docKey], status: 'PENDING' } 
        }));
    };



    const handleSubmit = async () => {
        const requiredDocs = getRequiredDocs();
        
        // Validate all required docs are present (either newly uploaded or previously approved)
        const missing = requiredDocs.filter(doc => {
            const ds = docStates[doc];
            return !docs[doc] && (!ds || (ds.status !== 'APPROVED' && ds.status !== 'SUBMITTED' && ds.status !== 'UPLOADED'));
        });
        
        if (missing.length > 0) {
            setError(`Please upload all required documents. Missing: ${missing.join(', ')}`);
            return;
        }
        
        setError('');
        setStatus('SUBMITTING');
        
        try {
            const formData = new FormData();
            Object.keys(docs).forEach(key => {
                if (docs[key]) formData.append(key, docs[key]);
            });

            await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/documents`, formData, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            // Set local state to submitted so it locks immediately
            setStatus('SUBMITTED');
            
            const updatedStates = { ...docStates };
            Object.keys(updatedStates).forEach(key => {
                if (updatedStates[key].status !== 'APPROVED') {
                    updatedStates[key].status = 'SUBMITTED';
                }
            });
            setDocStates(updatedStates);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Upload failed.');
            setStatus('DRAFT');
        }
    };

    const isLocked = status === 'SUBMITTING';

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner - Upload Documents</h1>
            </div>

            <ChannelPartnerStepper currentStage={6} />

            <div className="mt-16 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Document Upload</h2>
                </div>

                {status === 'REJECTED' && (
                    <Alert className="bg-red-50 text-red-800 border-red-300 py-4 mb-6">
                        <span className="font-semibold block mb-1">Changes Required</span> 
                        We have found some discrepancies in your documents as per below details. Kindly reupload documents or contact your Manager.
                    </Alert>
                )}

                {error && (
                    <Alert className="bg-red-50 text-red-800 border-red-300 py-3 mb-6">
                        {error}
                    </Alert>
                )}

                <div className="bg-white border rounded shadow-sm overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f0f4f8] text-sm text-gray-700 border-b">
                            <tr>
                                <th className="p-4 w-1/3 font-semibold border-r">DOCUMENT NAME AND UPLOAD INSTRUCTIONS</th>
                                <th className="p-4 w-1/2 font-semibold border-r">UPLOAD DOCUMENT(S) <span className="text-gray-400 ml-1">ⓘ</span></th>
                                <th className="p-4 w-1/6 font-semibold">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <DocUploadRow title="PAN Card" docKey="pan" required={true} docs={docs} docState={docStates['pan']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Upload a clear picture of the PAN card." />
                            <DocUploadRow title="Cancelled Cheque / Bank Proof" docKey="bankProof" required={true} docs={docs} docState={docStates['bankProof']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Name on cheque must match the registered name." />
                            
                            {hasAuthPan && (
                                <>
                                    <DocUploadRow title="Auth Signatory PAN" docKey="authSignPan" required={true} docs={docs} docState={docStates['authSignPan']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="PAN of the authorized signatory." />
                                    <DocUploadRow title="Auth Signatory Aadhaar" docKey="authSignAadhaar" required={true} docs={docs} docState={docStates['authSignAadhaar']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Aadhaar of the authorized signatory." />
                                    <DocUploadRow title="Auth Signatory Letter" docKey="authSignLetter" required={true} docs={docs} docState={docStates['authSignLetter']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Download sample format and upload signed copy." hasSample={true} />
                                </>
                            )}
                            {isPerson && (
                                <DocUploadRow title="Aadhaar Card" docKey="aadhaar" required={true} docs={docs} docState={docStates['aadhaar']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Front and Back merged in one file." />
                            )}
                            {isUdyamRegistered && (
                                <DocUploadRow title="Udyam Certificate" docKey="udyamCert" required={true} docs={docs} docState={docStates['udyamCert']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Upload all 3 pages." />
                            )}
                            {isGstRegistered && (
                                <>
                                    <DocUploadRow title="GST Certificate" docKey="gstCert" required={true} docs={docs} docState={docStates['gstCert']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Upload all 3 pages." />
                                    <DocUploadRow title="E-invoice Applicability Declaration" docKey="eInvoiceDeclaration" required={true} docs={docs} docState={docStates['eInvoiceDeclaration']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Download sample format and upload signed copy." hasSample={true} />
                                </>
                            )}
                            {isCompany && (
                                <>
                                    <DocUploadRow title="Certificate of Incorporation" docKey="coi" required={true} docs={docs} docState={docStates['coi']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="COI Document." />
                                    <DocUploadRow title="Articles of Association" docKey="aoa" required={true} docs={docs} docState={docStates['aoa']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="AOA Document." />
                                    <DocUploadRow title="Memorandum of Association" docKey="moa" required={true} docs={docs} docState={docStates['moa']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="MOA Document." />
                                </>
                            )}
                            {isFirm && (
                                <DocUploadRow title="Firm Registration Proof" docKey="partnershipDeed" required={true} docs={docs} docState={docStates['partnershipDeed']} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} isLocked={isLocked} desc="Partnership Deed / Registration Proof." />
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-4">
                    {(status === 'SUBMITTED' || status === 'APPROVED') ? (
                        <Button 
                            onClick={() => navigate('/admin/add_channel_partner_documents_review', {
                                state: { ...previousState, partnerDetails }
                            })} 
                            className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-full"
                        >
                            Continue to Document Review
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isLocked}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                        >
                            {status === 'SUBMITTING' ? 'Submitting...' : 'Submit Documents'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const DocUploadRow = ({ title, docKey, required, docs, docState, handleFileChange, handleRemoveFile, isLocked, desc, hasSample }) => {
    const file = docs[docKey];
    const status = docState?.status || 'PENDING';
    const remark = docState?.remark;
    const isApproved = status === 'APPROVED';
    const isRejected = status === 'REJECTED';
    const isSubmitted = status === 'SUBMITTED';
    
    // Determine if input should be disabled
    // If approved or submitted, you can't change it. If global isLocked (submitting), you can't change it.
    const inputDisabled = isApproved || isSubmitted || isLocked;

    return (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-4 align-top border-r">
                <div className="font-semibold text-[15px] mb-2 flex items-center gap-2">
                    {title}{required && '*'}
                    {hasSample && <a href="#" className="text-blue-600 font-normal text-sm flex items-center gap-1 ml-2"><Download size={14}/> Download Sample</a>}
                </div>
                <div className="text-xs font-semibold text-gray-500 mb-1">DOCUMENT(S) UPLOAD INSTRUCTIONS:</div>
                <div className="text-sm text-gray-700 leading-relaxed">{desc}</div>
            </td>
            <td className="p-4 align-top border-r">
                <div className="font-medium text-sm mb-2">{title} 1</div>
                
                {/* Upload or File Info */}
                {!file && !isApproved && !isRejected && !isSubmitted ? (
                    <div className="mt-1">
                        {!inputDisabled ? (
                            <label className="cursor-pointer text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                Upload File
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf" 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, docKey)} 
                                />
                            </label>
                        ) : (
                            <div className="text-xs text-red-500 bg-red-50 p-2 rounded inline-block">
                                Upload disabled
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border rounded p-2 flex justify-between items-center text-sm">
                        <span className="truncate text-gray-600 max-w-[200px]">
                            {file ? file.name : (docState?.url ? docState.url.split('/').pop() : `${title}_Uploaded.pdf`)}
                        </span>
                        <div className="flex items-center gap-3 text-gray-500">
                            {!inputDisabled && (
                                <button onClick={() => handleRemoveFile(docKey)} className="hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            )}
                            {docState?.url ? (
                                <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin)}${docState.url}`} target="_blank" rel="noreferrer" className="hover:text-blue-500">
                                    <Download size={16} />
                                </a>
                            ) : (
                                <button className="hover:text-blue-500" onClick={(e) => { e.preventDefault(); alert("File URL not available."); }}>
                                    <Download size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Rejection Remarks */}
                {isRejected && (
                    <div className="mt-3 bg-[#fdf2f2] border border-red-200 p-3 rounded text-sm text-red-700">
                        <div className="font-semibold mb-1">Rejection Reason: {remark}</div>
                        {docState?.url && (
                            <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin)}${docState.url}`} target="_blank" rel="noreferrer" className="text-gray-600 underline text-xs mt-2 inline-block hover:text-gray-900">
                                Download Previously Uploaded File
                            </a>
                        )}
                    </div>
                )}
            </td>
            <td className="p-4 align-top text-center">
                {isRejected && (
                    <div className="inline-flex items-center gap-1 bg-[#fdf2f2] text-red-600 text-xs font-semibold px-2 py-1 rounded">
                        <span className="text-lg leading-none">×</span> Document Rejected
                    </div>
                )}
                {isApproved && (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        ✓ Approved
                    </div>
                )}
                {isSubmitted && !isApproved && !isRejected && (
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        In Review
                    </div>
                )}
            </td>
        </tr>
    );
};

export default AddChannelPartnerDocuments;
