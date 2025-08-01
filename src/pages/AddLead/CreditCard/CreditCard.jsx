import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import creditCard from '@/assets/images/creditCard.jpg';
import SelectAdvisorName from '@/components/SelectAdvisorName';
import CreditCardForm from './CreditCardForm';



const CreditCrad = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState('');

    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={creditCard} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Credit Card</h1>
            </div>


            {!selectedAdvisor && <SelectAdvisorName
                selectedAdvisor={selectedAdvisor}
                setSelectedAdvisor={setSelectedAdvisor}
            />}

            {selectedAdvisor && <CreditCardForm></CreditCardForm>}


        </div>
    )
}

export default CreditCrad;
