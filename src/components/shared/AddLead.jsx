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
    { name: 'Instant Loan', img: instantLoan, path: "instant_loan" },
    { name: 'Personal Loan', img: personalLoan, path: "personal_loan" },
    { name: 'Business Loan', img: businessLoan, path: "business_loan" },
    { name: 'Home Loan', img: homeLoan, path: "home_loan" },
    { name: 'Loan Against Property', img: loanAgainstProperty, path: "loan_against_property" },
    { name: 'Car Loan', img: carLoan, path: "car_loan" },
    { name: 'Used Car Loan', img: usedCarLoan, path: "used_car_loan" },
    { name: 'Insurance', img: insurance, path: "insurance" },
    { name: 'Services', img: services, path: "services" },
    { name: 'Credit Card', img: creditCard, path: "credit_card" },
    { name: 'Others', img: privateFunding, path: "others" },
];

// Helper function to get role-based path prefix
const getRoleBasedPrefix = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        const role = profile?.role?.toLowerCase();

        if (role === "employee") {
            return "/employee";
        } else if (role === "advisor") {
            return "/advisor";
        } else {
            // Default to admin for admin users or if role is not recognized
            return "/admin";
        }
    } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        return "/admin"; // Default fallback
    }
};

const AddLead = () => {

    const navigate = useNavigate();
    const rolePrefix = getRoleBasedPrefix();


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
                        onClick={() => navigate(`${rolePrefix}/${product?.path}`)}
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
