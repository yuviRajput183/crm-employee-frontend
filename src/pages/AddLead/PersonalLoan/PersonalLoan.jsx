import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import personalLoan from '@/assets/images/personalLoan.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import PersonalLoanForm from './PersonalLoanForm';

const PersonalLoan = () => {

    const [selectedAdvisor, setSelectedAdvisor] = useState(null);



    console.log("selectedAdvisor>>", selectedAdvisor);

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={personalLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Personal Loan</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <PersonalLoanForm selectedAdvisor={selectedAdvisor}></PersonalLoanForm>}


        </div>
    )
}

export default PersonalLoan
