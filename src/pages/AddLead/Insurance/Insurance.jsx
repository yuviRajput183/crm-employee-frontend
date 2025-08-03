import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import insurance from '@/assets/images/insurance.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import InsuranceForm from './InsuranceForm';



const Insurance = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');

    console.log("selectedAdvisor>>", selectedAdvisor);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={insurance} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Insurance</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <InsuranceForm selectedAdvisor={selectedAdvisor}></InsuranceForm>}


        </div>
    )
}

export default Insurance
