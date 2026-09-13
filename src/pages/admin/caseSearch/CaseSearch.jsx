import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseSearch = ({ accountLeadId, onComplete }) => {
  const [lead, setLead] = useState(null);
  const [tranches, setTranches] = useState([]);
  
  const [isFullCaseFound, setIsFullCaseFound] = useState('');
  const [reportInTranches, setReportInTranches] = useState('');
  const [newTranches, setNewTranches] = useState([{ amount: '', spUid: '', foundDate: '', foundMonth: '' }]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1');

  const fetchCaseDetails = async () => {
    if (!accountLeadId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseURL}/tranches/${accountLeadId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setLead(res.data.data.lead);
      setTranches(res.data.data.tranches);
      setIsFullCaseFound('');
      setReportInTranches('');
      setNewTranches([{ amount: '', spUid: '', foundDate: '', foundMonth: '' }]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch case details");
      setLead(null);
      setTranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountLeadId) {
        fetchCaseDetails();
    }
  }, [accountLeadId]);

  const addTrancheRow = () => {
    setNewTranches([...newTranches, { amount: '', spUid: '', foundDate: '', foundMonth: '' }]);
  };

  const removeTrancheRow = (index) => {
    const updated = [...newTranches];
    updated.splice(index, 1);
    setNewTranches(updated);
  };

  const handleTrancheChange = (index, field, value) => {
    const updated = [...newTranches];
    updated[index][field] = value;
    setNewTranches(updated);
  };

  const newTranchesTotal = newTranches.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalFoundAmount = (lead?.trancheFoundAmount || 0) + newTranchesTotal;
  const remainingAmount = (lead?.reportedLoanAmount || 0) - totalFoundAmount;

  const handleSubmit = async () => {
    let tranchesToSubmit = newTranches.filter(t => t.amount !== '');
    if (isFullCaseFound === 'yes' && reportInTranches === 'no') {
      tranchesToSubmit = [{ amount: remainingAmount + newTranchesTotal, spUid: '' }];
    } else if (isFullCaseFound === 'no') {
      tranchesToSubmit = tranchesToSubmit.map(t => ({ ...t, status: 'FOUND' }));
      if (remainingAmount > 0) {
        tranchesToSubmit.push({ amount: remainingAmount, spUid: '', status: 'PENDING' });
      }
    } else {
      tranchesToSubmit = tranchesToSubmit.map(t => ({ ...t, status: 'FOUND' }));
    }

    if (tranchesToSubmit.length === 0) return alert("Please enter a valid amount");

    const finalTranchesTotalFound = tranchesToSubmit.reduce((sum, t) => t.status !== 'PENDING' ? sum + Number(t.amount) : sum, 0);
    const finalTotalFoundAmount = (lead?.trancheFoundAmount || 0) + finalTranchesTotalFound;

    if (finalTotalFoundAmount > lead.reportedLoanAmount) {
      return alert("Total tranche amount cannot exceed the case amount.");
    }

    if (isFullCaseFound === 'yes' && finalTotalFoundAmount !== lead.reportedLoanAmount) {
      return alert(`Full case cannot be marked as found because ₹${lead.reportedLoanAmount - finalTotalFoundAmount} is still remaining.`);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${baseURL}/tranches/${lead._id}`, {
        tranches: tranchesToSubmit,
        isFullCaseFound: isFullCaseFound === 'yes'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Tranches saved successfully");
      setLead(res.data.data.lead);
      setTranches([...tranches, ...res.data.data.createdTranches]);
      setIsFullCaseFound('');
      setReportInTranches('');
      setNewTranches([{ amount: '', spUid: '', foundDate: '', foundMonth: '' }]);
      
      if (onComplete) {
          onComplete();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save tranches");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Case Search & Tranche Management</h1>
      
      {loading && <p>Loading case details...</p>}

      {lead && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Case Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-sm">Lead ID</p>
              <p className="font-bold">L{lead.leadNo}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Customer</p>
              <p className="font-bold">{lead.caseName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Case Amount</p>
              <p className="font-bold text-blue-600">₹{lead.reportedLoanAmount?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Found Amount</p>
              <p className="font-bold text-green-600">₹{lead.trancheFoundAmount?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Remaining Amount</p>
              <p className="font-bold text-red-600">₹{lead.trancheRemainingAmount?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current Status</p>
              <p className="font-bold">{lead.status?.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-1">Case Found Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${Math.min((lead.trancheFoundAmount / (lead.reportedLoanAmount || 1)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1">{((lead.trancheFoundAmount / (lead.reportedLoanAmount || 1)) * 100).toFixed(2)}%</p>
          </div>

          {tranches.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-2">Existing Tranches</h3>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Tranche</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Payment UID</th>
                    <th className="p-2 border">SP UID</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tranches.map((t) => (
                    <tr key={t._id}>
                      <td className="p-2 border">T{t.trancheNumber}</td>
                      <td className="p-2 border">₹{t.amount?.toLocaleString('en-IN')}</td>
                      <td className="p-2 border">{t.paymentUid}</td>
                      <td className="p-2 border">{t.spUid || 'N/A'}</td>
                      <td className="p-2 border">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {lead.reportedLoanAmount - (lead.trancheFoundAmount || 0) > 0 && (
            <>
              <div className="mb-4">
                <label className="block font-bold mb-2">Is Full Case Found?</label>
                <select 
                  className="border p-2 rounded w-full md:w-1/3"
                  value={isFullCaseFound}
                  onChange={(e) => {
                    setIsFullCaseFound(e.target.value);
                    if (e.target.value === 'no') setReportInTranches('yes');
                  }}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {isFullCaseFound === 'yes' && (
                <div className="mb-4">
                  <label className="block font-bold mb-2">Report in Tranches?</label>
                  <select 
                    className="border p-2 rounded w-full md:w-1/3"
                    value={reportInTranches}
                    onChange={(e) => setReportInTranches(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              )}

              {(isFullCaseFound === 'yes' && reportInTranches === 'yes') && (
                <div className="mb-6 p-4 bg-gray-50 border rounded">
                  <h3 className="font-bold mb-4">Tranche Entry</h3>
                  {newTranches.map((tranche, idx) => (
                    <div key={idx} className="flex gap-4 mb-2 items-end">
                      <div className="flex-1">
                        <label className="block text-sm">Amount</label>
                        <input 
                          type="number" 
                          className="border p-2 rounded w-full"
                          value={tranche.amount}
                          onChange={(e) => handleTrancheChange(idx, 'amount', e.target.value)}
                          placeholder="₹"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm">SP UID (Optional)</label>
                        <input 
                          type="text" 
                          className="border p-2 rounded w-full"
                          value={tranche.spUid}
                          onChange={(e) => handleTrancheChange(idx, 'spUid', e.target.value)}
                        />
                      </div>
                      {newTranches.length > 1 && (
                        <div className="pb-2">
                          <button 
                            onClick={() => removeTrancheRow(idx)}
                            className="text-red-600 font-bold hover:text-red-800 text-lg"
                            title="Remove Tranche"
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={addTrancheRow}
                    className="text-blue-600 mt-2 font-bold"
                  >
                    + Add Tranche
                  </button>

                  <div className="mt-4 border-t pt-4">
                    <p>New Found Amount: <strong>₹{newTranchesTotal.toLocaleString('en-IN')}</strong></p>
                    <p>Remaining Amount: <strong>₹{remainingAmount.toLocaleString('en-IN')}</strong></p>
                  </div>
                </div>
              )}

              {isFullCaseFound === 'yes' && reportInTranches === 'no' && (
                <div className="mb-6 p-4 bg-gray-50 border rounded">
                  <p>The complete remaining amount of ₹{(lead.reportedLoanAmount - (lead.trancheFoundAmount || 0)).toLocaleString('en-IN')} will be treated as one tranche.</p>
                </div>
              )}

              {isFullCaseFound === 'no' && remainingAmount > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800">A pending tranche of the remaining amount <strong>(₹{remainingAmount.toLocaleString('en-IN')})</strong> will be automatically created with status <strong>PENDING</strong>.</p>
                </div>
              )}

              {(isFullCaseFound === 'no' || reportInTranches !== '') && (
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-green-600 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save & Continue'}
                </button>
              )}
            </>
          )}

          {lead.reportedLoanAmount - (lead.trancheFoundAmount || 0) === 0 && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded font-bold">
              Case is fully found. No more tranches can be added.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseSearch;
