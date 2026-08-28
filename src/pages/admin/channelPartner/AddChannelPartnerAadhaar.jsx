import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { apiGetVerificationStatus, apiVerifyAadhaarAPI, apiConfirmAadhaarAPI } from '@/services/channelPartner.api';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerAadhaar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email, channelPartnerId, pan } = location.state || {};

    const [panDetails, setPanDetails] = useState(null);
    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarDetails, setAadhaarDetails] = useState(null);
    
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [isAadhaarConfirmed, setIsAadhaarConfirmed] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    
    // Manual inputs
    const [careOf, setCareOf] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [userConfirmed, setUserConfirmed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!mobile || !channelPartnerId) {
                navigate('/admin/add_channel_partner_verification');
                return;
            }
            try {
                const res = await apiGetVerificationStatus(mobile);
                const data = res.data;
                if (!data.mobileVerified || !data.emailVerified || !data.panVerified) {
                    navigate('/admin/add_channel_partner'); // Go back to PAN if incomplete
                    return;
                }
                
                setPanDetails(data.panDetails);

                if (data.aadhaarVerified) {
                    setIsAadhaarVerified(true);
                    setAadhaarDetails(data.aadhaarDetails);
                    setAadhaar(data.aadhaar || '');
                    
                    if (data.aadhaarDetails) {
                        if (data.aadhaarDetails.careOf) setCareOf(data.aadhaarDetails.careOf);
                        if (data.aadhaarDetails.fatherName) setFatherName(data.aadhaarDetails.fatherName);
                    }

                    if (data.aadhaarConfirmed) {
                        setIsAadhaarConfirmed(true);
                        setUserConfirmed(true);
                    }
                }
            } catch (err) {
                navigate('/admin/add_channel_partner_verification');
            }
        };
        checkAuth();
    }, [mobile, channelPartnerId, navigate]);

    if (!mobile || !channelPartnerId) {
        return null;
    }

    const handleVerifyAadhaar = async () => {
        if (!aadhaar || aadhaar.length !== 12) {
            setError('Please enter a valid 12-digit Aadhaar number.');
            return;
        }
        setError('');
        setIsVerifying(true);
        try {
            const res = await apiVerifyAadhaarAPI(channelPartnerId, aadhaar);
            if (res.data && res.data.success) {
                setIsAadhaarVerified(true);
                setAadhaarDetails(res.data.data);
                if (res.data.data.careOf) setCareOf(res.data.data.careOf);
                if (res.data.data.fatherName) setFatherName(res.data.data.fatherName);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Aadhaar verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConfirmAndContinue = async () => {
        if (!userConfirmed) {
            setError("Please confirm that the displayed details are correct before continuing.");
            return;
        }

        const needsCareOf = aadhaarDetails && !aadhaarDetails.careOf;
        const needsFatherName = aadhaarDetails && !aadhaarDetails.fatherName;

        if (needsCareOf && (!careOf || !careOf.trim())) {
            setError("Please enter Care of.");
            return;
        }

        if (needsFatherName && (!fatherName || !fatherName.trim())) {
            setError("Please enter Father's Name.");
            return;
        }

        setError('');
        setIsConfirming(true);

        try {
            const res = await apiConfirmAadhaarAPI(channelPartnerId, {
                confirmed: userConfirmed,
                careOf: careOf.trim(),
                fatherName: fatherName.trim()
            });

            if (res.data && res.data.success) {
                setIsAadhaarConfirmed(true);
                navigate('/admin/add_channel_partner_business', { state: { mobile, email, channelPartnerId, pan, aadhaar } });
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Aadhaar confirmation failed. Please try again.');
        } finally {
            setIsConfirming(false);
        }
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

            <ChannelPartnerStepper currentStage={3} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Aadhaar Verification</h2>
                <p className="text-gray-600 mb-6">Please enter the Aadhaar number to verify identity.</p>

                <div className="border p-4 rounded bg-white shadow-sm mb-6">
                    <h2 className="text-lg font-semibold mb-3">Aadhaar Details</h2>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Aadhaar Number <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 max-w-md">
                                <Input 
                                    value={aadhaar} 
                                    onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))} 
                                    disabled={isAadhaarVerified}
                                    placeholder="Enter Aadhaar number" 
                                    maxLength={12}
                                />
                                {!isAadhaarVerified && (
                                    <Button 
                                        onClick={handleVerifyAadhaar} 
                                        disabled={isVerifying || !aadhaar}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isVerifying ? 'Verifying...' : 'Verify'}
                                    </Button>
                                )}
                            </div>
                            {!isPerson && (
                                <p className="text-xs text-orange-600 mt-2 font-medium">
                                    * If category other than person, kindly enter Aadhaar of Authorised Signatory
                                </p>
                            )}
                        </div>

                        {error && (
                            <Alert className="bg-red-50 text-red-800 border-red-300 py-2">
                                {error}
                            </Alert>
                        )}
                        
                        {isAadhaarVerified && aadhaarDetails && (
                            <div className="mt-4 p-4 border rounded bg-gray-50">
                                <Alert className="bg-green-100 text-green-800 border-green-300 py-2 mb-4">
                                    ✓ Aadhaar Verified
                                </Alert>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Full Name:</span>
                                        <span className="font-medium">{aadhaarDetails.fullName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">Gender:</span>
                                        <span className="font-medium">{aadhaarDetails.gender || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block mb-1">DOB:</span>
                                        <span className="font-medium">
                                            {aadhaarDetails.dateOfBirth 
                                                ? new Date(aadhaarDetails.dateOfBirth).toLocaleDateString('en-GB') 
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Full Address:</span>
                                        <span className="font-medium">{aadhaarDetails.fullAddress || '-'}</span>
                                    </div>

                                    {/* Care Of Field */}
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Care of:</span>
                                        {aadhaarDetails.careOf ? (
                                            <span className="font-medium">{aadhaarDetails.careOf}</span>
                                        ) : (
                                            <Input 
                                                value={careOf}
                                                onChange={(e) => setCareOf(e.target.value)}
                                                disabled={isAadhaarConfirmed}
                                                placeholder="Enter Care of"
                                                className="max-w-md bg-white"
                                            />
                                        )}
                                    </div>

                                    {/* Father Name Field */}
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Father Name:</span>
                                        {aadhaarDetails.fatherName ? (
                                            <span className="font-medium">{aadhaarDetails.fatherName}</span>
                                        ) : (
                                            <Input 
                                                value={fatherName}
                                                onChange={(e) => setFatherName(e.target.value)}
                                                disabled={isAadhaarConfirmed}
                                                placeholder="Enter Father's Name"
                                                className="max-w-md bg-white"
                                            />
                                        )}
                                    </div>

                                    {/* Photo Field (If available) */}
                                    {aadhaarDetails.photo && (
                                        <div className="md:col-span-2 mt-2">
                                            <span className="text-gray-500 block mb-1">Photo:</span>
                                            <img src={aadhaarDetails.photo} alt="Aadhaar Verified" className="h-24 w-24 object-cover border rounded shadow-sm" />
                                        </div>
                                    )}
                                </div>
                                
                                {!isAadhaarConfirmed && (
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={userConfirmed} 
                                                onChange={(e) => setUserConfirmed(e.target.checked)}
                                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                I confirm that all the details shown above are correct and agree to use the same for the onboarding process.
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button 
                        onClick={handleConfirmAndContinue} 
                        disabled={!isAadhaarVerified || isConfirming || isAadhaarConfirmed}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        {isConfirming ? 'Confirming...' : (isAadhaarConfirmed ? 'Confirmed' : 'Confirm & Continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerAadhaar;
