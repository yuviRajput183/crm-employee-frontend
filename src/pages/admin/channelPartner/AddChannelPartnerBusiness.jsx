import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import ChannelPartnerStepper from './components/ChannelPartnerStepper';

const AddChannelPartnerBusiness = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mobile, email, pan, aadhaar, channelPartnerId } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const [businessState, setBusinessState] = useState({});
    const [applicantName, setApplicantName] = useState("");
    
    // Form Inputs
    const [registrationType, setRegistrationType] = useState("");
    const [firmName, setFirmName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [udyamNumberInput, setUdyamNumberInput] = useState("");
    const [mobileNumberInput, setMobileNumberInput] = useState("");
    const [udyamClientId, setUdyamClientId] = useState("");
    const [udyamOtpInput, setUdyamOtpInput] = useState("");
    const [udyamOtpSent, setUdyamOtpSent] = useState(false);
    const [selectedUnitIndex, setSelectedUnitIndex] = useState("");
    const [gstinInput, setGstinInput] = useState("");
    
    // Declarations
    const [udyamDeclarationAccepted, setUdyamDeclarationAccepted] = useState(false);
    const [gstDeclarationAccepted, setGstDeclarationAccepted] = useState(false);

    useEffect(() => {
        if (!channelPartnerId) {
            navigate('/admin/list_channel_partner');
            return;
        }
        fetchState();
    }, [channelPartnerId]);

const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1');

    const fetchState = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/channel-partners/${channelPartnerId}/business`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true
            });
            setBusinessState(res.data.businessDetails || {});
            setApplicantName(res.data.aadhaar || "Applicant");
            if (res.data.businessDetails?.registrationType) {
                setRegistrationType(res.data.businessDetails.registrationType);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSetRegistrationType = async () => {
        if (!registrationType) return setError("Please select a registration type");
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/registration-type`, 
                { registrationType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
            // Auto-trigger Udyam check in background as soon as registration type is selected
            checkUdyamPan(); 
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setActionLoading(false);
        } 
    };

    const checkUdyamPan = async () => {
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/udyam/pan-check`, 
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const handleUdyamInput = (e) => {
        // Enforce upper case for UX
        setUdyamNumberInput(e.target.value.toUpperCase());
    };

    const sendUdyamOtp = async () => {
        if (!udyamNumberInput) return setError("Please enter Udyam Number");
        if (!mobileNumberInput) return setError("Please enter Mobile Number");
        
        // Frontend format validation
        const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
        if (!udyamRegex.test(udyamNumberInput)) {
            return setError("Invalid Udyam Number format. Example: UDYAM-XX-00-0000000");
        }

        try {
            setActionLoading(true); setError(null);
            
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/udyam/send-otp`, 
                { udyamNumber: udyamNumberInput, mobileNumber: mobileNumberInput },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            const clientId = res.data.result.data.client_id;
            setUdyamClientId(clientId);
            
            setUdyamOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const verifyUdyamOtpSubmit = async () => {
        if (!udyamOtpInput) return setError("Please enter OTP");
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/udyam/verify`, 
                { clientId: udyamClientId, otp: udyamOtpInput },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const acceptUdyamDeclaration = async (type) => {
        // if (!firmName || !capacity) return setError("Please enter Firm Name and Capacity before accepting the declaration.");
        if (!udyamDeclarationAccepted) return setError("Please accept the declaration to continue.");
        
        let selectedUnit = null;
        if (type === "REGISTERED" && businessState?.udyam?.units?.length > 1) {
            if (selectedUnitIndex === "") return setError("Please select a unit.");
            selectedUnit = businessState.udyam.units[selectedUnitIndex];
        } else if (type === "REGISTERED" && businessState?.udyam?.units?.length === 1) {
            selectedUnit = businessState.udyam.units[0];
        }

        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/udyam/declaration`, 
                { type, selectedUnit },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const checkGstPan = async () => {
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/gst/pan-check`, 
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const verifyGst = async (gstin) => {
        if (!gstin) return setError("Please select/enter GSTIN");
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/gst/verify`, 
                { gstin },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    const acceptGstDeclaration = async (type) => {
        // if (!firmName || !capacity) return setError("Please ensure Firm Name and Capacity are filled.");
        if (!gstDeclarationAccepted) return setError("Please accept the declaration to continue.");
        try {
            setActionLoading(true); setError(null);
            const res = await axios.post(`${baseURL}/channel-partners/${channelPartnerId}/business/gst/declaration`, 
                { type },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
            );
            setBusinessState(res.data.businessDetails);
            // Workflow complete, move to Bank
            navigate('/admin/add_channel_partner_bank', { state: { mobile, email, pan, aadhaar, channelPartnerId } });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally { setActionLoading(false); }
    };

    if (loading) return <div className="p-10 text-center">Loading Verification State...</div>;

    const { registrationType: regType, udyam, gst } = businessState;
    const isUdyamComplete = udyam?.declarationAccepted;
    const isGstComplete = gst?.declarationAccepted;

    return (
        <div className="px-6 py-6 bg-white rounded shadow min-h-screen">
            <div className="flex gap-2 items-center pb-4 border-b-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    CP
                </div>
                <h1 className="text-2xl font-bold">Add Channel Partner - Business Verification</h1>
            </div>

            <ChannelPartnerStepper currentStage={4} />

            <div className="mt-16 bg-gray-50 p-6 rounded shadow border max-w-4xl mx-auto space-y-6">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

                {/* STEP 1: Registration Type */}
                {!regType ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Registration Type</h2>
                        <select 
                            className="border p-2 rounded bg-white w-full max-w-sm mb-4"
                            value={registrationType}
                            onChange={(e) => setRegistrationType(e.target.value)}
                        >
                            <option value="">Select Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                            <option value="Firm/LLP">Firm/LLP</option>
                            <option value="Company">Company</option>
                            <option value="HUF">HUF</option>
                        </select>
                        <br />
                        <Button disabled={actionLoading} onClick={handleSetRegistrationType}>Continue</Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center bg-gray-200 p-3 rounded">
                        <span><strong>Registration Type:</strong> {regType}</span>
                        {!isUdyamComplete && <span className="text-sm text-green-600">Saved</span>}
                    </div>
                )}

                {/* Dynamic Information Block (required for declarations) */}
                {/* {regType && (!isUdyamComplete || !isGstComplete) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border rounded">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Full Name of Firm <span className="text-red-500">*</span></label>
                            <input type="text" value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="e.g. ABC Pvt Ltd" className="border p-2 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Capacity <span className="text-red-500">*</span></label>
                            <select value={capacity} onChange={e => setCapacity(e.target.value)} className="border p-2 rounded bg-white">
                                <option value="">Select Capacity</option>
                                <option value="Self">Self</option>
                                <option value="Authorized Signatory">Authorized Signatory</option>
                            </select>
                        </div>
                    </div>
                )} */}

                {/* STEP 2: Udyam Verification */}
                {regType && !isUdyamComplete && (
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-semibold mb-4">Udyam Verification</h2>
                        
                        {!udyam?.panCheckStatus || udyam.panCheckStatus === "PENDING" ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Initiating background Udyam check for the registered PAN...</p>
                                <Button disabled={actionLoading} onClick={checkUdyamPan}>Check Udyam by PAN</Button>
                            </div>
                        ) : udyam.panCheckStatus === "NOT_FOUND" ? (
                            <div className="space-y-4">
                                <div className="text-red-600 font-semibold flex items-center gap-2">
                                    <span>❌</span> Udyam registration not found for the given PAN.
                                </div>
                                <div className="p-4 bg-white border rounded">
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" className="mt-1 cursor-pointer" checked={udyamDeclarationAccepted} onChange={e => setUdyamDeclarationAccepted(e.target.checked)} />
                                        <span className="text-sm text-gray-700">
                                            I, <strong>{applicantName}</strong>, the applicant, in the capacity of <strong>{capacity || '[Capacity]'}</strong> of <strong>{firmName || '[Firm Name]'}</strong> confirms that I/We are not registered as Micro or Small or Medium Enterprise under the Micro, Small and Medium Enterprises Development Act, 2006. In case of any change in the registration status it will be my/our responsibility to inform you of the same immediately.
                                        </span>
                                    </label>
                                </div>
                                <Button disabled={actionLoading} onClick={() => acceptUdyamDeclaration("NOT_REGISTERED")}>Accept & Continue to GST Details</Button>
                            </div>
                        ) : udyam.panCheckStatus === "FOUND" && udyam.verificationStatus !== "VERIFIED" ? (
                            <div className="space-y-4">
                                <div className="text-green-600 font-semibold flex items-center gap-2">
                                    <span>✅</span> Udyam registration exists for the given PAN.
                                </div>
                                <p className="text-sm font-medium">Please enter Udyam No. and Mobile No.</p>
                                <div className="flex gap-2 mb-4 flex-col sm:flex-row">
                                    <input 
                                        type="text" 
                                        className="border p-2 rounded bg-white w-full max-w-sm uppercase" 
                                        placeholder="UDYAM-XX-00-0000000"
                                        value={udyamNumberInput}
                                        onChange={handleUdyamInput}
                                        disabled={udyamOtpSent}
                                    />
                                    <input 
                                        type="text" 
                                        className="border p-2 rounded bg-white w-full max-w-sm" 
                                        placeholder="Mobile Number"
                                        value={mobileNumberInput}
                                        onChange={(e) => setMobileNumberInput(e.target.value)}
                                        disabled={udyamOtpSent}
                                    />
                                    {!udyamOtpSent && (
                                        <Button disabled={actionLoading} onClick={sendUdyamOtp}>Send OTP</Button>
                                    )}
                                </div>
                                {udyamOtpSent && (
                                    <>
                                        <p className="text-sm font-medium text-green-600">OTP Sent successfully.</p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                className="border p-2 rounded bg-white w-full max-w-sm" 
                                                placeholder="Enter OTP"
                                                value={udyamOtpInput}
                                                onChange={(e) => setUdyamOtpInput(e.target.value)}
                                            />
                                            <Button disabled={actionLoading} onClick={verifyUdyamOtpSubmit}>Verify OTP</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : udyam.verificationStatus === "VERIFIED" ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 border rounded">
                                    <h3 className="font-semibold mb-2">Udyam Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                                        <div><strong>Type of Enterprise:</strong> {udyam.enterpriseType}</div>
                                        <div><strong>Major Activity:</strong> {udyam.majorActivity}</div>
                                        <div><strong>Type of Organisation:</strong> {udyam.organisationType}</div>
                                        <div><strong>Enterprise Name:</strong> {udyam.enterpriseName}</div>
                                        <div><strong>Owner Name:</strong> {udyam.ownerName}</div>
                                        <div><strong>Date of Incorporation:</strong> {udyam.dateOfIncorporation}</div>
                                        <div className="col-span-1 sm:col-span-2"><strong>Official Address:</strong> {udyam.officialAddress}</div>
                                        <div><strong>Registration Date:</strong> {udyam.registrationDate}</div>
                                        <div><strong>Last Updated Date:</strong> {udyam.lastUpdatedDate}</div>
                                        {udyam.certificateDocument?.url && (
                                            <div className="col-span-1 sm:col-span-2 mt-2">
                                                <strong>Certificate:</strong> <a href={udyam.certificateDocument.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View/Download Document</a>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {udyam?.units?.length > 1 && (
                                        <div className="mt-4 border-t pt-4 border-green-200">
                                            <label className="text-sm font-medium block mb-2">Select Unit <span className="text-red-500">*</span></label>
                                            <Select value={selectedUnitIndex} onValueChange={setSelectedUnitIndex}>
                                                <SelectTrigger className="w-full max-w-sm bg-white border p-2 rounded h-auto">
                                                    <SelectValue placeholder="Select Unit" />
                                                </SelectTrigger>
                                                <SelectContent className="max-w-[90vw] !overflow-x-auto">
                                                    {udyam.units.map((u, i) => {
                                                        const name = u.unit_name || u.name || `Unit ${i+1}`;
                                                        const addressParts = [u.flat, u.building, u.village_town, u.block, u.road, u.city, u.district, u.state, u.pin].filter(part => part && part !== 'null' && part !== '').join(', ');
                                                        const address = u.address || u.official_address || addressParts || 'Address not provided';
                                                        return (
                                                            <SelectItem key={i} value={String(i)} className="whitespace-nowrap pr-6">
                                                                {name} - {address}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-white border rounded">
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" className="mt-1 cursor-pointer" checked={udyamDeclarationAccepted} onChange={e => setUdyamDeclarationAccepted(e.target.checked)} />
                                        <span className="text-sm text-gray-700">
                                            I, <strong>{applicantName}</strong>, the applicant, in the capacity of <strong>{capacity || '[Capacity]'}</strong> of <strong>{firmName || '[Firm Name]'}</strong> confirms that I/We are registered as Micro or Small or Medium Enterprise under the Micro, Small and Medium Enterprises Development Act, 2006 via registration number <strong>{udyam.udyamNumber || udyamNumberInput}</strong>. In case of any change in the registration status it will be my/our responsibility to inform you of the same immediately.
                                        </span>
                                    </label>
                                </div>
                                <Button disabled={actionLoading} onClick={() => acceptUdyamDeclaration("REGISTERED")}>Accept & Continue to GST Details</Button>
                            </div>
                        ) : null}
                    </div>
                )}
                
                {isUdyamComplete && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-200 p-3 rounded">
                            <span><strong>Udyam:</strong> {udyam.declarationType === "REGISTERED" ? 'Verified & Accepted' : 'Not Registered (Accepted)'}</span>
                        </div>
                        {udyam.declarationType === "REGISTERED" && (
                            <div className="bg-green-50 p-4 border rounded">
                                <h3 className="font-semibold mb-2">Udyam Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div><strong>Type of Enterprise:</strong> {udyam.enterpriseType}</div>
                                    <div><strong>Major Activity:</strong> {udyam.majorActivity}</div>
                                    <div><strong>Type of Organisation:</strong> {udyam.organisationType}</div>
                                    <div><strong>Enterprise Name:</strong> {udyam.enterpriseName}</div>
                                    <div><strong>Owner Name:</strong> {udyam.ownerName}</div>
                                    <div><strong>Date of Incorporation:</strong> {udyam.dateOfIncorporation}</div>
                                    <div className="col-span-1 sm:col-span-2"><strong>Official Address:</strong> {udyam.officialAddress}</div>
                                    <div><strong>Registration Date:</strong> {udyam.registrationDate}</div>
                                    <div><strong>Last Updated Date:</strong> {udyam.lastUpdatedDate}</div>
                                    {udyam.selectedUnit && (() => {
                                        const u = udyam.selectedUnit;
                                        const addressParts = [u.flat, u.building, u.village_town, u.block, u.road, u.city, u.district, u.state, u.pin].filter(part => part && part !== 'null' && part !== '').join(', ');
                                        const address = u.address || u.official_address || addressParts || 'Address not provided';
                                        return (
                                            <div className="col-span-1 sm:col-span-2 border-t pt-2 mt-2">
                                                <strong>Selected Unit:</strong> {u.unit_name || u.name || 'Unit'} - {address}
                                            </div>
                                        );
                                    })()}
                                    {udyam.certificateDocument?.url && (
                                        <div className="col-span-1 sm:col-span-2 mt-2">
                                            <strong>Certificate:</strong> <a href={udyam.certificateDocument.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View/Download Document</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: GST Verification */}
                {isUdyamComplete && !isGstComplete && (
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-semibold mb-4">GST Verification</h2>
                        
                        {!gst?.panCheckStatus || gst.panCheckStatus === "PENDING" ? (
                            <Button disabled={actionLoading} onClick={checkGstPan}>Check GST by PAN</Button>
                        ) : gst.panCheckStatus === "NOT_FOUND" ? (
                            <div className="space-y-4">
                                <div className="text-red-600 font-semibold flex items-center gap-2">
                                    <span>❌</span> GSTIN not found on the given PAN.
                                </div>
                                <div className="p-4 bg-white border rounded">
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" className="mt-1 cursor-pointer" checked={gstDeclarationAccepted} onChange={e => setGstDeclarationAccepted(e.target.checked)} />
                                        <span className="text-sm text-gray-700">
                                            I, <strong>{applicantName}</strong> the applicant, in the capacity of <strong>{capacity || '[Capacity]'}</strong> of <strong>{firmName || '[Firm Name]'}</strong> confirms that I/We are not registered under Good and Services Tax, 2017. In case of any change in the registration status it will be my/our responsibility to inform you of the same immediately.
                                        </span>
                                    </label>
                                </div>
                                <Button disabled={actionLoading} onClick={() => acceptGstDeclaration("NOT_REGISTERED")}>Accept & Complete Verification</Button>
                            </div>
                        ) : gst.panCheckStatus === "FOUND" && gst.verificationStatus !== "VERIFIED" ? (
                            <div className="space-y-4">
                                <div className="text-green-600 font-semibold flex items-center gap-2">
                                    <span>✅</span> GSTIN registered on the given PAN.
                                </div>
                                {gst.gstins?.length > 0 && (
                                    <div className="flex gap-2">
                                        <select 
                                            className="border p-2 rounded bg-white w-full max-w-sm"
                                            onChange={(e) => setGstinInput(e.target.value)}
                                            value={gstinInput}
                                        >
                                            <option value="">Select GSTIN</option>
                                            {gst.gstins.map(g => {
                                                const val = typeof g === 'string' ? g : g.gstin;
                                                const label = typeof g === 'string' ? g : `${g.gstin} (${g.state} - ${g.active_status})`;
                                                return <option key={val} value={val}>{label}</option>
                                            })}
                                        </select>
                                        <Button disabled={actionLoading} onClick={() => verifyGst(gstinInput)}>Verify GST</Button>
                                    </div>
                                )}
                            </div>
                        ) : gst.verificationStatus === "VERIFIED" ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 border rounded">
                                    <h3 className="font-semibold mb-2">GST Details</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><strong>Legal Name:</strong> {gst.legalName}</div>
                                        <div><strong>Business Name:</strong> {gst.businessName}</div>
                                        <div><strong>Constitution of Business:</strong> {gst.constitutionOfBusiness}</div>
                                        <div><strong>Date of Registration:</strong> {gst.dateOfRegistration}</div>
                                        <div><strong>Taxpayer Type:</strong> {gst.taxpayerType}</div>
                                        <div><strong>GSTIN Status:</strong> <span className={gst.gstinStatus === 'Active' ? 'text-green-600' : 'text-red-600 font-bold'}>{gst.gstinStatus === 'Active' ? 'Active' : `${gst.gstinStatus} (GST not registered vendor)`}</span></div>
                                        <div className="col-span-2"><strong>Address:</strong> {gst.address}</div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-white border rounded">
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" className="mt-1 cursor-pointer" checked={gstDeclarationAccepted} onChange={e => setGstDeclarationAccepted(e.target.checked)} />
                                        <span className="text-sm text-gray-700">
                                            {gst.gstRegistered 
                                                ? <span>I, <strong>{applicantName}</strong> the applicant, in the capacity of <strong>{capacity || '[Capacity]'}</strong> of <strong>{firmName || '[Firm Name]'}</strong> confirms that I/We are registered under Good and Services Tax, 2017 via registration number <strong>{gst.selectedGstin}</strong>. In case of any change in the registration status it will be my/our responsibility to inform you of the same immediately.</span>
                                                : <span>I, <strong>{applicantName}</strong> the applicant, in the capacity of <strong>{capacity || '[Capacity]'}</strong> of <strong>{firmName || '[Firm Name]'}</strong> confirms that I/We are not registered under Good and Services Tax, 2017. In case of any change in the registration status it will be my/our responsibility to inform you of the same immediately.</span>
                                            }
                                        </span>
                                    </label>
                                </div>
                                <Button disabled={actionLoading} onClick={() => acceptGstDeclaration(gst.gstRegistered ? "REGISTERED" : "NOT_REGISTERED")}>
                                    Accept & Complete Verification
                                </Button>
                            </div>
                        ) : null}
                    </div>
                )}
                
                {isGstComplete && (
                    <div className="space-y-4">
                        {gst.gstRegistered && (
                            <div className="bg-green-50 p-4 border rounded">
                                <h3 className="font-semibold mb-2">GST Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div><strong>Legal Name:</strong> {gst.legalName}</div>
                                    <div><strong>Business Name:</strong> {gst.businessName}</div>
                                    <div><strong>Constitution of Business:</strong> {gst.constitutionOfBusiness}</div>
                                    <div><strong>Date of Registration:</strong> {gst.dateOfRegistration}</div>
                                    <div><strong>Taxpayer Type:</strong> {gst.taxpayerType}</div>
                                    <div><strong>GSTIN Status:</strong> <span className={gst.gstinStatus === 'Active' ? 'text-green-600' : 'text-red-600 font-bold'}>{gst.gstinStatus === 'Active' ? 'Active' : `${gst.gstinStatus} (GST not registered vendor)`}</span></div>
                                    <div className="col-span-1 sm:col-span-2"><strong>Address:</strong> {gst.address}</div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center bg-green-100 p-3 rounded border border-green-300">
                            <span className="text-green-800 font-semibold">Business Verification Completed Successfully!</span>
                            <Button onClick={() => navigate('/admin/add_channel_partner_bank', { state: { mobile, email, pan, aadhaar, channelPartnerId } })}>
                                Proceed to Bank Verification
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddChannelPartnerBusiness;
