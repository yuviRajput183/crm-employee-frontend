import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { 
    apiSendWhatsAppOtp, 
    apiVerifyWhatsAppOtp, 
    apiSendEmailOtp, 
    apiVerifyEmailOtp,
    apiGetVerificationStatus
} from '@/services/channelPartner.api';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerVerification = () => {
    const navigate = useNavigate();

    // Channel Partner Identifier
    const [channelPartnerId, setChannelPartnerId] = useState('');

    // State for Mobile Verification
    const [mobile, setMobile] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [isSendingMobile, setIsSendingMobile] = useState(false);
    const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
    
    // Timers for Mobile
    const [mobileExpiryTime, setMobileExpiryTime] = useState(null);
    const [mobileResendTime, setMobileResendTime] = useState(null);
    const [mobileExpiryTimer, setMobileExpiryTimer] = useState(0);
    const [mobileResendTimer, setMobileResendTimer] = useState(0);

    // State for Email Verification
    const [email, setEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    
    // Timers for Email
    const [emailExpiryTime, setEmailExpiryTime] = useState(null);
    const [emailResendTime, setEmailResendTime] = useState(null);
    const [emailExpiryTimer, setEmailExpiryTimer] = useState(0);
    const [emailResendTimer, setEmailResendTimer] = useState(0);

    // Global Timer Update
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();

            // Mobile Expiry
            if (mobileExpiryTime) {
                const diff = Math.max(0, Math.ceil((mobileExpiryTime - now) / 1000));
                setMobileExpiryTimer(diff);
                if (diff === 0) setMobileExpiryTime(null);
            }
            // Mobile Resend
            if (mobileResendTime) {
                const diff = Math.max(0, Math.ceil((mobileResendTime - now) / 1000));
                setMobileResendTimer(diff);
                if (diff === 0) setMobileResendTime(null);
            }

            // Email Expiry
            if (emailExpiryTime) {
                const diff = Math.max(0, Math.ceil((emailExpiryTime - now) / 1000));
                setEmailExpiryTimer(diff);
                if (diff === 0) setEmailExpiryTime(null);
            }
            // Email Resend
            if (emailResendTime) {
                const diff = Math.max(0, Math.ceil((emailResendTime - now) / 1000));
                setEmailResendTimer(diff);
                if (diff === 0) setEmailResendTime(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [mobileExpiryTime, mobileResendTime, emailExpiryTime, emailResendTime]);

    // On mobile input blur (or manual trigger), try fetching status
    const handleMobileBlur = async () => {
        if (!mobile || mobile.length < 10) return;
        try {
            const res = await apiGetVerificationStatus(mobile);
            if (res.data.success) {
                const data = res.data;
                setChannelPartnerId(data.channelPartnerId);
                setIsMobileVerified(data.mobileVerified);
                setIsEmailVerified(data.emailVerified);
                if (data.email) setEmail(data.email);

                if (data.mobileOtpExpiresAt && !data.mobileVerified) {
                    setMobileExpiryTime(new Date(data.mobileOtpExpiresAt).getTime());
                    setIsMobileOtpSent(true);
                }
                if (data.mobileResendAvailableAt && !data.mobileVerified) {
                    setMobileResendTime(new Date(data.mobileResendAvailableAt).getTime());
                }

                if (data.emailOtpExpiresAt && !data.emailVerified) {
                    setEmailExpiryTime(new Date(data.emailOtpExpiresAt).getTime());
                    setIsEmailOtpSent(true);
                }
                if (data.emailResendAvailableAt && !data.emailVerified) {
                    setEmailResendTime(new Date(data.emailResendAvailableAt).getTime());
                }

                if (data.mobileVerified) {
                    setMobileError("Mobile number recognized. Resuming Channel Partner onboarding...");
                }
            }
        } catch (error) {
            // Channel partner probably not found yet, which is fine
        }
    };

    const formatTime = (seconds) => {
        if (seconds <= 0) return "00:00";
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSendMobileOtp = async () => {
        if (!mobile || mobile.length < 10) {
            setMobileError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setMobileError('');
        setIsSendingMobile(true);
        try {
            const res = await apiSendWhatsAppOtp(mobile);
            const data = res.data;
            if (data.existingChannelPartner && data.mobileVerified) {
                setIsMobileVerified(true);
                setChannelPartnerId(data.channelPartnerId);
                if (data.emailVerified) setIsEmailVerified(true);
                setMobileError(data.message);
                return;
            }

            setIsMobileOtpSent(true);
            setChannelPartnerId(data.channelPartnerId);
            setMobileExpiryTime(new Date(data.otpExpiresAt).getTime());
            setMobileResendTime(new Date(data.resendAvailableAt).getTime());
            setMobileOtp('');
            setMobileError(''); // clear any resume messages
        } catch (error) {
            if (error.response?.data?.code === "OTP_RESEND_COOLDOWN") {
                setMobileResendTime(new Date(error.response.data.resendAvailableAt).getTime());
            }
            setMobileError(error?.response?.data?.message || 'Failed to send OTP to WhatsApp. Please try again.');
        } finally {
            setIsSendingMobile(false);
        }
    };

    const handleVerifyMobileOtp = async () => {
        if (!mobileOtp) {
            setMobileError('Please enter the OTP.');
            return;
        }
        setMobileError('');
        setIsVerifyingMobile(true);
        try {
            await apiVerifyWhatsAppOtp(mobile, mobileOtp);
            setIsMobileVerified(true);
            setMobileExpiryTime(null);
            setMobileResendTime(null);
        } catch (error) {
            setMobileError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingMobile(false);
        }
    };

    const handleSendEmailOtp = async () => {
        const re = /\S+@\S+\.\S+/;
        if (!email || !re.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        setIsSendingEmail(true);
        try {
            const res = await apiSendEmailOtp(mobile, email);
            const data = res.data;
            if (data.existingChannelPartner && data.emailVerified) {
                setIsEmailVerified(true);
                setEmailError(data.message);
                return;
            }

            setIsEmailOtpSent(true);
            setEmailExpiryTime(new Date(data.otpExpiresAt).getTime());
            setEmailResendTime(new Date(data.resendAvailableAt).getTime());
            setEmailOtp('');
        } catch (error) {
            if (error.response?.data?.code === "OTP_RESEND_COOLDOWN") {
                setEmailResendTime(new Date(error.response.data.resendAvailableAt).getTime());
            }
            setEmailError(error?.response?.data?.message || 'Failed to send OTP to Email. Please try again.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (!emailOtp) {
            setEmailError('Please enter the OTP.');
            return;
        }
        setEmailError('');
        setIsVerifyingEmail(true);
        try {
            await apiVerifyEmailOtp(mobile, email, emailOtp);
            setIsEmailVerified(true);
            setEmailExpiryTime(null);
            setEmailResendTime(null);
        } catch (error) {
            setEmailError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handleProceed = () => {
        if (isMobileVerified && isEmailVerified) {
            navigate('/admin/add_channel_partner', { state: { mobile, email, channelPartnerId } });
        }
    };

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner</h1>
            </div>

            <ChannelPartnerStepper currentStage={1} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Verify Channel Partner</h2>
                <p className="text-gray-600 mb-6">Please verify the mobile number and email address before adding a new channel partner.</p>

                <div className="flex flex-col gap-6">
                    {/* Stage 1: Mobile Verification Section */}
                    <div className="border p-4 rounded bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Stage 1: Mobile Verification</h2>
                        
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Mobile Number <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={mobile} 
                                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} 
                                        onBlur={handleMobileBlur}
                                        disabled={isMobileVerified}
                                        placeholder="Enter mobile number" 
                                        maxLength={10}
                                    />
                                    {!isMobileVerified && (
                                        <Button 
                                            onClick={handleSendMobileOtp} 
                                            disabled={isSendingMobile || mobile.length !== 10 || mobileResendTimer > 0}
                                            variant="outline"
                                        >
                                            {isSendingMobile ? 'Sending...' : (isMobileOtpSent ? 'Resend OTP' : 'Send OTP')}
                                        </Button>
                                    )}
                                </div>
                                {mobileResendTimer > 0 && !isMobileVerified && (
                                    <p className="text-xs text-gray-500 mt-1">Resend available in {formatTime(mobileResendTimer)}</p>
                                )}
                            </div>

                            {isMobileOtpSent && !isMobileVerified && (
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Enter OTP</label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={mobileOtp} 
                                            onChange={(e) => setMobileOtp(e.target.value)} 
                                            placeholder="OTP" 
                                            maxLength={6}
                                        />
                                        <Button 
                                            onClick={handleVerifyMobileOtp} 
                                            disabled={isVerifyingMobile || !mobileOtp || mobileExpiryTimer === 0}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isVerifyingMobile ? 'Verifying...' : 'Verify'}
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-sm">
                                        {mobileExpiryTimer > 0 ? (
                                            <span className="text-gray-600">OTP expires in {formatTime(mobileExpiryTimer)}</span>
                                        ) : (
                                            <span className="text-red-500">OTP expired. Please resend.</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {mobileError && <Alert className={`py-2 ${mobileError.includes('recognized') ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-red-50 text-red-800 border-red-300'}`}>{mobileError}</Alert>}
                            {isMobileVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ Mobile number verified</Alert>}
                        </div>
                    </div>

                    {/* Stage 2: Email Verification Section - Only visible if Mobile is Verified */}
                    {isMobileVerified && (
                        <div className="border p-4 rounded bg-white shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">Stage 2: Email Verification</h2>
                            
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Email Address <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="email"
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            disabled={isEmailVerified}
                                            placeholder="Enter email address" 
                                        />
                                        {!isEmailVerified && (
                                            <Button 
                                                onClick={handleSendEmailOtp} 
                                                disabled={isSendingEmail || !email || emailResendTimer > 0}
                                                variant="outline"
                                            >
                                                {isSendingEmail ? 'Sending...' : (isEmailOtpSent ? 'Resend OTP' : 'Send OTP')}
                                            </Button>
                                        )}
                                    </div>
                                    {emailResendTimer > 0 && !isEmailVerified && (
                                        <p className="text-xs text-gray-500 mt-1">Resend available in {formatTime(emailResendTimer)}</p>
                                    )}
                                </div>

                                {isEmailOtpSent && !isEmailVerified && (
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Enter OTP</label>
                                        <div className="flex gap-2">
                                            <Input 
                                                value={emailOtp} 
                                                onChange={(e) => setEmailOtp(e.target.value)} 
                                                placeholder="OTP" 
                                                maxLength={6}
                                            />
                                            <Button 
                                                onClick={handleVerifyEmailOtp} 
                                                disabled={isVerifyingEmail || !emailOtp || emailExpiryTimer === 0}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {isVerifyingEmail ? 'Verifying...' : 'Verify'}
                                            </Button>
                                        </div>
                                        <div className="mt-2 text-sm">
                                            {emailExpiryTimer > 0 ? (
                                                <span className="text-gray-600">OTP expires in {formatTime(emailExpiryTimer)}</span>
                                            ) : (
                                                <span className="text-red-500">OTP expired. Please resend.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                                {isEmailVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ Email verified</Alert>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button 
                        onClick={handleProceed} 
                        disabled={!isMobileVerified || !isEmailVerified}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        Proceed to PAN Verification
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerVerification;
