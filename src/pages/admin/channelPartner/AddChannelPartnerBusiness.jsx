import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AddChannelPartnerBusiness = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email, pan, aadhaar } = location.state || {};

    const handleProceed = () => {
        // Here you would normally validate the business form fields before proceeding.
        // For the dummy page, we just pass the previous state forward.
        navigate('/admin/add_channel_partner_bank', { state: { mobile, email, pan, aadhaar } });
    };

    if (!pan || !aadhaar) {
        navigate('/admin/add_channel_partner');
        return null;
    }

    return (
        <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">Business Details</h1>
            <p className="text-gray-600 mb-6">Identity verified! Please complete the form below to add the channel partner's business details.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Verified PAN</label>
                    <input type="text" value={pan} disabled className="border p-2 rounded bg-gray-100 text-gray-500" />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Verified Aadhaar</label>
                    <input type="text" value={aadhaar} disabled className="border p-2 rounded bg-gray-100 text-gray-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholders for future form fields */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Partner Name</label>
                    <input type="text" placeholder="Enter partner name" className="border p-2 rounded" />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Company/Agency Name</label>
                    <input type="text" placeholder="Enter company name" className="border p-2 rounded" />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Address</label>
                    <input type="text" placeholder="Enter address" className="border p-2 rounded" />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Business Type</label>
                    <select className="border p-2 rounded bg-white">
                        <option>Select Type</option>
                        <option>Individual</option>
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Private Limited</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button onClick={handleProceed} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Proceed to Bank Verification
                </Button>
            </div>
        </div>
    );
};

export default AddChannelPartnerBusiness;
