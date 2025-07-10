import React, { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import ComponentLoader from '../loaders/ComponentLoader'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import EmployeeSidebar from '../EmployeeSidebar'
import AdvisorSidebar from '../AdvisorSidebar'



const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Function to close sidebar when menu item is clicked
    const handleMenuClick = () => {
        setIsSidebarOpen(false)
    }

    return (
        <div className=' bg-gray-50'>

            <Navbar
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="w-full flex overflow-hidden ">


                {/* Sidebar for md+ screens */}
                <div className="w-[225px] h-[80vh] hidden md:block">
                    {/* <AdvisorSidebar onMenuClick={handleMenuClick} /> */}
                    {/* <EmployeeSidebar onMenuClick={handleMenuClick}></EmployeeSidebar> */}
                    <Sidebar onMenuClick={handleMenuClick}></Sidebar>
                </div>

                {/* Sidebar for small screens - overlay style */}
                {isSidebarOpen && (
                    <div className='w-full z-50'>
                        <div className="sticky z-50  h-full w-[225px] bg-white shadow-lg md:hidden">
                            {/* <AdvisorSidebar onMenuClick={handleMenuClick} /> */}
                            {/* <EmployeeSidebar onMenuClick={handleMenuClick} /> */}
                            <Sidebar onMenuClick={handleMenuClick}></Sidebar>
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
