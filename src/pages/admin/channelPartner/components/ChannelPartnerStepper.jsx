import React from 'react';

const stages = [
    "Mobile and Email Verification",
    "PAN Verification",
    "Aadhaar Verification",
    "Business Verification",
    "Bank Verification",
    "Upload Documents",
    "Documents Review",
    "Agreement Generation and Signing",
    "Code Creation"
];

const ChannelPartnerStepper = ({ currentStage }) => {
    return (
        <div className="w-full mb-6 mt-4 px-2 overflow-x-auto pb-14">
            <ul className="flex justify-between items-center w-full min-w-[900px] px-12">
                {stages.map((stage, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStage;
                    const isCompleted = stepNum < currentStage;

                    return (
                        <li key={index} className={`flex items-center ${index !== stages.length - 1 ? 'w-full' : ''}`}>
                            <div className="flex flex-col items-center relative">
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
    );
};

export default ChannelPartnerStepper;
