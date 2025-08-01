import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import instantLoan from '@/assets/images/instantLoan.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import InstantLoanForm from './InstantLoanForm';



const InstantLoan = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={instantLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Instant Loan</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <InstantLoanForm></InstantLoanForm>}


        </div>
    )
}

export default InstantLoan;
