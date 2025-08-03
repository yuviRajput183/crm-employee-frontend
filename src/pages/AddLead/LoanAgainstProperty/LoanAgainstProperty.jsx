import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import loanAgainstProperty from '@/assets/images/loanAgainstProperty.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import LoanAgainstPropertyForm from './LoanAgainstPropertyForm';



const LoanAgainstProperty = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');


    console.log("selectedAdvisor>>", selectedAdvisor);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={loanAgainstProperty} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Loan Against Property</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <LoanAgainstPropertyForm selectedAdvisor={selectedAdvisor}></LoanAgainstPropertyForm>}


        </div>
    )
}

export default LoanAgainstProperty
