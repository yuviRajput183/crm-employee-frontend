import React, { Suspense, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ComponentLoader from '../loaders/ComponentLoader'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import EmployeeSidebar from '../EmployeeSidebar'
import AdvisorSidebar from '../AdvisorSidebar'



const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Function to close sidebar when menu item is clicked
    const handleMenuClick = () => {
        setIsSidebarOpen(false)
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const profileData = localStorage.getItem("profile");

        if (!token) {
            navigate("/sign-in");
        }

        if (profileData) {
            try {
                setProfile(JSON.parse(profileData));
            } catch (error) {
                console.error("Invalid profile data", error);
            }
        }
    }, []);

    console.log("profile of logged in person>>", profile);

    const renderSidebar = () => {
        if (!profile) return null;

        if (profile?.role === 'admin') {
            return <Sidebar onMenuClick={handleMenuClick} isOwner={profile?.isOwner} />;
        } else if (profile?.role === 'employee') {
            return <EmployeeSidebar onMenuClick={handleMenuClick} />;
        } else if (profile?.role === 'advisor') {
            return <AdvisorSidebar onMenuClick={handleMenuClick} />;
        } else {
            return null;
        }
    };


    return (
        <div className=' bg-gray-50'>

            <Navbar
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                name={profile?.name}
                role={profile?.role}
            />

            <div className="w-full flex overflow-hidden ">


                {/* Sidebar for md+ screens */}
                <div className={`relative transition-all duration-300 hidden md:block z-[60] ${isDesktopSidebarOpen ? 'w-[225px]' : 'w-0'}`}>
                    <div className={`h-[80vh] overflow-hidden ${isDesktopSidebarOpen ? 'w-[225px]' : 'w-0'}`}>
                        {renderSidebar()}
                    </div>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                        className={`absolute top-4 bg-white border border-gray-300 shadow-lg rounded-full p-2 z-[100] text-gray-700 hover:text-black hover:bg-gray-200 transition-all ${isDesktopSidebarOpen ? '-right-5' : '-right-10'}`}
                        title={isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {isDesktopSidebarOpen ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
                        </svg>
                    </button>
                </div>

                {/* Sidebar for small screens - overlay style */}
                {isSidebarOpen && (
                    <div className='w-full z-50'>
                        <div className="sticky z-50  h-full w-[225px] bg-white shadow-lg md:hidden">
                            {renderSidebar()}
                        </div>
                    </div>
                )}


                {/* Main Content */}
                <div className="flex-1 overflow-x-auto p-2">
                    <Suspense fallback={<ComponentLoader />}>
                        <Outlet></Outlet>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default UserLayout
