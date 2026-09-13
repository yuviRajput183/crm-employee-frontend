import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ViewChannelPartner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cp, setCp] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    useEffect(() => {
        const fetchCP = async () => {
            try {
                const res = await axios.get(`${baseURL}/channel-partners/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data && res.data.success) {
                    setCp(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch channel partner:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCP();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading channel partner details...</div>;
    }

    if (!cp) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Channel partner not found.</p>
                <Button onClick={() => navigate('/admin/list_channel_partner')}>Back to List</Button>
            </div>
        );
    }

    const getName = () => {
        return cp.businessDetails?.udyam?.enterpriseName 
            || cp.businessDetails?.gst?.legalName 
            || cp.panDetails?.fullName 
            || cp.aadhaarDetails?.fullName 
            || 'Unknown';
    };

    return (
        <div className="p-6 bg-white rounded shadow mx-auto mt-6 max-w-5xl">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold">Channel Partner Details: {getName()}</h1>
                <Button variant="outline" onClick={() => navigate('/admin/list_channel_partner')}>Back</Button>
            </div>

            <div className="space-y-8">
                {/* Status & Code */}
                <section className="bg-gray-50 p-4 rounded border">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Status & Code</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 font-semibold">Code</p>
                            <p className="font-medium text-gray-900">{cp.code || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-semibold">Status</p>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                cp.status === 'active' ? 'bg-green-100 text-green-800' :
                                cp.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-200 text-gray-800'
                            }`}>
                                {cp.status === 'pending_approval' ? 'Pending Approval' : 
                                 cp.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-500 font-semibold">Application Number</p>
                            <p className="text-gray-900">{cp.applicationNumber || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-semibold">Current Stage</p>
                            <p className="text-gray-900">Stage {cp.currentStage}</p>
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Mobile Number</span>
                            <span>{cp.mobile || '-'} {cp.mobileVerified && <span className="text-green-600 text-xs">(Verified)</span>}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Email Address</span>
                            <span>{cp.email || '-'} {cp.emailVerified && <span className="text-green-600 text-xs">(Verified)</span>}</span>
                        </div>
                    </div>
                </section>

                {/* PAN Info */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">PAN Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">PAN</span>
                            <span>{cp.pan || '-'} {cp.panVerified && <span className="text-green-600 text-xs">(Verified)</span>}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Full Name</span>
                            <span>{cp.panDetails?.fullName || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Category</span>
                            <span>{cp.panDetails?.category || '-'}</span>
                        </div>
                    </div>
                </section>

                {/* Aadhaar Info */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Aadhaar Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Aadhaar (Masked)</span>
                            <span>{cp.aadhaar || '-'} {cp.aadhaarVerified && <span className="text-green-600 text-xs">(Verified)</span>}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Full Name</span>
                            <span>{cp.aadhaarDetails?.fullName || '-'}</span>
                        </div>
                        <div className="flex flex-col col-span-2 md:col-span-1">
                            <span className="text-gray-500 font-semibold">Address</span>
                            <span>{cp.aadhaarDetails?.fullAddress || '-'}</span>
                        </div>
                    </div>
                </section>

                {/* Business Info */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Business Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Registration Type</span>
                            <span>{cp.businessDetails?.registrationType || '-'}</span>
                        </div>
                        {cp.businessDetails?.udyam?.verificationStatus === 'VERIFIED' && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-semibold">Udyam Enterprise Name</span>
                                    <span>{cp.businessDetails.udyam.enterpriseName || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-semibold">Udyam Reg. No</span>
                                    <span>{cp.businessDetails.udyam.udyamNumber || '-'}</span>
                                </div>
                            </>
                        )}
                        {cp.businessDetails?.gst?.verificationStatus === 'VERIFIED' && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-semibold">GST Legal Name</span>
                                    <span>{cp.businessDetails.gst.legalName || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-semibold">GSTIN</span>
                                    <span>{cp.businessDetails.gst.selectedGstin || '-'}</span>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Bank Info */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Account Number</span>
                            <span>{cp.bankDetails?.accountNumber || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">IFSC</span>
                            <span>{cp.bankDetails?.ifsc || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 font-semibold">Bank Name</span>
                            <span>{cp.bankDetails?.bankName || '-'}</span>
                        </div>
                    </div>
                </section>

                {/* Deal Info */}
                {(cp.dealType || cp.dealPercentage !== undefined) && (
                    <section>
                        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Deal & Referral Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-500 font-semibold">Deal Type</span>
                                <span>{cp.dealType || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 font-semibold">Deal Percentage</span>
                                <span>{cp.dealPercentage !== undefined ? `${cp.dealPercentage}%` : '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 font-semibold">Level 1 Referrer ID</span>
                                <span>{cp.referredByLevel1Id || '-'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 font-semibold">Balance Deal</span>
                                <span>{cp.balanceReferralDealPercentage !== undefined ? `${cp.balanceReferralDealPercentage}%` : '-'}</span>
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default ViewChannelPartner;
