import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerBank = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const { channelPartnerId } = previousState;
    
    const [accountNo, setAccountNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    
    const [bankDetails, setBankDetails] = useState(null);
    const [partnerDetails, setPartnerDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [declarationAccepted, setDeclarationAccepted] = useState(false);
    
    const [selectedAddressType, setSelectedAddressType] = useState("");

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    const [isDetailsConfirmed, setIsDetailsConfirmed] = useState(false);

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
                
                if (cp.bankDetails && cp.bankDetails.status === "success") {
                    setAccountNo(cp.bankDetails.accountNumber);
                    setIfsc(cp.bankDetails.ifsc);
                    setBankDetails(cp.bankDetails);
                    setIsVerified(true);
                    if (cp.bankDetails.detailsConfirmed) {
                        setIsDetailsConfirmed(true);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch partner details", err);
            }
        };

        fetchDetails();
    }, [channelPartnerId, navigate]);

    const handleVerify = async () => {
        if (!accountNo || !ifsc) {
            setError('Please enter both Account Number and IFSC Code.');
            return;
        }
        setError('');
        setIsVerifying(true);
        
        try {
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/bank/verify`, 
                { accountNumber: accountNo, ifsc: ifsc },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBankDetails(res.data.data.bankDetails);
            setPartnerDetails(res.data.data);
            setIsVerified(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleProceed = () => {
        if (isVerified) {
            if (isDetailsConfirmed) {
                navigate('/admin/add_channel_partner_documents', { state: { ...previousState, accountNo, ifsc, bankDetails, partnerDetails } });
            } else {
                setShowPopup(true);
            }
        }
    };

    const [isConfirming, setIsConfirming] = useState(false);

    const handlePopupContinue = async () => {
        if (declarationAccepted && selectedAddressType) {
            setIsConfirming(true);
            try {
                let addressDetails = "";
                if (selectedAddressType === 'gst') addressDetails = partnerDetails.businessDetails?.gst?.address;
                if (selectedAddressType === 'udyam') addressDetails = partnerDetails.businessDetails?.udyam?.officialAddress;
                if (selectedAddressType === 'aadhaar') addressDetails = partnerDetails.aadhaarDetails?.fullAddress;

                await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/bank/confirm-details`, 
                    { 
                        declarationAccepted: true,
                        addressSource: selectedAddressType,
                        addressDetails: addressDetails
                    },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
                );
                setIsDetailsConfirmed(true);
                setShowPopup(false);
                navigate('/admin/add_channel_partner_documents', { state: { ...previousState, accountNo, ifsc, bankDetails, partnerDetails } });
            } catch (err) {
                console.error("Failed to confirm details", err);
            } finally {
                setIsConfirming(false);
            }
        }
    };

    // Calculate derived fields for popup
    let legalName = "";
    let tradeName = "NA";
    let authSignName = "NA";
    
    const isIndividual = partnerDetails?.businessDetails?.registrationType === "Individual";
    const isUdyam = partnerDetails?.businessDetails?.udyam?.declarationType === "REGISTERED";
    const isGst = partnerDetails?.businessDetails?.gst?.declarationType === "REGISTERED";

    if (partnerDetails) {
        if (isIndividual) {
            legalName = partnerDetails.panDetails?.fullName || "";
            tradeName = "NA";
            authSignName = "NA";
        } else if (isUdyam) {
            legalName = partnerDetails.businessDetails?.udyam?.ownerName || "";
            tradeName = partnerDetails.businessDetails?.udyam?.enterpriseName || "NA";
            authSignName = partnerDetails.authPanDetails?.fullName || "NA";
        } else if (isGst) {
            legalName = partnerDetails.businessDetails?.gst?.legalName || "";
            tradeName = partnerDetails.businessDetails?.gst?.businessName || "NA";
            authSignName = partnerDetails.authPanDetails?.fullName || "NA";
        }
        
        // If Udyam didn't provide owner name, maybe GST has legal name
        if (!legalName && isGst) {
            legalName = partnerDetails.businessDetails?.gst?.legalName || "";
        }
    }

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner - Bank Verification</h1>
            </div>

            <ChannelPartnerStepper currentStage={5} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Bank Account Verification</h2>
                <p className="text-gray-600 mb-6">Please provide the bank details for payouts.</p>

                <div className="border p-4 rounded bg-white mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Account Number <span className="text-red-500">*</span></label>
                            <Input 
                                value={accountNo} 
                                onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, ''))} 
                                disabled={isVerified}
                                placeholder="Enter Account Number" 
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">IFSC Code <span className="text-red-500">*</span></label>
                            <Input 
                                value={ifsc} 
                                onChange={(e) => setIfsc(e.target.value.toUpperCase())} 
                                disabled={isVerified}
                                placeholder="e.g. HDFC0001234" 
                                maxLength={11}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        {!isVerified && (
                            <Button 
                                onClick={handleVerify} 
                                disabled={isVerifying || !accountNo || !ifsc}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify Bank Account'}
                            </Button>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    
                    {isVerified && bankDetails && (
                        <div className="mt-6 border-t pt-4">
                            <Alert className="bg-green-100 text-green-800 border-green-300 py-2 mb-4">
                                ✓ Bank account verified successfully
                            </Alert>
                            <h3 className="font-semibold mb-2 text-lg">Bank Account Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm bg-gray-50 p-4 rounded border">
                                <div><span className="font-semibold text-gray-600">Account Holder Name:</span> {bankDetails.fullName}</div>
                                <div><span className="font-semibold text-gray-600">Bank Name:</span> {bankDetails.bankName}</div>
                                <div><span className="font-semibold text-gray-600">Branch:</span> {bankDetails.branch}</div>
                                <div><span className="font-semibold text-gray-600">City:</span> {bankDetails.city}</div>
                                <div><span className="font-semibold text-gray-600">State:</span> {bankDetails.state}</div>
                                <div><span className="font-semibold text-gray-600">MICR:</span> {bankDetails.micr}</div>
                                <div className="col-span-2"><span className="font-semibold text-gray-600">Bank Address:</span> {bankDetails.address}</div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 flex justify-end">
                    <Button 
                        onClick={handleProceed} 
                        disabled={!isVerified}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        Proceed to Document Upload
                    </Button>
                </div>
            </div>

            {/* Verification Popup Overlay */}
            {showPopup && partnerDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-bold">Verify Partner Details</h2>
                            <p className="text-sm text-gray-500 mt-1">Please review and confirm the verified details before generating the agreement.</p>
                        </div>
                        
                        <div className="p-6 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600">Legal Name:</div>
                                <div className="col-span-2 font-medium">{legalName}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600">Trade Name:</div>
                                <div className="col-span-2">{tradeName}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600">Auth. Sign Name:</div>
                                <div className="col-span-2">{authSignName}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600 mt-1">Address:</div>
                                <div className="col-span-2">
                                    <select 
                                        className="w-full border rounded p-1.5 text-sm bg-white"
                                        value={selectedAddressType}
                                        onChange={(e) => setSelectedAddressType(e.target.value)}
                                    >
                                        <option value="">Select Address Source</option>
                                        {isGst && <option value="gst">GST Address</option>}
                                        {isUdyam && <option value="udyam">Udyam Address</option>}
                                        {!isGst && !isUdyam && <option value="aadhaar">Aadhaar Address</option>}
                                    </select>
                                    {selectedAddressType === 'gst' && <div className="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded">{partnerDetails.businessDetails?.gst?.address}</div>}
                                    {selectedAddressType === 'udyam' && <div className="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded">{partnerDetails.businessDetails?.udyam?.officialAddress || "Address from Udyam"}</div>}
                                    {selectedAddressType === 'aadhaar' && <div className="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded">{partnerDetails.aadhaarDetails?.fullAddress}</div>}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600">Mobile No:</div>
                                <div className="col-span-2 text-green-700 flex items-center gap-1">
                                    {partnerDetails.mobile} <span className="text-xs bg-green-100 px-1 rounded border border-green-300">Verified</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <div className="font-semibold text-gray-600">Email:</div>
                                <div className="col-span-2 text-green-700 flex items-center gap-1">
                                    {partnerDetails.email} <span className="text-xs bg-green-100 px-1 rounded border border-green-300">Verified</span>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1"
                                        checked={declarationAccepted}
                                        onChange={(e) => setDeclarationAccepted(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-blue-900">
                                        I, {legalName || "[Full Name]"} declare that all the above shown details are true and correct to the best of my knowledge and can be used for generation of connector service agreement.
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setShowPopup(false)}>
                                Back
                            </Button>
                            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePopupContinue} disabled={!declarationAccepted || !selectedAddressType || isConfirming}>
                                {isConfirming ? 'Continuing...' : 'Continue'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddChannelPartnerBank;
