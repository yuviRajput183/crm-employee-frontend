import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    console.log("selectedAdvisor>>", selectedAdvisor);

    return (
        <div className="mt-4 border rounded shadow p-4">
            <div className="w-[90%] md:max-w-md mx-auto">
                <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
                    <SelectTrigger className="w-full bg-blue-950 text-white font-semibold outline-none">
                        <SelectValue placeholder="SELECT ADVISOR NAME" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectGroup>
                            {advisorOptions.map((advisor) => (
                                <SelectItem
                                    key={advisor.code}
                                    value={advisor.code}
                                    className="whitespace-normal break-words outline-none"
                                >
                                    {advisor.label} - {advisor.code}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SelectAdvisorName;
