import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiAdminStatistics, apiEmployeeStatistics, apiAdvisorStatistics } from '@/services/lead.api';
import { useSlider } from '@/lib/hooks/useSlider';


import personalLoan from '@/assets/images/personalLoan.jpg';
import businessLoan from '@/assets/images/businessLoan.jpg';
import homeLoan from '@/assets/images/homeLoan.jpg';
import loanAgainstProperty from '@/assets/images/loanAgainstProperty.jpg';
import carLoan from '@/assets/images/carLoan.jpg';
import usedCarLoan from '@/assets/images/usedCarLoan.jpg';
import insurance from '@/assets/images/insurance.jpg';
import privateFunding from '@/assets/images/privateFunding.jpg';
import services from '@/assets/images/services.png';

const defaultImages = [image1, image2, image3, image4, image5];

const statusColors = {
    total: "text-red-500",
    process: "text-blue-500",
    approved: "text-orange-500",
    disbursed: "text-teal-500",
};

const products = [
    { name: 'Personal Loan', img: personalLoan, path: "personal_loan" },
    { name: 'Business Loan', img: businessLoan, path: "business_loan" },
    { name: 'Home Loan', img: homeLoan, path: "home_loan" },
    { name: 'Loan Against Property', img: loanAgainstProperty, path: "loan_against_property" },
    { name: 'Car Loan', img: carLoan, path: "car_loan" },
    { name: 'Used Car Loan', img: usedCarLoan, path: "used_car_loan" },
    { name: 'Insurance', img: insurance, path: "insurance" },
    { name: 'Private Funding', img: privateFunding, path: "others" },
    { name: 'Services', img: services, path: "services" },
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

// Helper function to get user role
const getUserRole = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        return profile?.role?.toLowerCase() || "admin";
    } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        return "admin";
    }
};

// Helper function to get statistics API based on role
const getStatisticsApiByRole = (role) => {
    switch (role) {
        case "employee":
            return apiEmployeeStatistics;
        case "advisor":
            return apiAdvisorStatistics;
        default:
            return apiAdminStatistics;
    }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const rolePrefix = getRoleBasedPrefix();
    const userRole = getUserRole();

    const { fetchSliders } = useSlider();
    const { data: sliderData } = fetchSliders;
    const [sliderImages, setSliderImages] = useState(defaultImages);

    // Update slider images when data is fetched
    useEffect(() => {
        if (sliderData?.data?.data && sliderData.data.data.length > 0) {
            const sliders = sliderData.data.data[0];
            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '');
            const fetchedImages = [];

            ['slider1', 'slider2', 'slider3', 'slider4', 'slider5'].forEach(key => {
                if (sliders[key]) {
                    fetchedImages.push(`${baseUrl}/uploads/sliders/${sliders[key]}`);
                }
            });

            if (fetchedImages.length > 0) {
                setSliderImages(fetchedImages);
            }
        }
    }, [sliderData]);

    const [leadStatusData, setLeadStatusData] = useState([
        { label: "Total Leads", count: 0, colorKey: "total" },
        { label: "Under Process", count: 0, percent: 0, colorKey: "process" },
        { label: "Approved", count: 0, percent: 0, colorKey: "approved" },
        { label: "Disbursed", count: 0, percent: 0, colorKey: "disbursed" },
    ]);

    const [disbursalData, setDisbursalData] = useState([
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
    ]);

    // Fetch statistics based on role
    const { data: statisticsData, isLoading, isError } = useQuery({
        queryKey: ['dashboard-statistics', userRole],
        queryFn: getStatisticsApiByRole(userRole),
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("Statistics data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching statistics:", err);
        }
    });

    // Update state when statistics data is fetched
    useEffect(() => {
        if (statisticsData?.data?.data) {
            const stats = statisticsData.data.data;

            // Update lead status data based on actual API response
            setLeadStatusData([
                { label: "Total Leads", count: stats.totalLeads || 0, colorKey: "total" },
                { label: "Under Process", count: 0, percent: parseFloat(stats.percentageUnderProcess) || 0, colorKey: "process" },
                { label: "Approved", count: 0, percent: parseFloat(stats.percentageApproved) || 0, colorKey: "approved" },
                { label: "Disbursed", count: 0, percent: parseFloat(stats.percentageDisbursed) || 0, colorKey: "disbursed" },
            ]);

            // Update disbursal data based on actual API response
            setDisbursalData([
                {
                    id: 1,
                    title: "Disbursal Till Date",
                    count: stats.totalDisbursalAmount || 0,
                    textColor: "text-blue-600",
                    iconBg: "bg-blue-500",
                },
                {
                    id: 2,
                    title: "Disbursal This Year",
                    count: stats.totalDisbursalAmountThisYear || 0,
                    textColor: "text-green-500",
                    iconBg: "bg-green-400",
                },
                {
                    id: 3,
                    title: "Disbursal This Month",
                    count: stats.totalDisbursalAmountThisMonth || 0,
                    textColor: "text-orange-400",
                    iconBg: "bg-orange-400",
                },
            ]);
        }
    }, [statisticsData]);

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
                            {sliderImages.map((img, index) => (
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
                            onClick={() => navigate(`${rolePrefix}/${product?.path}`)}
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

            {/* Footer */}
            <Footer></Footer>

        </div>
    )
}

export default Dashboard
