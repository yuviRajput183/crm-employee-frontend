import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

const AddChannelPartnerBank = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    
    const [accountNo, setAccountNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    if (!previousState.pan) {
        navigate('/admin/add_channel_partner');
        return null;
    }

    const handleVerify = () => {
        if (!accountNo || !ifsc) {
            setError('Please enter both Account Number and IFSC Code.');
            return;
        }
        setError('');
        setIsVerifying(true);
        
        // Mock verification
        setTimeout(() => {
            if (accountNo.length >= 8 && ifsc.length === 11) {
                setIsVerified(true);
            } else {
                setError('Invalid bank details. (Hint: Account > 8 digits, IFSC = 11 chars)');
            }
            setIsVerifying(false);
        }, 1500);
    };

    const handleProceed = () => {
        if (isVerified) {
            navigate('/admin/add_channel_partner_documents', { 
                state: { ...previousState, accountNo, ifsc } 
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Bank Account Verification</h1>
            <p className="text-gray-600 mb-6">Please provide the bank details for payouts. We will verify the account via penny drop.</p>

            <div className="border p-4 rounded bg-gray-50 mb-6">
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
                {isVerified && <Alert className="bg-green-100 text-green-800 border-green-300 py-2 mt-4">✓ Bank account verified successfully (Name Matched: TEST USER)</Alert>}
            </div>

            <div className="flex justify-end">
                <Button 
                    onClick={handleProceed} 
                    disabled={!isVerified}
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                    Proceed to Document Upload
                </Button>
            </div>
        </div>
    );
};

export default AddChannelPartnerBank;
