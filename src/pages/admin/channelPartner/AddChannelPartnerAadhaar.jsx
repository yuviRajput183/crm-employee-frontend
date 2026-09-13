import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { apiGetVerificationStatus, apiInitAadhaarSDK, apiVerifyAadhaarAPI, apiConfirmAadhaarAPI } from '@/services/channelPartner.api';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerAadhaar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email, channelPartnerId, pan, authPan } = location.state || {};

    const [panDetails, setPanDetails] = useState(null);
    const [aadhaarDetails, setAadhaarDetails] = useState(null);
    const [aadhaar, setAadhaar] = useState('');
    
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [isAadhaarConfirmed, setIsAadhaarConfirmed] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    
    // Manual inputs
    const [careOf, setCareOf] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [isMarried, setIsMarried] = useState(null); // 'yes' or 'no'
    const [spouseName, setSpouseName] = useState('');
    const [userConfirmed, setUserConfirmed] = useState(false);
    
    const sdkInitialized = useRef(false);

    useEffect(() => {
        // Load the SDK script
        if (!document.getElementById('digiboost-sdk-script')) {
            const script = document.createElement('script');
            script.id = 'digiboost-sdk-script';
            script.src = 'https://cdn.jsdelivr.net/gh/surepassio/surepass-digiboost-web-sdk@latest/index.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

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
                        if (data.aadhaarDetails.motherName) setMotherName(data.aadhaarDetails.motherName);
                        if (data.aadhaarDetails.isMarried !== undefined) setIsMarried(data.aadhaarDetails.isMarried ? 'yes' : 'no');
                        if (data.aadhaarDetails.spouseName) setSpouseName(data.aadhaarDetails.spouseName);
                    }

                    if (data.aadhaarConfirmed) {
                        setIsAadhaarConfirmed(true);
                        setUserConfirmed(true);
                    }
                } else {
                    // Initialize SDK if not verified
                    initDigilockerSDK();
                }
            } catch (err) {
                navigate('/admin/add_channel_partner_verification');
            }
        };
        checkAuth();
        // eslint-disable-next-line
    }, [mobile, channelPartnerId, navigate]);

    const initDigilockerSDK = async () => {
        if (sdkInitialized.current) return;
        try {
            const initRes = await apiInitAadhaarSDK(channelPartnerId);
            if (initRes.data && initRes.data.success) {
                const { token } = initRes.data.data;
                
                // Wait for SDK script to load if it hasn't
                const checkInterval = setInterval(() => {
                    if (window.DigiboostSdk) {
                        clearInterval(checkInterval);
                        sdkInitialized.current = true;
                        window.DigiboostSdk({
                            gateway: "sandbox", 
                            token: token,
                            selector: "#digilocker-button",
                            style: {
                                backgroundColor: "#2196F3",
                                color: "white",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(33, 150, 243, 0.3)",
                                transition: "all 0.2s ease",
                                width: "200px"
                            },
                            onSuccess: async function(data) {
                                console.log("Digilocker success data:", data);
                                await handleVerifyAadhaar(data.client_id || data.clientId);
                            },
                            onFailure: function(err) {
                                console.log("Digilocker error:", err);
                                setError("Aadhaar verification was cancelled or failed. Please try again.");
                            }
                        });
                    }
                }, 500);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to initialize Aadhaar Verification.');
        }
    };

    if (!mobile || !channelPartnerId) {
        return null;
    }

    const handleVerifyAadhaar = async (clientId) => {
        if (!clientId) {
            setError('Client ID missing from Digilocker response.');
            return;
        }
        setError('');
        setIsVerifying(true);
        try {
            const res = await apiVerifyAadhaarAPI(channelPartnerId, clientId);
            if (res.data && res.data.success) {
                setIsAadhaarVerified(true);
                setAadhaarDetails(res.data.data);
                setAadhaar(res.data.data.aadhaar || '');
                if (res.data.data.careOf) setCareOf(res.data.data.careOf);
                if (res.data.data.fatherName) setFatherName(res.data.data.fatherName);
                if (res.data.data.motherName) setMotherName(res.data.data.motherName);
                if (res.data.data.isMarried !== undefined) setIsMarried(res.data.data.isMarried ? 'yes' : 'no');
                if (res.data.data.spouseName) setSpouseName(res.data.data.spouseName);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Aadhaar verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConfirmAndContinue = async () => {
        if (isAadhaarConfirmed) {
            navigate('/admin/add_channel_partner_business', { state: { mobile, email, channelPartnerId, pan, authPan } });
            return;
        }

        if (!userConfirmed) {
            setError("Please confirm that the displayed details are correct before continuing.");
            return;
        }

        const needsCareOf = aadhaarDetails && !aadhaarDetails.careOf;
        const needsFatherName = aadhaarDetails && !aadhaarDetails.fatherName;
        const needsMotherName = aadhaarDetails && !aadhaarDetails.motherName;

        if (needsCareOf && (!careOf || !careOf.trim())) {
            setError("Please enter Care of.");
            return;
        }

        if (needsFatherName && (!fatherName || !fatherName.trim())) {
            setError("Please enter Father's Name.");
            return;
        }

        if (needsMotherName && (!motherName || !motherName.trim())) {
            setError("Please enter Mother's Name.");
            return;
        }

        const needsIsMarried = aadhaarDetails && aadhaarDetails.isMarried === undefined;

        if (needsIsMarried && !isMarried) {
            setError("Please answer if you are married.");
            return;
        }

        if (isMarried === 'yes' && (!spouseName || !spouseName.trim())) {
            setError("Spouse Name is required when married.");
            return;
        }

        setError('');
        setIsConfirming(true);

        try {
            const res = await apiConfirmAadhaarAPI(channelPartnerId, {
                confirmed: userConfirmed,
                careOf: careOf.trim(),
                fatherName: fatherName.trim(),
                motherName: motherName.trim(),
                isMarried: isMarried === 'yes',
                spouseName: isMarried === 'yes' ? spouseName.trim() : ''
            });

            if (res.data && res.data.success) {
                setIsAadhaarConfirmed(true);
                navigate('/admin/add_channel_partner_business', { state: { mobile, email, channelPartnerId, pan, authPan } });
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
                <p className="text-gray-600 mb-6">Verify identity securely using Digilocker.</p>

                <div className="border p-4 rounded bg-white shadow-sm mb-6">
                    <h2 className="text-lg font-semibold mb-3">Aadhaar Details</h2>
                    
                    <div className="flex flex-col gap-3">
                        {!isAadhaarVerified && (
                            <div>
                                <div id="digilocker-button" className="mt-2 mb-4"></div>
                                {isVerifying && <p className="text-blue-600 text-sm mt-2">Fetching Aadhaar details from Digilocker...</p>}
                            </div>
                        )}
                        {!isPerson && !isAadhaarVerified && (
                            <p className="text-xs text-orange-600 mt-2 font-medium">
                                * If category other than person, kindly verify Aadhaar of Authorised Signatory
                            </p>
                        )}

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

                                    {/* Mother Name Field */}
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Mother Name:</span>
                                        {aadhaarDetails.motherName ? (
                                            <span className="font-medium">{aadhaarDetails.motherName}</span>
                                        ) : (
                                            <Input 
                                                value={motherName}
                                                onChange={(e) => setMotherName(e.target.value)}
                                                disabled={isAadhaarConfirmed}
                                                placeholder="Enter Mother's Name"
                                                className="max-w-md bg-white"
                                            />
                                        )}
                                    </div>

                                    {/* Are you married Field */}
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500 block mb-1">Are you married?</span>
                                        {aadhaarDetails.isMarried !== undefined ? (
                                            <span className="font-medium">{aadhaarDetails.isMarried ? 'Yes' : 'No'}</span>
                                        ) : (
                                            <div className="flex gap-4 items-center">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="isMarried"
                                                        value="yes"
                                                        checked={isMarried === 'yes'}
                                                        onChange={() => setIsMarried('yes')}
                                                        disabled={isAadhaarConfirmed}
                                                        className="w-4 h-4 text-blue-600 border-gray-300"
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="isMarried"
                                                        value="no"
                                                        checked={isMarried === 'no'}
                                                        onChange={() => setIsMarried('no')}
                                                        disabled={isAadhaarConfirmed}
                                                        className="w-4 h-4 text-blue-600 border-gray-300"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* Spouse Name Field (Only if married) */}
                                    {(aadhaarDetails.isMarried || isMarried === 'yes') && (
                                        <div className="md:col-span-2">
                                            <span className="text-gray-500 block mb-1">Spouse Name:</span>
                                            {aadhaarDetails.spouseName ? (
                                                <span className="font-medium">{aadhaarDetails.spouseName}</span>
                                            ) : (
                                                <Input 
                                                    value={spouseName}
                                                    onChange={(e) => setSpouseName(e.target.value)}
                                                    disabled={isAadhaarConfirmed}
                                                    placeholder="Enter Spouse's Name"
                                                    className="max-w-md bg-white"
                                                />
                                            )}
                                        </div>
                                    )}

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

                <div className="mt-8 flex justify-between items-center">
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/admin/add_channel_partner', { state: { mobile, email, channelPartnerId, pan, authPan } })}
                        className="px-8"
                    >
                        Back
                    </Button>
                    <Button 
                        onClick={handleConfirmAndContinue} 
                        disabled={!isAadhaarVerified || isConfirming}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        {isConfirming ? 'Confirming...' : (isAadhaarConfirmed ? 'Continue' : 'Confirm & Continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerAadhaar;
