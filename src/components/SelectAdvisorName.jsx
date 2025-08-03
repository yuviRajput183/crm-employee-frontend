import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert } from "./ui/alert";
import { getErrorMessage } from "@/lib/helpers/get-message";
import { apiListAdvisor } from "@/services/advisor.api";
import { useQuery } from "@tanstack/react-query";



const SelectAdvisorName = ({ selectedAdvisor, setSelectedAdvisor }) => {
    const [advisors, setAdvisors] = useState([]);

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



    return (
        <div className="mt-4 border rounded shadow p-4">
            {isListAdvisorError && (
                <Alert variant="destructive">{getErrorMessage(listAdvisorError)}</Alert>
            )}
            <div className="w-[90%] md:max-w-md mx-auto">
                <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor} className=" text-white">
                    <SelectTrigger className="w-full bg-blue-950  text-white font-semibold outline-none">
                        <SelectValue placeholder="SELECT ADVISOR NAME" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectGroup>
                            {advisors?.map((advisor) => (
                                <SelectItem
                                    key={advisor?._id}
                                    value={advisor?._id}
                                    className="whitespace-normal break-words outline-none"
                                >
                                    {advisor?.name} - {advisor?.advisorCode}
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
