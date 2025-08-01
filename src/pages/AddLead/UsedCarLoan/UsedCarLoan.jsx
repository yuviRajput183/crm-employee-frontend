import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usedCarLoan from '@/assets/images/usedCarLoan.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import UsedCarLoanForm from './UsedCarLoanForm';



const UsedCarLoan = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={usedCarLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Used Car Loan</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <UsedCarLoanForm></UsedCarLoanForm>}


        </div>
    )
}

export default UsedCarLoan
