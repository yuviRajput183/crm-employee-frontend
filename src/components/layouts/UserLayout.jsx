import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import ComponentLoader from '../loaders/ComponentLoader'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'


const UserLayout = () => {
    return (
        <div className=' bg-gray-50'>

            <Navbar />

            <div className="w-full flex overflow-hidden ">
                {/* sidebar */}
                <div className="w-[225px] h-[80vh] hidden md:block">
                    <Sidebar />
                </div>

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
