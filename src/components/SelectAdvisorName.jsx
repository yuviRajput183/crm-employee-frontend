import React from 'react';


const advisorOptions = [
    { label: 'ANAS KHAN', code: 'DSA155' },
    { label: 'ANIL RAO', code: 'DSA157' },
    { label: 'ANKUR YADAV', code: 'DSA130' },
    { label: 'ANKUSH SACHDEVA', code: 'DSA112' },
    { label: 'ANOOP', code: 'DSA125' },
    { label: 'BASANTA KUMAR KHARA', code: 'DSA123' },
    { label: 'BUSINESS STANDARD LOAN FINANCIAL SERVICES LTD', code: 'DSA126' },
    { label: 'CA DAVINDER SHARMA', code: 'DSA150' },
    { label: 'DHAMELIYA AKASH DIPAKBHAI', code: 'DSA133' },
    { label: 'DHARMENDER KUMAR', code: 'DSA119' },
    { label: 'DINESH VINAYAK', code: 'DSA135' },
    { label: 'FINSWAY', code: 'DSA137' },
    { label: 'GAGANDEEP', code: 'DSA120' },
    { label: 'GEETANSH BHUTANI', code: 'DSA149' },
    { label: 'HIMANSHU SACHDEVA', code: 'DSA109' },
    { label: 'HITESH GROVER', code: 'DSA107' },
    { label: 'JAGBIR MALIK', code: 'DSA110' },
    { label: 'KAILASH', code: 'DSA118' },
    { label: 'KAPIL SHARMA', code: 'DSA139' },
    { label: 'YUVRAJ', code: 'DSA148' },
];


const SelectAdvisorName = ({ selectedAdvisor, setSelectedAdvisor }) => {
    return (
        <div className="mt-4 h-auto border rounded shadow p-4">
            <div className=' max-w-md mx-auto'>

                <select
                    id="advisor"
                    name="advisor"
                    className="w-full cursor-pointer outline-none p-2 border border-gray-300 rounded bg-blue-800 text-white font-semibold"
                    value={selectedAdvisor}
                    onChange={(e) => setSelectedAdvisor(e.target.value)}
                    required
                >
                    <option value="" disabled className=' text-center'>
                        SELECT ADVISOR NAME
                    </option>
                    {advisorOptions.map((advisor) => (
                        <option key={advisor.code} value={advisor.code} className=' text-center'>
                            {advisor.label} - {advisor.code}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectAdvisorName;
