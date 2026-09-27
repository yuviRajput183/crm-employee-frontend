import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import ChannelPartnerStepper from './components/ChannelPartnerStepper';
import axios from 'axios';

const AddChannelPartnerCodeCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = location.state || {};
    const channelPartnerId = previousState.channelPartnerId;
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    const [eligibleReferrers, setEligibleReferrers] = useState([]);
    
    // Form state
    const [referredByLevel1, setReferredByLevel1] = useState("NONE");
    const [referredByLevel2, setReferredByLevel2] = useState(null); // Just for display
    
    const [processedDealType, setProcessedDealType] = useState("Fixed");
    const [processedDealPercentage, setProcessedDealPercentage] = useState("");
    
    const [reportedDealType, setReportedDealType] = useState("Fixed");
    const [reportedDealPercentage, setReportedDealPercentage] = useState("");

    const [referralDealProcessed, setReferralDealProcessed] = useState(null);
    const [referralDealReported, setReferralDealReported] = useState(null);
    const [referralName, setReferralName] = useState("");
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/list_channel_partner');
            return;
        }
        fetchEligibleReferrers();
    }, [channelPartnerId, navigate]);

    const fetchEligibleReferrers = async () => {
        try {
            const res = await axios.get(`${baseURL}/channel-partner-codes/eligible-referrers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                // Filter out self if present
                const filtered = res.data.data.filter(cp => cp._id !== channelPartnerId);
                setEligibleReferrers(filtered);
            }
        } catch (err) {
            console.error("Failed to fetch referrers:", err);
        }
    };

    const handleLevel1Change = async (val) => {
        setReferredByLevel1(val);
        setErrorMsg("");
        
        if (val === "NONE") {
            setReferredByLevel2(null);
            setReferralDealProcessed(null);
            setReferralDealReported(null);
            setReferralName("");
            return;
        }

        try {
            const res = await axios.get(`${baseURL}/channel-partner-codes/${val}/referral-info`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                const info = res.data.data;
                setReferredByLevel2(info.level1 ? info.level1.name : "—");
                setReferralDealProcessed(info.referralDealPercentageProcessed);
                setReferralDealReported(info.referralDealPercentageReported);
                setReferralName(info.channelPartner.name || eligibleReferrers.find(r => r._id === val)?.name);
            }
        } catch (err) {
            console.error("Failed to fetch referral info:", err);
            setErrorMsg("Failed to fetch referral details.");
        }
    };

    const parsedProcessed = parseFloat(processedDealPercentage);
    const isValidProcessed = !isNaN(parsedProcessed) && parsedProcessed >= 0;

    const parsedReported = parseFloat(reportedDealPercentage);
    const isValidReported = !isNaN(parsedReported) && parsedReported >= 0;
    
    // Balance calculation
    let processedBalanceDeal = null;
    let exceedsReferralProcessed = false;
    if (referralDealProcessed !== null && isValidProcessed) {
        if (parsedProcessed > referralDealProcessed) {
            exceedsReferralProcessed = true;
        } else if (processedDealType === "Fixed") {
            processedBalanceDeal = referralDealProcessed - parsedProcessed;
        }
    }

    let reportedBalanceDeal = null;
    let exceedsReferralReported = false;
    if (referralDealReported !== null && isValidReported) {
        if (parsedReported > referralDealReported) {
            exceedsReferralReported = true;
        } else if (reportedDealType === "Fixed") {
            reportedBalanceDeal = referralDealReported - parsedReported;
        }
    }

    const canSubmit = isValidProcessed && isValidReported && !exceedsReferralProcessed && !exceedsReferralReported && !isGenerating && !generatedData;

    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMsg("");
        try {
            const payload = {
                channelPartnerId,
                processedDealType,
                processedDealPercentage: parsedProcessed,
                reportedDealType,
                reportedDealPercentage: parsedReported
            };
            if (referredByLevel1 !== "NONE") {
                payload.referredByLevel1Id = referredByLevel1;
            }

            const res = await axios.post(`${baseURL}/channel-partner-codes`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (res.data.success) {
                setGeneratedData(res.data.data);
            }
        } catch (err) {
            console.error("Failed to generate code:", err);
            setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Failed to generate code");
        } finally {
            setIsGenerating(false);
        }
    };

    if (generatedData) {
        return (
            <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
                <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
                        ✓
                    </div>
                    <h1 className="text-2xl font-bold text-green-700">Channel Partner Code Generated Successfully</h1>
                </div>
                <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-green-50">
                    <h3 className="font-bold text-lg mb-4">Code: {generatedData.code}</h3>
                    <p className="mb-2"><strong>Channel Partner:</strong> {generatedData.channelPartnerName}</p>
                    <p className="mb-6"><strong>Status:</strong> {generatedData.status === 'active' ? 'Active' : 'Code Generated - Not Approved'}</p>
                    
                    <p className="text-sm text-green-800 font-semibold mb-6">
                        The channel partner code no. {generatedData.code} has been generated for {generatedData.channelPartnerName}.
                    </p>

                    <Button onClick={() => navigate('/admin/list_channel_partner')} className="w-full">
                        Back to List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Generate Channel Partner Code</h1>
            </div>

            <ChannelPartnerStepper currentStage={9} />

            <div className="mt-10 max-w-3xl mx-auto border p-6 rounded-lg shadow-sm">
                
                {errorMsg && (
                    <Alert className="bg-red-50 text-red-700 border-red-300 py-3 mb-6 font-semibold">
                        {errorMsg}
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Referred By (Level 1)</label>
                        <Select value={referredByLevel1} onValueChange={handleLevel1Change}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Channel Partner" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NONE">No Referral</SelectItem>
                                {eligibleReferrers.map(cp => (
                                    <SelectItem key={cp._id} value={cp._id}>{cp.name} ({cp.code})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-500">Referred By (Level 2)</label>
                        <div className="px-3 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed h-10 flex items-center">
                            {referredByLevel1 === "NONE" ? "—" : (referredByLevel2 || "—")}
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Processed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Deal Type</label>
                            <Select value={processedDealType} onValueChange={setProcessedDealType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fixed">Fixed</SelectItem>
                                    <SelectItem value="Variable">Variable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Deal (%)</label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.1" 
                                    value={processedDealPercentage} 
                                    onChange={(e) => setProcessedDealPercentage(e.target.value)} 
                                    placeholder="e.g. 7" 
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                            </div>
                        </div>
                    </div>
                    {referredByLevel1 !== "NONE" && referralDealProcessed !== null && (
                        <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 flex flex-wrap gap-6 items-center">
                            <div>
                                <span className="block text-xs font-semibold text-blue-900">Referral Deal</span>
                                <span className="text-sm font-bold text-blue-700">{referralDealProcessed}%</span>
                            </div>
                            {processedDealType === "Fixed" && processedBalanceDeal !== null && !exceedsReferralProcessed && (
                                <div>
                                    <span className="block text-xs font-semibold text-blue-900">Bal Deal</span>
                                    <span className="text-sm font-bold text-blue-700">{processedBalanceDeal.toFixed(2)}%</span>
                                </div>
                            )}
                            {exceedsReferralProcessed && (
                                <div className="text-red-600 font-semibold text-xs w-full mt-1">
                                    ⚠ Deal cannot be greater than the referral deal.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border border-gray-200 rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Reported</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Deal Type</label>
                            <Select value={reportedDealType} onValueChange={setReportedDealType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fixed">Fixed</SelectItem>
                                    <SelectItem value="Variable">Variable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Deal (%)</label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.1" 
                                    value={reportedDealPercentage} 
                                    onChange={(e) => setReportedDealPercentage(e.target.value)} 
                                    placeholder="e.g. 7" 
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                            </div>
                        </div>
                    </div>
                    {referredByLevel1 !== "NONE" && referralDealReported !== null && (
                        <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 flex flex-wrap gap-6 items-center">
                            <div>
                                <span className="block text-xs font-semibold text-blue-900">Referral Deal</span>
                                <span className="text-sm font-bold text-blue-700">{referralDealReported}%</span>
                            </div>
                            {reportedDealType === "Fixed" && reportedBalanceDeal !== null && !exceedsReferralReported && (
                                <div>
                                    <span className="block text-xs font-semibold text-blue-900">Bal Deal</span>
                                    <span className="text-sm font-bold text-blue-700">{reportedBalanceDeal.toFixed(2)}%</span>
                                </div>
                            )}
                            {exceedsReferralReported && (
                                <div className="text-red-600 font-semibold text-xs w-full mt-1">
                                    ⚠ Deal cannot be greater than the referral deal.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {referredByLevel1 !== "NONE" && (referralDealProcessed !== null || referralDealReported !== null) && 
                 isValidProcessed && isValidReported && !exceedsReferralProcessed && !exceedsReferralReported && (
                    <Alert className="bg-amber-50 text-amber-800 border-amber-300 py-3 mb-6">
                        ℹ The balance amount (if any) will be transferred to {referralName} in the system automatically at the time of payout creation.
                    </Alert>
                )}

                <div className="border-t pt-6 mt-6 flex justify-between items-center">
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/admin/add_channel_partner_agreement', { state: previousState })}
                        className="px-8"
                    >
                        Back
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={!canSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                    >
                        {isGenerating ? "Generating..." : "Generate Code"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelPartnerCodeCreation;
