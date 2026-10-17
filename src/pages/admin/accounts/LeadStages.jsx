import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLoader from '@/components/loaders/PageLoader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { apiGetCitiesByStateName } from '@/services/city.api';
import { useQuery } from '@tanstack/react-query';
import CaseSearch from '../caseSearch/CaseSearch';

const inProgressStages = [
  "Banker & Case Location Details",
  "Confirmation",
  "Case Search"
];

const allStages = [
  "Banker & Case Location Details",
  "Confirmation",
  "Case Search",
  "Case Reporting",
  "SP Invoices",
  "Receipts",
  "CP Payouts",
  "Payments"
];

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const LeadStages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(1);

  const isReportedLead = !!(
    lead?.bundleId ||
    lead?.reportedAt ||
    lead?.status === 'Reported' ||
    currentStage > 3 ||
    (lead?.stageNumber || 1) > 3
  );
  const stages = isReportedLead ? allStages : inProgressStages;

  const [selectedState, setSelectedState] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [bankersList, setBankersList] = useState([]);

  const [formData, setFormData] = useState({
    stateName: '',
    cityId: '',
    bankerId: '',
    confirmationReceived: '',
    reportedPayoutPercentageSame: 'Yes',
    reportedPayoutPercentage: '',
    totalPayoutAmount: '',
    reportedThrough: '',
    invoiceType: '',
    calculationSameAsReported: '',
    roundOffDifference: '',
    remainingAmountWillCome: '',
    remainingTrancheAmount: '',
    calculatedCPPercent: 0,
    calculatedCPAmount: 0,
    calculatedSelfPercent: 0,
    calculatedSelfAmount: 0,
    rawCalc: null
  });

  const isCP = (lead?.reportedThrough || formData?.reportedThrough) === 'Channel Partner';
 const reportedTotalAmt = Number(lead?.totalPayoutAmount || formData?.totalPayoutAmount) || 0;
  const calculatedTotalAmt = isCP ? (Number(formData?.calculatedCPAmount) || 0) : (Number(formData?.calculatedSelfAmount) || 0);
  const remainingDifference = Math.max(0, Number((reportedTotalAmt - calculatedTotalAmt).toFixed(2)));

  const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/lead-stages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const fetchedLead = res.data.data;
        setLead(fetchedLead);
        setCurrentStage(fetchedLead.stageNumber || 1);
        
        // Pre-fill Stage 1 and Stage 2 data if available
        setFormData(prev => {
          let updated = { ...prev };
          if (fetchedLead.bankerCaseLocationDetailsId) {
            const b = fetchedLead.bankerCaseLocationDetailsId;
            updated.stateName = b.stateName || '';
            updated.cityId = b.cityId || '';
            updated.bankerId = b.bankerId || '';
            
            // Trigger fetches for pre-filled cascade
            if (b.stateName) {
              setSelectedState(b.stateName);
            }
            if (b.cityId) {
              fetchBankers(b.cityId, b.stateName);
            }
          }
          if (fetchedLead.confirmationStageId) {
            const c = fetchedLead.confirmationStageId;
            updated.confirmationReceived = c.confirmationReceived || '';
            if (c.confirmationReceived === 'No') {
               const knownReasons = ['Already Found in Bank Dump/MIS', 'Processed by Self'];
               if (knownReasons.includes(c.reason)) {
                 updated.reasonOption = c.reason;
               } else if (c.reason) {
                 updated.reasonOption = 'Others';
                 updated.customReason = c.reason;
               }
            } else if (c.confirmationReceived === 'Yes') {
               updated.hasConfirmationFiles = !!(c.pdf && c.eml);
               updated.pdfPath = c.pdf || '';
               updated.emlPath = c.eml || '';
            }
          }
          
          // Pre-fill Stage 4 default values from the lead model
          const origPct = fetchedLead.originalReportedPayoutPercentage !== undefined && fetchedLead.originalReportedPayoutPercentage !== null
            ? fetchedLead.originalReportedPayoutPercentage
            : (fetchedLead.reportedPayoutPercentage ?? '');
          const origAmt = fetchedLead.originalTotalPayoutAmount !== undefined && fetchedLead.originalTotalPayoutAmount !== null
            ? fetchedLead.originalTotalPayoutAmount
            : (fetchedLead.totalPayoutAmount ?? '');

          updated.reportedPayoutPercentageSame = fetchedLead.reportedPayoutPercentageSame || 'Yes';
          
          if (updated.reportedPayoutPercentageSame === 'Yes') {
            updated.reportedPayoutPercentage = origPct;
            updated.totalPayoutAmount = origAmt;
          } else {
            updated.reportedPayoutPercentage = fetchedLead.reportedPayoutPercentage !== undefined && fetchedLead.reportedPayoutPercentage !== null ? fetchedLead.reportedPayoutPercentage : origPct;
            updated.totalPayoutAmount = fetchedLead.totalPayoutAmount !== undefined && fetchedLead.totalPayoutAmount !== null ? fetchedLead.totalPayoutAmount : origAmt;
          }

          if (fetchedLead.reportedThrough) {
             updated.reportedThrough = fetchedLead.reportedThrough;
          } else {
             updated.reportedThrough = fetchedLead.channelPartner1 ? 'Channel Partner' : 'Self';
          }

          // Stage 5 auto-selections
          if (["CASE_FOUND", "Ready to report", "Invoiced", "Reported"].includes(fetchedLead.status)) {
            updated.invoiceType = "Standard";
          }

          if (fetchedLead.spInvoiceStageId) {
            const sp = fetchedLead.spInvoiceStageId;
            updated.invoiceType = sp.invoiceType || updated.invoiceType;
            updated.calculationSameAsReported = sp.calculationSameAsReported ? 'Yes' : 'No';
            updated.roundOffDifference = sp.roundOffDifference ? 'Yes' : 'No';
            updated.remainingAmountWillCome = sp.remainingAmountWillCome ? 'Yes' : (sp.remainingAmountWillCome === false ? 'No' : '');
            updated.remainingTrancheAmount = sp.remainingTrancheAmount || '';
            updated.calculationFile = sp.calculationFile || null;
            if (sp.calculated) {
               updated.calculatedCPPercent = sp.calculated.channelPartnerPercentage || 0;
               updated.calculatedCPAmount = sp.calculated.channelPartnerAmount || 0;
               updated.calculatedSelfPercent = sp.calculated.selfPercentage || 0;
               updated.calculatedSelfAmount = sp.calculated.selfAmount || 0;
            }
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching lead", error);
    } finally {
      setLoading(false);
    }
  };

  const { data: citiesData } = useQuery({
    queryKey: ['cities', selectedState],
    enabled: !!selectedState,
    queryFn: async () => {
        const res = await apiGetCitiesByStateName(selectedState);
        setCitiesList(res?.data?.data || []);
        return res;
    }
  });

  const fetchBankers = async (cityId, stateName = selectedState) => {
    try {
      const token = localStorage.getItem('token');
      const stateToUse = stateName || formData.stateName || selectedState;
      if (!cityId || !stateToUse) return;
      
      let apiUrl = `${baseURL}/bankers/list-bankers?stateName=${encodeURIComponent(stateToUse)}&city=${encodeURIComponent(cityId)}`;
      if (lead) {
        let productParam = lead.product;
        if (typeof lead.product === 'object' && lead.product !== null) {
            productParam = lead.product._id || lead.product.name;
        }
        if (productParam) apiUrl += `&product=${encodeURIComponent(productParam)}`;
        
        const bankId = typeof lead.bank === 'object' && lead.bank !== null ? lead.bank._id : lead.bank;
        if (bankId) apiUrl += `&bank=${encodeURIComponent(bankId)}`;
      }

      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        let fetchedBankers = res.data.data || [];
        
        setBankersList(fetchedBankers);

        // Auto-select the banker
        setFormData(prev => {
            const isCurrentBankerValid = fetchedBankers.some(b => b._id === prev.bankerId);
            if (!isCurrentBankerValid && fetchedBankers.length > 0) {
                return { ...prev, bankerId: fetchedBankers[0]._id };
            }
            return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching bankers", error);
    }
  };

  useEffect(() => {
    setFormData(prev => {
      if (prev.calculationSameAsReported === 'No') return prev; 
      
      const updated = { ...prev };
      
      const isCPLead = (lead?.reportedThrough || prev.reportedThrough) === 'Channel Partner';
      const baseAmount = Number(lead?.totalPayoutAmount !== undefined && lead?.totalPayoutAmount !== null ? lead.totalPayoutAmount : prev.totalPayoutAmount) || 0;
      const reportedPct = Number(lead?.reportedPayoutPercentage !== undefined && lead?.reportedPayoutPercentage !== null ? lead.reportedPayoutPercentage : prev.reportedPayoutPercentage) || 0;
      const spDealPercent = Number(lead?.serviceProvider?.dealPercentage) || 0;

      const defaultCPPercent = isCPLead ? reportedPct : 0;
      const defaultCPAmount = isCPLead ? baseAmount : 0;
      const defaultSelfPercent = isCPLead ? spDealPercent : reportedPct;
      const defaultSelfAmt = isCPLead ? Number(((baseAmount * spDealPercent) / 100).toFixed(2)) : baseAmount;

      if (prev.rawCalc) {
        updated.calculatedCPPercent = isCPLead && prev.rawCalc.channelPartnerPercentage !== null ? prev.rawCalc.channelPartnerPercentage : defaultCPPercent;
        updated.calculatedCPAmount = isCPLead && prev.rawCalc.channelPartnerAmount !== null ? prev.rawCalc.channelPartnerAmount : defaultCPAmount;
        updated.calculatedSelfPercent = prev.rawCalc.selfPercentage !== null ? prev.rawCalc.selfPercentage : defaultSelfPercent;
        updated.calculatedSelfAmount = prev.rawCalc.selfAmount !== null ? prev.rawCalc.selfAmount : defaultSelfAmt;
      } else if (!lead?.spInvoiceStageId) {
        // No file uploaded and not saved yet
        updated.calculatedCPPercent = defaultCPPercent;
        updated.calculatedCPAmount = defaultCPAmount;
        updated.calculatedSelfPercent = defaultSelfPercent;
        updated.calculatedSelfAmount = defaultSelfAmt;
      }
      return updated;
    });
  }, [lead?.reportedThrough, lead?.reportedPayoutPercentage, lead?.totalPayoutAmount, lead?.serviceProvider?.dealPercentage, lead?.spInvoiceStageId]);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleViewFile = (filePath) => {
    if (!filePath) return;
    const staticBaseUrl = baseURL.replace(/\/api\/v1\/?$/, '');
    const fileUrl = `${staticBaseUrl}/${filePath.replace(/\\/g, '/')}`;
    window.open(fileUrl, '_blank');
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setFormData(prev => ({ ...prev, stateName: value, cityId: '', bankerId: '' }));
    setBankersList([]);
  };

  const handleCityChange = (value) => {
    setFormData(prev => ({ ...prev, cityId: value, bankerId: '' }));
    fetchBankers(value);
  };

  const handleBankerChange = (value) => {
    setFormData(prev => ({ ...prev, bankerId: value }));
  };

  const handleStage1Submit = async (e) => {
    e.preventDefault();
    if (!formData.stateName || !formData.cityId || !formData.bankerId) {
      alert("Please fill all fields");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${baseURL}/lead-stages/${id}/banker-details`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Stage 1 details saved successfully!");
        fetchLeadDetails();
      }
    } catch (error) {
      console.error("Error saving stage 1", error);
      alert("Error saving details");
    }
  };

  const handleStage2Submit = async (e) => {
    e.preventDefault();
    if (!formData.confirmationReceived) {
      alert("Please select confirmation option");
      return;
    }

    if (formData.confirmationReceived === 'Yes') {
      if (!formData.hasConfirmationFiles && (!formData.pdfFile || !formData.emlFile)) {
        alert("Both PDF and EML files are mandatory to upload.");
        return;
      }
    }

    let finalReason = '';
    if (formData.confirmationReceived === 'No') {
      if (!formData.reasonOption) {
        alert("Please select a reason");
        return;
      }
      if (formData.reasonOption === 'Others') {
        if (!formData.customReason?.trim()) {
          alert("Please specify the reason");
          return;
        }
        finalReason = formData.customReason.trim();
      } else {
        finalReason = formData.reasonOption;
      }
    }

    try {
      const token = localStorage.getItem('token');
      
      const formPayload = new FormData();
      formPayload.append('confirmationReceived', formData.confirmationReceived);
      
      if (formData.confirmationReceived === 'Yes') {
        if (formData.pdfFile) formPayload.append('pdf', formData.pdfFile);
        if (formData.emlFile) formPayload.append('eml', formData.emlFile);
      } else {
        formPayload.append('reason', finalReason);
      }

      const res = await axios.post(`${baseURL}/lead-stages/${id}/confirmation`, formPayload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        alert("Confirmation saved successfully!");
        fetchLeadDetails();
      }
    } catch (error) {
      console.error("Error saving stage 2", error);
      alert(error?.response?.data?.message || "Error saving confirmation");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className='px-6 py-6 bg-white rounded shadow min-h-screen'>
      <div className='flex gap-2 items-center pb-4 border-b-2 mb-6'>
        <Avatar>
          <AvatarFallback>LS</AvatarFallback>
        </Avatar>
        <h1 className='text-2xl font-bold'>Lead Stages: {lead?.leadNo}</h1>
      </div>

      <div className="w-full mb-6 mt-4 px-2 pb-14">
        <ul className="flex justify-between items-center w-full px-4">
          {stages.map((stage, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStage;
            const isCompleted = stepNum < currentStage;

            return (
              <li key={index} className={`flex items-center ${index !== stages.length - 1 ? 'w-full' : ''}`}>
                <div 
                  className={`flex flex-col items-center relative ${stepNum <= (lead?.stageNumber || 1) ? 'cursor-pointer hover:opacity-80' : ''}`}
                  onClick={() => {
                    if (stepNum <= (lead?.stageNumber || 1)) {
                      setCurrentStage(stepNum);
                    }
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm z-10 
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {isCompleted ? '✓' : stepNum}
                  </div>
                  <span className={`absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium text-center w-28 leading-tight 
                    ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                    {stage}
                  </span>
                </div>
                {index !== stages.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-16 bg-gray-50 p-6 rounded shadow border">
        {currentStage === 1 && (
          <form onSubmit={handleStage1Submit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Banker & Case Location Details</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">State Name</label>
              <Select value={formData.stateName} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                      {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                              {state}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">City Name</label>
              <Select value={formData.cityId} onValueChange={handleCityChange} disabled={!formData.stateName}>
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                      {citiesList.map((city) => (
                          <SelectItem key={city?._id} value={city?._id}>
                              {city?.cityName}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Banker</label>
              <Select value={formData.bankerId} onValueChange={handleBankerChange} disabled={!formData.cityId}>
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Banker" />
                  </SelectTrigger>
                  <SelectContent>
                      {bankersList.map((banker) => (
                          <SelectItem key={banker?._id} value={banker?._id}>
                              {banker?.bankerName}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button type="button" onClick={() => navigate('/admin/account_in_progress_leads')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                Back
              </button>
              <div className="flex gap-4">
                {lead?.stageNumber > 1 && (
                  <button type="button" onClick={() => setCurrentStage(2)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Skip & Continue
                  </button>
                )}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Details
                </button>
              </div>
            </div>
          </form>
        )}

        {currentStage === 2 && (
          <form onSubmit={handleStage2Submit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Confirmation Received</label>
              <Select value={formData.confirmationReceived} onValueChange={(val) => setFormData(prev => ({ ...prev, confirmationReceived: val, reasonOption: '', customReason: '', pdfFile: null, emlFile: null }))}>
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            {formData.confirmationReceived === 'Yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.hasConfirmationFiles && (
                   <div className="col-span-full mb-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      ✓ Files were successfully uploaded previously. You only need to upload below if you want to replace them.
                   </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Upload PDF {!formData.hasConfirmationFiles && <span className="text-red-500">*</span>}</label>
                    {formData.pdfPath && (
                      <button type="button" onClick={() => handleViewFile(formData.pdfPath)} className="text-xs text-blue-600 hover:underline">View Current PDF</button>
                    )}
                  </div>
                  <input type="file" accept=".pdf" onChange={(e) => setFormData(prev => ({ ...prev, pdfFile: e.target.files[0] }))} className="w-full border rounded p-2 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Upload EML {!formData.hasConfirmationFiles && <span className="text-red-500">*</span>}</label>
                    {formData.emlPath && (
                      <button type="button" onClick={() => handleViewFile(formData.emlPath)} className="text-xs text-blue-600 hover:underline">View Current EML</button>
                    )}
                  </div>
                  <input type="file" accept=".eml" onChange={(e) => setFormData(prev => ({ ...prev, emlFile: e.target.files[0] }))} className="w-full border rounded p-2 bg-white" />
                </div>
              </div>
            )}

            {formData.confirmationReceived === 'No' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Reason</label>
                  <Select value={formData.reasonOption} onValueChange={(val) => setFormData(prev => ({ ...prev, reasonOption: val }))}>
                      <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Already Found in Bank Dump/MIS">Already Found in Bank Dump/MIS</SelectItem>
                          <SelectItem value="Processed by Self">Processed by Self</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                {formData.reasonOption === 'Others' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Specify Reason <span className="text-red-500">*</span></label>
                    <textarea 
                      value={formData.customReason} 
                      onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
                      required 
                      className="w-full border rounded p-2 bg-white"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <button type="button" onClick={() => setCurrentStage(1)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                Back
              </button>
              <div className="flex gap-4">
                {lead?.stageNumber > 2 && (
                  <button type="button" onClick={() => setCurrentStage(3)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Skip & Continue
                  </button>
                )}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Confirmation
                </button>
              </div>
            </div>
          </form>
        )}

        {currentStage === 3 && (
            <CaseSearch 
              accountLeadId={lead?._id} 
              onComplete={fetchLeadDetails} 
              onBack={() => setCurrentStage(2)} 
              onContinue={() => {
                if (isReportedLead) {
                  setCurrentStage(4);
                } else {
                  navigate('/admin/account_in_progress_leads');
                }
              }} 
            />
        )}

        {currentStage === 4 && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.reportedPayoutPercentageSame || !formData.reportedThrough) {
              alert("Please fill all required fields");
              return;
            }
            try {
              const token = localStorage.getItem('token');
              const res = await axios.post(`${baseURL}/lead-stages/${id}/case-reporting`, {
                reportedPayoutPercentageSame: formData.reportedPayoutPercentageSame,
                reportedPayoutPercentage: formData.reportedPayoutPercentage,
                totalPayoutAmount: formData.totalPayoutAmount,
                reportedThrough: formData.reportedThrough
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.data.success) {
                alert("Case Reporting saved successfully!");
                fetchLeadDetails();
              }
            } catch (error) {
              console.error("Error saving case reporting", error);
              alert("Error saving case reporting details");
            }
          }} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Case Reporting</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Reported Payout Percentage Same?</label>
              <Select 
                value={formData.reportedPayoutPercentageSame || 'Yes'} 
                onValueChange={(val) => {
                  const origPct = lead?.originalReportedPayoutPercentage !== undefined && lead?.originalReportedPayoutPercentage !== null
                    ? lead?.originalReportedPayoutPercentage
                    : (lead?.reportedPayoutPercentage ?? 0);
                  const origAmt = lead?.originalTotalPayoutAmount !== undefined && lead?.originalTotalPayoutAmount !== null
                    ? lead?.originalTotalPayoutAmount
                    : (lead?.totalPayoutAmount ?? 0);

                  setFormData(prev => ({ 
                    ...prev, 
                    reportedPayoutPercentageSame: val,
                    reportedPayoutPercentage: val === 'Yes' ? origPct : prev.reportedPayoutPercentage,
                    totalPayoutAmount: val === 'Yes' ? origAmt : prev.totalPayoutAmount
                  }));
                }}
              >
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Yes/No" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Reported Payout Percentage (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.reportedPayoutPercentage !== undefined ? formData.reportedPayoutPercentage : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const pct = Number(val);
                    const loanAmt = Number(lead?.reportedLoanAmount) || 0;
                    const amt = val !== '' && !isNaN(pct) && loanAmt > 0 ? Number(((loanAmt * pct) / 100).toFixed(2)) : '';
                    setFormData(prev => ({ ...prev, reportedPayoutPercentage: val, totalPayoutAmount: amt }));
                  }}
                  disabled={formData.reportedPayoutPercentageSame !== 'No'}
                  className={`w-full border rounded p-2 ${formData.reportedPayoutPercentageSame !== 'No' ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Total Payout Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.totalPayoutAmount !== undefined ? formData.totalPayoutAmount : ''}
                  readOnly
                  disabled={true}
                  className="w-full border rounded p-2 bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Case to be reported through</label>
              <Select 
                value={formData.reportedThrough} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, reportedThrough: val }))}
              >
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Self">Self</SelectItem>
                      <SelectItem value="Channel Partner">Channel Partner</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button type="button" onClick={() => setCurrentStage(3)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                Back
              </button>
              <div className="flex gap-4">
                {lead?.stageNumber > 4 && (
                  <button type="button" onClick={() => setCurrentStage(5)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Skip & Continue
                  </button>
                )}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save & Continue
                </button>
              </div>
            </div>
          </form>
        )}

        {currentStage === 5 && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.invoiceType || !formData.calculationSameAsReported) {
              alert("Please complete the required fields");
              return;
            }
            if (formData.calculationSameAsReported === "No") {
              if (!formData.remainingAmountWillCome) {
                alert("Please select if the remaining amount will come (Yes/No)");
                return;
              }
              if (formData.remainingAmountWillCome === "No" && !formData.roundOffDifference) {
                alert("Please select if there is a round-off difference");
                return;
              }
            }
            
            try {
              const token = localStorage.getItem('token');
              const res = await axios.post(`${baseURL}/lead-stages/${id}/sp-invoice/submit`, {
                invoiceType: formData.invoiceType,
                calculationSameAsReported: formData.calculationSameAsReported === "Yes",
                roundOffDifference: formData.roundOffDifference === "Yes",
                remainingAmountWillCome: formData.remainingAmountWillCome === "Yes",
                remainingTrancheAmount: formData.remainingAmountWillCome === "Yes" 
                  ? Number(formData.remainingTrancheAmount !== '' ? formData.remainingTrancheAmount : remainingDifference) 
                  : 0,
                calculationFile: formData.calculationFile, // populated after upload
                reported: {
                  channelPartnerPercentage: isCP ? Number(lead?.reportedPayoutPercentage || formData.reportedPayoutPercentage) || 0 : 0,
                  channelPartnerAmount: isCP ? Number(lead?.totalPayoutAmount || formData.totalPayoutAmount) || 0 : 0,
                  selfPercentage: isCP ? (Number(lead?.serviceProvider?.dealPercentage) || 0) : (Number(lead?.reportedPayoutPercentage || formData.reportedPayoutPercentage) || 0),
                  selfAmount: isCP ? Number((((Number(lead?.totalPayoutAmount || formData.totalPayoutAmount) || 0) * (Number(lead?.serviceProvider?.dealPercentage) || 0)) / 100).toFixed(2)) : (Number(lead?.totalPayoutAmount || formData.totalPayoutAmount) || 0)
                },
                calculated: {
                  channelPartnerPercentage: formData.calculatedCPPercent,
                  channelPartnerAmount: formData.calculatedCPAmount,
                  selfPercentage: formData.calculatedSelfPercent,
                  selfAmount: formData.calculatedSelfAmount
                }
              }, { headers: { Authorization: `Bearer ${token}` } });
              
              if (res.data.success) {
                const data = res.data.data;
                if (data?.newTranche) {
                  alert(`SP Invoice saved! A new tranche of ₹${data.newTranche.amount} with ID ${data.newTranche.customTrancheId || '1.1.a'} has been created in "In Progress" section.`);
                } else if (data?.status === "Recovery Required") {
                  alert("Recovery Request created!");
                } else {
                  alert("SP Invoice saved successfully!");
                }
                fetchLeadDetails();
              }
            } catch (error) {
              console.error(error);
              alert(error.response?.data?.message || "Error saving SP Invoice");
            }
          }} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">SP Invoices</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Invoice Type</label>
              <Select 
                value={formData.invoiceType} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, invoiceType: val }))}
              >
                  <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="On Confirmation" disabled={!lead?.confirmationStageId || lead?.confirmationStageId?.confirmationReceived !== 'Yes'}>On Confirmation</SelectItem>
                  </SelectContent>
              </Select>
              {(!lead?.confirmationStageId || lead?.confirmationStageId?.confirmationReceived !== 'Yes') && (
                <p className="text-xs text-red-500 mt-1">On Confirmation invoice cannot be raised because confirmation has not been received.</p>
              )}
            </div>

            <div className="flex flex-col gap-1 border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Upload Calculation Received (.xlsx, .xls)</label>
                {formData.calculationFile?.filePath && (
                  <button type="button" onClick={() => handleViewFile(formData.calculationFile.filePath)} className="text-xs text-blue-600 hover:underline">View Uploaded Calculation</button>
                )}
              </div>
              <input type="file" accept=".xlsx,.xls" onChange={async (e) => {
                 const file = e.target.files[0];
                 if (!file) return;
                 const formDataUpload = new FormData();
                 formDataUpload.append("excel", file);
                 try {
                   const token = localStorage.getItem('token');
                   const res = await axios.post(`${baseURL}/lead-stages/${id}/sp-invoice/calculate`, formDataUpload, {
                     headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                   });
                   if (res.data.success) {
                      const calc = res.data.data.calculated;
                      const isCPLead = (lead?.reportedThrough || formData.reportedThrough) === 'Channel Partner';
                      const baseAmount = Number(lead?.totalPayoutAmount !== undefined && lead?.totalPayoutAmount !== null ? lead.totalPayoutAmount : formData.totalPayoutAmount) || 0;
                      const reportedPct = Number(lead?.reportedPayoutPercentage !== undefined && lead?.reportedPayoutPercentage !== null ? lead.reportedPayoutPercentage : formData.reportedPayoutPercentage) || 0;
                      const spDealPercent = Number(lead?.serviceProvider?.dealPercentage) || 0;
                      
                      const defaultCPPercent = isCPLead ? reportedPct : 0;
                      const defaultCPAmount = isCPLead ? baseAmount : 0;
                      const defaultSelfPercent = isCPLead ? spDealPercent : reportedPct;
                      const defaultSelfAmt = isCPLead ? Number(((baseAmount * spDealPercent) / 100).toFixed(2)) : baseAmount;

                      setFormData(prev => ({
                        ...prev,
                        calculationFile: { fileName: res.data.data.fileName, filePath: res.data.data.filePath },
                        rawCalc: calc,
                        calculatedCPPercent: isCPLead && calc.channelPartnerPercentage !== null ? calc.channelPartnerPercentage : defaultCPPercent,
                        calculatedCPAmount: isCPLead && calc.channelPartnerAmount !== null ? calc.channelPartnerAmount : defaultCPAmount,
                        calculatedSelfPercent: calc.selfPercentage !== null ? calc.selfPercentage : defaultSelfPercent,
                        calculatedSelfAmount: calc.selfAmount !== null ? calc.selfAmount : defaultSelfAmt
                      }));
                      alert("Calculation loaded successfully");
                   }
                 } catch (err) {
                   alert("Invalid calculation file. Please upload the correct calculation format.");
                 }
              }} className="mt-2" />
            </div>

            {formData.calculationFile && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Calculation Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-4 rounded bg-white">
                    <h4 className="font-semibold text-gray-800 mb-2 border-b pb-2">REPORTED</h4>
                    <p className="text-sm text-gray-600">CP %: {isCP ? (lead?.reportedPayoutPercentage || formData.reportedPayoutPercentage || 0) : 0}%</p>
                    <p className="text-sm text-gray-600">CP Amount: ₹{isCP ? (lead?.totalPayoutAmount || formData.totalPayoutAmount || 0) : 0}</p>
                    <p className="text-sm text-gray-600">Self %: {isCP ? (lead?.serviceProvider?.dealPercentage || 0) : (lead?.reportedPayoutPercentage || formData.reportedPayoutPercentage || 0)}%</p>
                    <p className="text-sm text-gray-600">Self Amount: ₹{isCP ? (((Number(lead?.totalPayoutAmount || formData.totalPayoutAmount) || 0) * (Number(lead?.serviceProvider?.dealPercentage) || 0)) / 100).toFixed(2) : (lead?.totalPayoutAmount || formData.totalPayoutAmount || 0)}</p>
                  </div>
                  <div className="border p-4 rounded bg-white">
                    <h4 className="font-semibold text-gray-800 mb-2 border-b pb-2">CALCULATED</h4>
                    <div className="flex flex-col gap-2">
                       {isCP && (
                         <>
                           <label className="text-xs">CP %</label>
                           <input 
                             type="number" 
                             step="0.01" 
                             value={formData.calculatedCPPercent} 
                             disabled={formData.calculationSameAsReported !== 'No'} 
                             onChange={(e) => {
                               const val = e.target.value;
                               const loanAmt = Number(lead?.reportedLoanAmount) || 0;
                               const computedAmt = val !== '' && !isNaN(Number(val)) && loanAmt > 0
                                 ? Number(((loanAmt * Number(val)) / 100).toFixed(2))
                                 : '';
                               setFormData(p => ({
                                 ...p, 
                                 calculatedCPPercent: val,
                                 calculatedCPAmount: computedAmt !== '' ? computedAmt : p.calculatedCPAmount
                               }));
                             }} 
                             className="border p-1" 
                           />
                           <label className="text-xs">CP Amount (₹)</label>
                           <input 
                             type="number" 
                             value={formData.calculatedCPAmount} 
                             disabled={formData.calculationSameAsReported !== 'No'} 
                             onChange={(e) => setFormData(p => ({ ...p, calculatedCPAmount: e.target.value }))} 
                             className="border p-1" 
                           />
                         </>
                       )}
                       <label className="text-xs">Self %</label>
                       <input 
                         type="number" 
                         step="0.01" 
                         value={formData.calculatedSelfPercent} 
                         disabled={formData.calculationSameAsReported !== 'No'} 
                         onChange={(e) => {
                           const val = e.target.value;
                           const isCPLead = (lead?.reportedThrough || formData.reportedThrough) === 'Channel Partner';
                           const baseAmount = Number(lead?.totalPayoutAmount || formData.totalPayoutAmount) || 0;
                           const loanAmt = Number(lead?.reportedLoanAmount) || 0;
                           
                           let computedAmt = '';
                           if (val !== '' && !isNaN(Number(val))) {
                             if (isCPLead) {
                               computedAmt = Number(((baseAmount * Number(val)) / 100).toFixed(2));
                             } else {
                               computedAmt = loanAmt > 0 
                                 ? Number(((loanAmt * Number(val)) / 100).toFixed(2)) 
                                 : Number(((baseAmount * Number(val)) / 100).toFixed(2));
                             }
                           }
                           setFormData(p => ({
                             ...p,
                             calculatedSelfPercent: val,
                             calculatedSelfAmount: computedAmt !== '' ? computedAmt : p.calculatedSelfAmount
                           }));
                         }} 
                         className="border p-1" 
                       />
                       <label className="text-xs">Self Amount (₹)</label>
                       <input 
                         type="number" 
                         step="0.01" 
                         value={formData.calculatedSelfAmount} 
                         disabled={formData.calculationSameAsReported !== 'No'} 
                         onChange={(e) => setFormData(p => ({ ...p, calculatedSelfAmount: e.target.value }))} 
                         className="border p-1" 
                       />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  <label className="text-sm font-medium">Is calculation same as reported?</label>
                  <Select 
                    value={formData.calculationSameAsReported} 
                    onValueChange={(val) => {
                      setFormData(prev => {
                         const updated = { 
                           ...prev, 
                           calculationSameAsReported: val,
                           remainingAmountWillCome: val === 'Yes' ? '' : prev.remainingAmountWillCome,
                           roundOffDifference: val === 'Yes' ? '' : prev.roundOffDifference
                         };
                         if (val === 'Yes') {
                            const isCPLead = (lead?.reportedThrough || prev.reportedThrough) === 'Channel Partner';
                            const baseAmount = Number(lead?.totalPayoutAmount !== undefined && lead?.totalPayoutAmount !== null ? lead.totalPayoutAmount : prev.totalPayoutAmount) || 0;
                            const reportedPct = Number(lead?.reportedPayoutPercentage !== undefined && lead?.reportedPayoutPercentage !== null ? lead.reportedPayoutPercentage : prev.reportedPayoutPercentage) || 0;
                            const spDealPercent = Number(lead?.serviceProvider?.dealPercentage) || 0;
                            
                            updated.calculatedCPPercent = isCPLead ? reportedPct : 0;
                            updated.calculatedCPAmount = isCPLead ? baseAmount : 0;
                            updated.calculatedSelfPercent = isCPLead ? spDealPercent : reportedPct;
                            updated.calculatedSelfAmount = isCPLead ? Number(((baseAmount * spDealPercent) / 100).toFixed(2)) : baseAmount;
                         }
                         return updated;
                      });
                    }}
                  >
                      <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Option" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                {formData.calculationSameAsReported === "No" && (
                  <div className="flex flex-col gap-1 mt-4">
                    <label className="text-sm font-medium">Remaining amount will come?</label>
                    <Select 
                      value={formData.remainingAmountWillCome} 
                      onValueChange={(val) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          remainingAmountWillCome: val,
                          remainingTrancheAmount: val === 'Yes' ? (prev.remainingTrancheAmount !== '' ? prev.remainingTrancheAmount : remainingDifference) : '',
                          roundOffDifference: val === 'Yes' ? '' : prev.roundOffDifference
                        }));
                      }}
                    >
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select Option (Yes/No)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.calculationSameAsReported === "No" && formData.remainingAmountWillCome === "Yes" && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-semibold text-blue-900">Remaining Tranche Amount (₹)</label>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-200 text-blue-800 rounded">ID: 1.1.a</span>
                    </div>
                    <input 
                      type="number"
                      step="0.01"
                      value={formData.remainingTrancheAmount !== '' ? formData.remainingTrancheAmount : remainingDifference}
                      onChange={(e) => setFormData(p => ({ ...p, remainingTrancheAmount: e.target.value }))}
                      className="border p-2 rounded w-full bg-white text-sm"
                    />
                    <p className="text-xs text-blue-700 mt-2">
                      ✓ A new tranche of <strong>₹{formData.remainingTrancheAmount !== '' ? formData.remainingTrancheAmount : remainingDifference}</strong> will be automatically created in the <strong>"In Progress"</strong> section with ID <strong>1.1.a</strong>.
                    </p>
                  </div>
                )}

                {formData.calculationSameAsReported === "No" && formData.remainingAmountWillCome === "No" && (
                  <>
                    <div className="flex flex-col gap-1 mt-4">
                      <label className="text-sm font-medium">Is there a round off difference?</label>
                      <Select 
                        value={formData.roundOffDifference} 
                        onValueChange={(val) => setFormData(prev => ({ ...prev, roundOffDifference: val }))}
                      >
                          <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>

                    {formData.roundOffDifference === "No" && (
                       <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
                         <p className="text-sm text-orange-800 font-medium">Warning: Calculation differs and is not a round-off.</p>
                         <p className="text-xs text-orange-700 mt-1">The system will dynamically check the Advisor Payout status on submission and either update the payout or trigger an Admin Recovery Request.</p>
                       </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-between items-center mt-6">
                  <button type="button" onClick={() => setCurrentStage(4)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                    Back
                  </button>
                  <div className="flex gap-4">
                    {lead?.stageNumber > 5 && (
                      <button type="button" onClick={() => setCurrentStage(6)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Skip & Continue
                      </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Save & Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}

        {currentStage > 5 && (
          <div className="text-center py-10">
            <h2 className="text-xl text-gray-500 font-medium">Stage {currentStage} is active. Further form implementation pending.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadStages;
