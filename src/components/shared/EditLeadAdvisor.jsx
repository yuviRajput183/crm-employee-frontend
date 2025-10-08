import { apiListAdvisor } from '@/services/advisor.api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Button } from '../ui/button';
import { useLead } from '@/lib/hooks/useLead';

const EditLeadAdvisor = ({ lead, onClose, refetch }) => {

    const [advisors, setAdvisors] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const { editLeadAdvisor } = useLead();
    const { mutateAsync, isLoading, isError, error } = editLeadAdvisor;




    // query to  fetch all the advisor on component mount
    const {
        isError: isListAdvisorError,
        error: listAdvisorError,
    } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await apiListAdvisor();
            console.log("📦 queryFn response of list advisor:", res);
            setAdvisors(res?.data?.data?.advisors || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching advisords:", err);
        }
    });

    console.log("Selected advisor >>", selectedAdvisor);

    const handleUpdate = async () => {
        if (!selectedAdvisor) {
            alert("Please select an advisor.");
            return;
        }

        try {
            const payload = {
                advisorId: selectedAdvisor
            };

            const response = await mutateAsync({
                leadId: lead?._id,
                payload: payload
            });

            console.log(" Advisor updated of a lead:", response.data);
            alert("Advisor updated successfully!");
            onClose(); // optional callback
            refetch();
        } catch (error) {
            console.error(" Failed to update advisor of a lead:", error);
            alert("Error updating advisor.");
        }
    };

    return (
        <div className="p-2 mt-3 bg-white rounded shadow">
            {isListAdvisorError && (
                <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}


            <div className=' grid grid-cols-2 md:grid-cols-4 gap-2'>

                {/* Lead No */}
                <div className="flex flex-col">
                    <label className="font-semibold">Lead No</label>
                    <input
                        type="text"
                        value={lead?.leadNo}
                        readOnly
                        className="p-2 border rounded bg-gray-100 text-gray-600 outline-none"
                    />
                </div>

                <div className="flex flex-col ">
                    <label className="font-semibold">Product Type</label>
                    <input
                        type="text"
                        value={lead?.productType}
                        readOnly
                        className="p-2 border rounded bg-gray-100 text-gray-600  outline-none"
                    />
                </div>


                <div className="flex flex-col">
                    <label className="font-semibold">Client Name</label>
                    <input
                        type="text"
                        value={lead?.clientName}
                        readOnly
                        className="p-2 border rounded bg-gray-100 text-gray-600 outline-none"
                    />
                </div>


                <div className="flex flex-col ">
                    <label className="font-semibold">Advisor Name <span className=' text-red-500'>*</span></label>
                    <select
                        className="p-2 border rounded"
                        value={selectedAdvisor}
                        onChange={(e) => setSelectedAdvisor(e.target.value)}
                    >
                        <option value="">Select</option>
                        {advisors?.map((advisor) => (
                            <option key={advisor?._id} value={advisor?._id}>
                                {advisor.name} - {advisor?.advisorCode}
                            </option>
                        ))}
                    </select>
                </div>

            </div>


            <div className=' mt-3 flex gap-2'>
                <Button loading={isLoading} onClick={handleUpdate} className=" bg-blue-500 hover:bg-blue-500">Update</Button>
                <Button loading={isLoading} onClick={onClose} className=" bg-blue-500 hover:bg-blue-500">Back</Button>
            </div>
        </div>
    )
}

export default EditLeadAdvisor
