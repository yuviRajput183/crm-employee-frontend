import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { apiSendWhatsAppOtp, apiVerifyWhatsAppOtp, apiSendEmailOtp, apiVerifyEmailOtp } from '@/services/channelPartner.api';

const AddChannelPartnerVerification = () => {
    const navigate = useNavigate();

    // State for Mobile Verification
    const [mobile, setMobile] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [isSendingMobile, setIsSendingMobile] = useState(false);
    const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);

    // State for Email Verification
    const [email, setEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

    const handleSendMobileOtp = async () => {
        if (!mobile || mobile.length < 10) {
            setMobileError('Please enter a valid mobile number.');
            return;
        }
        setMobileError('');
        setIsSendingMobile(true);
        try {
            await apiSendWhatsAppOtp(mobile);
            setIsMobileOtpSent(true);
        } catch (error) {
            setMobileError('Failed to send OTP to WhatsApp. Please try again.');
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
        } catch (error) {
            setMobileError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingMobile(false);
        }
    };

    const handleSendEmailOtp = async () => {
        if (!email || !email.includes('@')) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        setIsSendingEmail(true);
        try {
            await apiSendEmailOtp(email);
            setIsEmailOtpSent(true);
        } catch (error) {
            setEmailError('Failed to send OTP to Email. Please try again.');
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
            await apiVerifyEmailOtp(email, emailOtp);
            setIsEmailVerified(true);
        } catch (error) {
            setEmailError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handleProceed = () => {
        if (isMobileVerified && isEmailVerified) {
            // Proceed to the actual form, passing the verified data if needed
            navigate('/admin/add_channel_partner', { state: { mobile, email } });
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Verify Channel Partner</h1>
            <p className="text-gray-600 mb-6">Please verify the mobile number and email address before adding a new channel partner. (Note: use OTP "123456" for testing)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mobile Verification Section */}
                <div className="border p-4 rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">Mobile Verification (WhatsApp)</h2>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Mobile Number <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <Input 
                                    value={mobile} 
                                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} 
                                    disabled={isMobileVerified}
                                    placeholder="Enter mobile number" 
                                    maxLength={10}
                                />
                                {!isMobileVerified && (
                                    <Button 
                                        onClick={handleSendMobileOtp} 
                                        disabled={isSendingMobile || !mobile}
                                        variant="outline"
                                    >
                                        {isSendingMobile ? 'Sending...' : (isMobileOtpSent ? 'Resend' : 'Send OTP')}
                                    </Button>
                                )}
                            </div>
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
                                        disabled={isVerifyingMobile || !mobileOtp}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isVerifyingMobile ? 'Verifying...' : 'Verify'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {mobileError && <p className="text-sm text-red-500">{mobileError}</p>}
                        {isMobileVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ Mobile verified successfully</Alert>}
                    </div>
                </div>

                {/* Email Verification Section */}
                <div className="border p-4 rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">Email Verification</h2>
                    
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
                                        disabled={isSendingEmail || !email}
                                        variant="outline"
                                    >
                                        {isSendingEmail ? 'Sending...' : (isEmailOtpSent ? 'Resend' : 'Send OTP')}
                                    </Button>
                                )}
                            </div>
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
                                        disabled={isVerifyingEmail || !emailOtp}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isVerifyingEmail ? 'Verifying...' : 'Verify'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                        {isEmailVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2">✓ Email verified successfully</Alert>}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button 
                    onClick={handleProceed} 
                    disabled={!isMobileVerified || !isEmailVerified}
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                    Proceed to Add Partner
                </Button>
            </div>
        </div>
    );
};

export default AddChannelPartnerVerification;
