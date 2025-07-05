import Navbar from '@/components/Navbar'
import React from 'react'
import { Monitor, NotebookPen, LayoutDashboard, ChartNoAxesCombined, ChartGantt } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { Slider } from "@/components/ui/slider";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";
import image4 from "@/assets/images/image4.jpg";
import image5 from "@/assets/images/image5.jpg";

import Footer from '@/components/Footer';


import personalLoan from '@/assets/images/personalLoan.jpg';
import businessLoan from '@/assets/images/businessLoan.jpg';
import homeLoan from '@/assets/images/homeLoan.jpg';
import loanAgainstProperty from '@/assets/images/loanAgainstProperty.jpg';
import carLoan from '@/assets/images/carLoan.jpg';
import usedCarLoan from '@/assets/images/usedCarLoan.jpg';
import insurance from '@/assets/images/insurance.jpg';
import privateFunding from '@/assets/images/privateFunding.jpg';
import services from '@/assets/images/services.png';

const images = [image1, image2, image3, image4, image5];

const leadStatusData = [
    { label: "Total Leads", count: 0, colorKey: "total" },
    { label: "Under Process", count: 0, percent: 0, colorKey: "process" },
    { label: "Approved", count: 0, percent: 0, colorKey: "approved" },
    { label: "Disbursed", count: 0, percent: 0, colorKey: "disbursed" },
];

const statusColors = {
    total: "text-rose-500",
    process: "text-blue-500",
    approved: "text-orange-500",
    disbursed: "text-teal-500",
};

const disbursalData = [
    {
        id: 1,
        title: "Disbursal Till Date",
        count: 0,
        textColor: "text-blue-600",
        iconBg: "bg-blue-500",
    },
    {
        id: 2,
        title: "Disbursal This Year",
        count: 0,
        textColor: "text-green-500",
        iconBg: "bg-green-400",
    },
    {
        id: 3,
        title: "Disbursal This Month",
        count: 0,
        textColor: "text-orange-400",
        iconBg: "bg-orange-400",
    },
];

const products = [
    { name: 'Personal Loan', img: personalLoan },
    { name: 'Business Loan', img: businessLoan },
    { name: 'Home Loan', img: homeLoan },
    { name: 'Loan Against Property', img: loanAgainstProperty },
    { name: 'Car Loan', img: carLoan },
    { name: 'Used Car Loan', img: usedCarLoan },
    { name: 'Insurance', img: insurance },
    { name: 'Private Funding', img: privateFunding },
    { name: 'Services', img: services },
];

const Dashboard = () => {
    return (
        <div className=' flex-1 p-2 '>

            <div className=' w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 shadow-md rounded-md'>
                {leadStatusData.map((item, index) => (
                    <div key={index} className="p-3 flex flex-col gap-2">
                        <h2 className="font-semibold">{item.label}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">{item.count}</span>
                            {item.percent !== undefined && <span className={`text-sm font-semibold ${statusColors[item.colorKey]}`}>
                                {item.percent}%
                            </span>}
                        </div>
                        <Slider
                            defaultValue={[item.percent]}
                            max={100}
                            step={1}
                            disabled
                            className="mt-2"
                            thumbClassName={`border-2 ${statusColors[item.colorKey]} bg-white`}
                        />
                    </div>
                ))}
            </div>

            <div className=' flex flex-col lg:flex-row w-full mt-4'>

                {/* Carousel  */}
                <div className=" flex-[6.5] w-full relative">
                    <Carousel className="  w-full">
                        <CarouselContent>
                            {images.map((img, index) => (
                                <CarouselItem key={index} className="w-full">
                                    <img
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        className=" w-full h-[450px] object-cover rounded-md"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className=' absolute left-2' />
                        <CarouselNext className=' absolute right-2' />
                    </Carousel>
                </div>

                {/* right side content */}
                <div className='flex-[3.5] lg:p-2 flex flex-col gap-2 ' >
                    {
                        disbursalData.map((item) => (
                            <div key={item.id} className=' border-2 p-2 flex gap-2 flex-col flex-1 rounded-md shadow-md '>
                                <h1 className=' font-semibold'>{item.title}</h1>

                                <div className=' flex items-center justify-between px-4'>
                                    <p className={`text-xl font-bold ${item.textColor}`}>
                                        {item.count}
                                    </p>
                                    <div
                                        className={`${item.iconBg} p-2 rounded-md text-white shadow-md cursor-pointer hover:rounded-full transition-all duration-300 `}>
                                        <Monitor size={24} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>

            {/* my products */}
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-2 font-semibold text-lg mb-4">
                    <ChartGantt />
                    <span className=' font-bold'>/ My Products /</span>
                </div>

                {/* Product Cards */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between border-2 border-indigo-300 rounded-md p-4 bg-white shadow-sm w-full md:w-[calc(33.33%-1rem)] min-w-[250px] hover:shadow-md transition-shadow"
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

            {/* Footer */}
            <Footer></Footer>

        </div>
    )
}

export default Dashboard
