import React, { Suspense, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ComponentLoader from '../loaders/ComponentLoader'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import EmployeeSidebar from '../EmployeeSidebar'
import AdvisorSidebar from '../AdvisorSidebar'



const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
            />

            <div className="w-full flex overflow-hidden ">


                {/* Sidebar for md+ screens */}
                <div className="w-[225px] h-[80vh] hidden md:block">
                    {renderSidebar()}
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
