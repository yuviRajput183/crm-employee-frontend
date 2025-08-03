import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import carLoan from '@/assets/images/carLoan.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import CarLoanForm from './CarLoanForm';



const CarLoan = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');


    console.log("selectedAdvisor>>", selectedAdvisor);


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={carLoan} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Car Loan</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <CarLoanForm selectedAdvisor={selectedAdvisor}></CarLoanForm>}


        </div>
    )
}

export default CarLoan
