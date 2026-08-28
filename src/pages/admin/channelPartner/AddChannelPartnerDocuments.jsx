import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerDocuments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    
    // Document States
    const [docs, setDocs] = useState({
        pan: null,
        aadhaarFront: null,
        aadhaarBack: null,
        cancelledCheque: null
    });

    // Workflow States: 'DRAFT', 'SUBMITTED', 'REJECTED'
    const [status, setStatus] = useState('DRAFT');
    const [rejectionComment, setRejectionComment] = useState('');

    if (!previousState.accountNo) {
        navigate('/admin/add_channel_partner');
        return null;
    }

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        setDocs(prev => ({ ...prev, [docType]: file }));
    };

    const handleSubmit = () => {
        // Ensure all required docs are uploaded
        if (!docs.pan || !docs.aadhaarFront || !docs.aadhaarBack || !docs.cancelledCheque) {
            alert('Please upload all required documents.');
            return;
        }
        setStatus('SUBMITTED');
        
        // In a real app, this would hit an API and save state to DB.
    };

    const handleMockRejection = () => {
        setStatus('REJECTED');
        setRejectionComment('PAN image is blurry, please re-upload.');
    };

    const handleFinish = () => {
        // Finalize registration and go back to list
        navigate('/admin/list_channel_partner');
    };

    const isLocked = status === 'SUBMITTED';

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner</h1>
            </div>

            <ChannelPartnerStepper currentStage={6} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-bold">Document Upload</h2>
                
                {/* Developer testing toggle */}
                {status === 'SUBMITTED' && (
                    <Button variant="outline" size="sm" onClick={handleMockRejection} className="text-red-500 border-red-500">
                        Simulate Admin Rejection
                    </Button>
                )}
            </div>
            
            <p className="text-gray-600 mb-6">Upload the required documents for verification. Once submitted, documents cannot be changed unless requested by the admin.</p>

            {status === 'SUBMITTED' && (
                <Alert className="bg-blue-50 text-blue-800 border-blue-300 py-3 mb-6">
                    <span className="font-semibold">Under Review:</span> Your documents have been submitted and are currently being reviewed by the admin team. You cannot edit them at this time.
                </Alert>
            )}

            {status === 'REJECTED' && (
                <Alert className="bg-red-50 text-red-800 border-red-300 py-3 mb-6">
                    <span className="font-semibold">Changes Required:</span> The admin has rejected one or more documents. <br/>
                    <strong>Reason: </strong> {rejectionComment}
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
                    <label className="text-sm font-semibold">PAN Card <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500">Upload a clear picture of the PAN card</p>
                    <Input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={(e) => handleFileChange(e, 'pan')} 
                        disabled={isLocked}
                    />
                    {docs.pan && <span className="text-xs text-green-600">✓ File selected: {docs.pan.name}</span>}
                </div>

                <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
                    <label className="text-sm font-semibold">Aadhaar Card (Front) <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500">Upload the front side</p>
                    <Input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={(e) => handleFileChange(e, 'aadhaarFront')} 
                        disabled={isLocked}
                    />
                    {docs.aadhaarFront && <span className="text-xs text-green-600">✓ File selected: {docs.aadhaarFront.name}</span>}
                </div>

                <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
                    <label className="text-sm font-semibold">Aadhaar Card (Back) <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500">Upload the back side</p>
                    <Input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={(e) => handleFileChange(e, 'aadhaarBack')} 
                        disabled={isLocked}
                    />
                    {docs.aadhaarBack && <span className="text-xs text-green-600">✓ File selected: {docs.aadhaarBack.name}</span>}
                </div>

                <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
                    <label className="text-sm font-semibold">Cancelled Cheque <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500">Name on cheque must match the registered name</p>
                    <Input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={(e) => handleFileChange(e, 'cancelledCheque')} 
                        disabled={isLocked}
                    />
                    {docs.cancelledCheque && <span className="text-xs text-green-600">✓ File selected: {docs.cancelledCheque.name}</span>}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                {status === 'SUBMITTED' ? (
                    <Button 
                        onClick={handleFinish} 
                        className="bg-gray-800 hover:bg-black text-white px-8"
                    >
                        Return to Dashboard
                    </Button>
                ) : (
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        {status === 'REJECTED' ? 'Resubmit Documents' : 'Submit All Documents'}
                    </Button>
                )}
            </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerDocuments;
