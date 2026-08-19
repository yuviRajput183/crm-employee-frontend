import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { apiVerifyPan, apiSendAadhaarOtp, apiVerifyAadhaarOtp } from '@/services/channelPartner.api';

const AddChannelPartner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email } = location.state || {};

    // State for PAN Verification
    const [pan, setPan] = useState('');
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [panError, setPanError] = useState('');
    const [isVerifyingPan, setIsVerifyingPan] = useState(false);

    // State for Aadhaar Verification
    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarOtp, setAadhaarOtp] = useState('');
    const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [aadhaarError, setAadhaarError] = useState('');
    const [isSendingAadhaar, setIsSendingAadhaar] = useState(false);
    const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

    if (!mobile || !email) {
        navigate('/admin/add_channel_partner_verification');
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
            await apiVerifyPan(pan);
            setIsPanVerified(true);
        } catch (error) {
            setPanError(error?.response?.data?.message || 'Invalid PAN. Please try again.');
        } finally {
            setIsVerifyingPan(false);
        }
    };

    const handleSendAadhaarOtp = async () => {
        if (!aadhaar || aadhaar.length !== 12) {
            setAadhaarError('Please enter a valid 12-digit Aadhaar number.');
            return;
        }
        setAadhaarError('');
        setIsSendingAadhaar(true);
        try {
            await apiSendAadhaarOtp(aadhaar);
            setIsAadhaarOtpSent(true);
        } catch (error) {
            setAadhaarError('Failed to send OTP to Aadhaar linked mobile. Please try again.');
        } finally {
            setIsSendingAadhaar(false);
        }
    };

    const handleVerifyAadhaarOtp = async () => {
        if (!aadhaarOtp) {
            setAadhaarError('Please enter the OTP.');
            return;
        }
        setAadhaarError('');
        setIsVerifyingAadhaar(true);
        try {
            await apiVerifyAadhaarOtp(aadhaar, aadhaarOtp);
            setIsAadhaarVerified(true);
        } catch (error) {
            setAadhaarError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingAadhaar(false);
        }
    };

    const handleProceed = () => {
        if (isPanVerified && isAadhaarVerified) {
            navigate('/admin/add_channel_partner_business', { state: { mobile, email, pan, aadhaar } });
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Identity Verification</h1>
            <p className="text-gray-600 mb-6">Contact verification successful! Now, please verify the PAN and Aadhaar. (Hint: Any valid PAN like ABCDE1234F, Aadhaar: 12-digits, OTP: 123456)</p>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PAN Verification Section */}
                <div className="border p-4 rounded bg-gray-50">
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

                        {panError && <p className="text-sm text-red-500">{panError}</p>}
                        {isPanVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ PAN verified successfully</Alert>}
                    </div>
                </div>

                {/* Aadhaar Verification Section */}
                <div className="border p-4 rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">Aadhaar Verification</h2>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Aadhaar Number <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <Input 
                                    value={aadhaar} 
                                    onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))} 
                                    disabled={isAadhaarVerified}
                                    placeholder="Enter Aadhaar number" 
                                    maxLength={12}
                                />
                                {!isAadhaarVerified && (
                                    <Button 
                                        onClick={handleSendAadhaarOtp} 
                                        disabled={isSendingAadhaar || !aadhaar}
                                        variant="outline"
                                    >
                                        {isSendingAadhaar ? 'Sending...' : (isAadhaarOtpSent ? 'Resend' : 'Send OTP')}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isAadhaarOtpSent && !isAadhaarVerified && (
                            <div>
                                <label className="text-sm font-medium mb-1 block">Enter OTP</label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={aadhaarOtp} 
                                        onChange={(e) => setAadhaarOtp(e.target.value)} 
                                        placeholder="OTP" 
                                        maxLength={6}
                                    />
                                    <Button 
                                        onClick={handleVerifyAadhaarOtp} 
                                        disabled={isVerifyingAadhaar || !aadhaarOtp}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isVerifyingAadhaar ? 'Verifying...' : 'Verify'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {aadhaarError && <p className="text-sm text-red-500">{aadhaarError}</p>}
                        {isAadhaarVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ Aadhaar verified successfully</Alert>}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button 
                    onClick={handleProceed} 
                    disabled={!isPanVerified || !isAadhaarVerified}
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                    Proceed to Business Verification
                </Button>
            </div>
        </div>
    );
};

export default AddChannelPartner;
