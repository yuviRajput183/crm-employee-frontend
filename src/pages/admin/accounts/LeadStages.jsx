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

const stages = [
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

  const [selectedState, setSelectedState] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [bankersList, setBankersList] = useState([]);

  const [formData, setFormData] = useState({
    stateName: '',
    cityId: '',
    bankerId: '',
    confirmationReceived: ''
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

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
            }
          }
          
          // Pre-fill Stage 4 default values from the lead model
          updated.reportedPayoutPercentage = fetchedLead.reportedPayoutPercentage || '';
          updated.totalPayoutAmount = fetchedLead.totalPayoutAmount || '';
          
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
      const res = await axios.get(`${baseURL}/bankers/list-bankers?stateName=${stateName}&city=${cityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBankersList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching bankers", error);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

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
      alert("Error saving confirmation");
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

      <div className="w-full mb-8 overflow-x-auto">
        <ul className="flex items-center w-full min-w-max px-4">
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
                  <span className={`absolute top-10 text-xs font-medium whitespace-nowrap 
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

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Details
            </button>
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
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Upload PDF</label>
                  <input type="file" accept=".pdf" onChange={(e) => setFormData(prev => ({ ...prev, pdfFile: e.target.files[0] }))} className="w-full border rounded p-2 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Upload EML</label>
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

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Confirmation
            </button>
          </form>
        )}

        {currentStage === 3 && (
            <CaseSearch accountLeadId={lead?._id} onComplete={fetchLeadDetails} />
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
                value={formData.reportedPayoutPercentageSame} 
                onValueChange={(val) => setFormData(prev => ({ 
                  ...prev, 
                  reportedPayoutPercentageSame: val,
                  reportedPayoutPercentage: lead?.reportedPayoutPercentage || 0,
                  totalPayoutAmount: lead?.totalPayoutAmount || 0
                }))}
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
                  value={formData.reportedPayoutPercentage || ''}
                  onChange={(e) => {
                    const pct = Number(e.target.value);
                    const amt = (lead?.reportedLoanAmount * pct) / 100;
                    setFormData(prev => ({ ...prev, reportedPayoutPercentage: e.target.value, totalPayoutAmount: amt }));
                  }}
                  disabled={formData.reportedPayoutPercentageSame !== 'No'}
                  className={`w-full border rounded p-2 ${formData.reportedPayoutPercentageSame !== 'No' ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Total Payout Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.totalPayoutAmount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalPayoutAmount: e.target.value }))}
                  disabled={formData.reportedPayoutPercentageSame !== 'No'}
                  className={`w-full border rounded p-2 ${formData.reportedPayoutPercentageSame !== 'No' ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
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

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save & Continue
            </button>
          </form>
        )}

        {currentStage > 4 && (
          <div className="text-center py-10">
            <h2 className="text-xl text-gray-500 font-medium">Stage {currentStage} is active. Further form implementation pending.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadStages;
