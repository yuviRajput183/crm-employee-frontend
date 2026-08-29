import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { apiVerifyPan, apiGetVerificationStatus } from '@/services/channelPartner.api';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email, channelPartnerId } = location.state || {};

    const [pan, setPan] = useState('');
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [panError, setPanError] = useState('');
    const [isVerifyingPan, setIsVerifyingPan] = useState(false);
    
    const [panDetails, setPanDetails] = useState(null);

    // State for Authorised Signatory PAN Verification
    const [authPan, setAuthPan] = useState('');
    const [isAuthPanVerified, setIsAuthPanVerified] = useState(false);
    const [authPanError, setAuthPanError] = useState('');
    const [isVerifyingAuthPan, setIsVerifyingAuthPan] = useState(false);
    const [authPanDetails, setAuthPanDetails] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (!mobile || !channelPartnerId) {
                navigate('/admin/add_channel_partner_verification');
                return;
            }
            try {
                const res = await apiGetVerificationStatus(mobile);
                const { mobileVerified, emailVerified, panVerified, panDetails, authPanVerified, authPanDetails, currentStage } = res.data;
                const panFromApi = res.data.pan || res.data.panDetails?.pan || '';
                const authPanFromApi = res.data.authPan || res.data.authPanDetails?.pan || '';
                if (!mobileVerified || !emailVerified) {
                    navigate('/admin/add_channel_partner_verification');
                } else {
                    if (panVerified) {
                        setPan(panFromApi || location.state?.pan || '');
                        setIsPanVerified(true);
                        setPanDetails(panDetails);
                    }
                    if (authPanVerified) {
                        setAuthPan(authPanFromApi || location.state?.authPan || '');
                        setIsAuthPanVerified(true);
                        setAuthPanDetails(authPanDetails);
                    }
                }
            } catch (err) {
                navigate('/admin/add_channel_partner_verification');
            }
        };
        checkAuth();
    }, [mobile, channelPartnerId, navigate]);

    if (!mobile || !email || !channelPartnerId) {
        return null;
    }

    const handleVerifyPan = async () => {
        if (!pan) {
            setPanError('Please enter a PAN number.');
            return;
        }
        setPanError('');
        setIsVerifyingPan(true);
        try {
            const res = await apiVerifyPan(channelPartnerId, pan);
            if (res.data && res.data.success) {
                setIsPanVerified(true);
                setPanDetails(res.data.data);
            }
        } catch (error) {
            if (error?.response?.data?.code === "AADHAAR_NOT_LINKED") {
                setPanError(error.response.data.message);
            } else {
                setPanError(error?.response?.data?.message || 'Invalid PAN. Please try again.');
            }
        } finally {
            setIsVerifyingPan(false);
        }
    };

    const handleVerifyAuthPan = async () => {
        if (!authPan) {
            setAuthPanError('Please enter Authorised Signatory PAN number.');
            return;
        }
        setAuthPanError('');
        setIsVerifyingAuthPan(true);
        try {
            // Re-using apiVerifyPan for auth PAN verification, or just pass authPan
            // If apiVerifyPan updates the DB with this new PAN, we might need a separate API 
            // but the prompt says "fetch the information... DO NOT change current implementation".
            // Actually, if we use `apiVerifyPan(channelPartnerId, authPan)` it might overwrite the company PAN in DB?
            // "fetch the information of the Authorised Signatory"
            // If we just need to verify it and show information, we can use the same API.
            const res = await apiVerifyPan(channelPartnerId, authPan, true);
            if (res.data && res.data.success) {
                setIsAuthPanVerified(true);
                setAuthPanDetails(res.data.data);
            }
        } catch (error) {
            if (error?.response?.data?.code === "AADHAAR_NOT_LINKED") {
                setAuthPanError(error.response.data.message);
            } else {
                setAuthPanError(error?.response?.data?.message || 'Invalid PAN. Please try again.');
            }
        } finally {
            setIsVerifyingAuthPan(false);
        }
    };

    const handleProceed = () => {
        if (isPanVerified && (isPerson || isAuthPanVerified)) {
            navigate('/admin/add_channel_partner_aadhaar', { 
                state: { 
                    mobile, 
                    email, 
                    channelPartnerId, 
                    pan,
                    authPan: isAuthPanVerified ? authPan : undefined 
                } 
            });
        }
    };

    const handleBack = () => {
        navigate('/admin/add_channel_partner_verification');
    };

    const isPerson = panDetails?.category?.toUpperCase() === "PERSON" || panDetails?.category?.toUpperCase() === "INDIVIDUAL";

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner</h1>
            </div>

            <ChannelPartnerStepper currentStage={2} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">PAN Verification</h2>
                <p className="text-gray-600 mb-6">Please enter the PAN number to verify identity.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Verified Mobile Number</label>
                        <input type="text" value={mobile} disabled className="border p-2 rounded bg-gray-100 text-gray-500" />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Verified Email</label>
                        <input type="email" value={email} disabled className="border p-2 rounded bg-gray-100 text-gray-500" />
                    </div>
                </div>

                <div className="w-full">
                    <div className="border p-4 rounded bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">PAN Verification</h2>
                        
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">PAN Number <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={pan} 
                                        onChange={(e) => setPan(e.target.value.toUpperCase())} 
                                        disabled={isPanVerified}
                                        placeholder="Enter PAN number" 
                                        maxLength={10}
                                    />
                                    {!isPanVerified && (
                                        <Button 
                                            onClick={handleVerifyPan} 
                                            disabled={isVerifyingPan || !pan}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isVerifyingPan ? 'Verifying...' : 'Verify'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {panError && (
                                <Alert className="bg-red-50 text-red-800 border-red-300 py-2">
                                    {panError}
                                </Alert>
                            )}
                            
                            {isPanVerified && panDetails && (
                                <div className="mt-4 p-4 border rounded bg-gray-50">
                                    <Alert className="bg-green-100 text-green-800 border-green-300 py-2 mb-4">
                                        ✓ PAN Verified
                                    </Alert>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Full Name:</span>
                                            <span className="font-medium">{panDetails.fullName || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Category:</span>
                                            <span className="font-medium">{panDetails.category || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">First Name:</span>
                                            <span className="font-medium">{panDetails.firstName || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Middle Name:</span>
                                            <span className="font-medium">{panDetails.middleName || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Last Name:</span>
                                            <span className="font-medium">{panDetails.lastName || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Gender:</span>
                                            <span className="font-medium">{panDetails.gender || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Date of Birth:</span>
                                            <span className="font-medium">
                                                {panDetails.dateOfBirth 
                                                    ? new Date(panDetails.dateOfBirth).toLocaleDateString('en-GB') 
                                                    : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {isPerson && panDetails.aadhaarLinked && (
                                        <Alert className="bg-green-50 text-green-800 border-green-200 py-2 mt-4 text-xs">
                                            ✓ Aadhaar is linked with PAN
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {!isPerson && isPanVerified && (
                        <div className="border p-4 rounded bg-white shadow-sm mt-6">
                            <h2 className="text-lg font-semibold mb-3">Authorised Signatory PAN Verification</h2>
                            
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Signatory PAN Number <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={authPan} 
                                            onChange={(e) => setAuthPan(e.target.value.toUpperCase())} 
                                            disabled={isAuthPanVerified}
                                            placeholder="Enter Signatory PAN" 
                                            maxLength={10}
                                        />
                                        {!isAuthPanVerified && (
                                            <Button 
                                                onClick={handleVerifyAuthPan} 
                                                disabled={isVerifyingAuthPan || !authPan}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {isVerifyingAuthPan ? 'Verifying...' : 'Verify'}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {authPanError && (
                                    <Alert className="bg-red-50 text-red-800 border-red-300 py-2">
                                        {authPanError}
                                    </Alert>
                                )}
                                
                                {isAuthPanVerified && authPanDetails && (
                                    <div className="mt-4 p-4 border rounded bg-gray-50">
                                        <Alert className="bg-green-100 text-green-800 border-green-300 py-2 mb-4">
                                            ✓ Signatory PAN Verified
                                        </Alert>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Full Name:</span>
                                                <span className="font-medium">{authPanDetails.fullName || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Category:</span>
                                                <span className="font-medium">{authPanDetails.category || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">First Name:</span>
                                                <span className="font-medium">{authPanDetails.firstName || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Middle Name:</span>
                                                <span className="font-medium">{authPanDetails.middleName || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Last Name:</span>
                                                <span className="font-medium">{authPanDetails.lastName || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Gender:</span>
                                                <span className="font-medium">{authPanDetails.gender || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Date of Birth:</span>
                                                <span className="font-medium">
                                                    {authPanDetails.dateOfBirth 
                                                        ? new Date(authPanDetails.dateOfBirth).toLocaleDateString('en-GB') 
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {authPanDetails.aadhaarLinked && (
                                            <Alert className="bg-green-50 text-green-800 border-green-200 py-2 mt-4 text-xs">
                                                ✓ Aadhaar is linked with PAN
                                            </Alert>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <Button 
                        variant="outline"
                        onClick={handleBack} 
                        className="px-8"
                    >
                        Back
                    </Button>
                    <Button 
                        onClick={handleProceed} 
                        disabled={!isPanVerified || (!isPerson && !isAuthPanVerified)}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        Proceed to Aadhaar Verification
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartner;
