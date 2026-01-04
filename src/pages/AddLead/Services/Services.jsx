import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import services from '@/assets/images/services.png';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import ServicesForm from './ServicesForm';

// Helper function to get user role and profile
const getUserProfile = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        return profile;
    } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        return null;
    }
};

const Services = () => {
    const profile = getUserProfile();
    const isAdvisor = profile?.role?.toLowerCase() === "advisor";

    // If user is advisor, use their profile as selectedAdvisor, otherwise start with empty
    const [selectedAdvisor, setSelectedAdvisor] = useState(isAdvisor ? profile : '');

    console.log("selectedAdvisor>>", selectedAdvisor);

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={services} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Services</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <ServicesForm selectedAdvisor={selectedAdvisor}></ServicesForm>}


        </div>
    )
}

export default Services;
