import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import instantLoan from '@/assets/images/instantLoan.jpg';
import personalLoan from '@/assets/images/personalLoan.jpg';
import businessLoan from '@/assets/images/businessLoan.jpg';
import homeLoan from '@/assets/images/homeLoan.jpg';
import loanAgainstProperty from '@/assets/images/loanAgainstProperty.jpg';
import carLoan from '@/assets/images/carLoan.jpg';
import usedCarLoan from '@/assets/images/usedCarLoan.jpg';
import insurance from '@/assets/images/insurance.jpg';
import services from '@/assets/images/services.png';
import creditCard from '@/assets/images/creditCard.jpg';
import privateFunding from '@/assets/images/privateFunding.jpg';
import { useNavigate } from 'react-router-dom';


const products = [
    { name: 'Instant Loan', img: instantLoan, path: "/admin/instant_loan" },
    { name: 'Personal Loan', img: personalLoan, path: "/admin/personal_loan" },
    { name: 'Business Loan', img: businessLoan, path: "/admin/business_loan" },
    { name: 'Home Loan', img: homeLoan, path: "/admin/home_loan" },
    { name: 'Loan Against Property', img: loanAgainstProperty, path: "/admin/loan_against_property" },
    { name: 'Car Loan', img: carLoan, path: "/admin/car_loan" },
    { name: 'Used Car Loan', img: usedCarLoan, path: "/admin/used_car_loan" },
    { name: 'Insurance', img: insurance, path: "/admin/insurance" },
    { name: 'Services', img: services, path: "/admin/services" },
    { name: 'Credit Card', img: creditCard, path: "/admin/credit_card" },
    { name: 'Others', img: privateFunding, path: "/admin/others" },
];

const AddLead = () => {

    const navigate = useNavigate();


    return (
        <div className='  px-6 py-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={privateFunding} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>My Products</h1>
            </div>

            {/* Product Cards */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mt-4">
                {products.map((product, index) => (
                    <div
                        onClick={() => navigate(product?.path)}
                        key={index}
                        className="flex items-center justify-between border-2 border-indigo-300 rounded-md p-4 bg-white shadow-sm w-full md:w-[calc(33.33%-1rem)] min-w-[250px] hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <img src={product.img} alt={product.name} className="w-10 h-10 object-contain" />
                            <span className="font-medium text-sm md:text-base">{product.name}</span>
                        </div>
                        <span className="text-xl text-gray-600 font-bold">&gt;</span>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default AddLead
