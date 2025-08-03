import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import businessLoan from '@/assets/images/businessLoan.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import BusinessLoanForm from './BusinessLoanForm';


const BusinessLoan = () => {

    const [selectedAdvisor, setSelectedAdvisor] = useState(null);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={businessLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Business Loan</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <BusinessLoanForm selectedAdvisor={selectedAdvisor}></BusinessLoanForm>}


        </div>
    )
}

export default BusinessLoan
