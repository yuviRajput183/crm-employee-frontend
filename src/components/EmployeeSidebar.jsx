import React from 'react'
import { Monitor, NotebookPen, LayoutDashboard, ChartNoAxesCombined, Command, UserRound, FileCheck2, File, LaptopMinimal, ShieldHalf, Landmark, BriefcaseBusiness, Gauge } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'


const sidebarMenuList = [
    { id: 1, title: "Dashboard", path: "/employee/dashboard", icon: <Monitor /> },
    { id: 2, title: "Add Lead", path: "/employee/add_lead", icon: <NotebookPen /> },
    { id: 3, title: "New Lead", path: "/employee/new_leads", icon: <LayoutDashboard /> },
    { id: 4, title: "My Lead", path: "/employee/my_leads", icon: <ChartNoAxesCombined /> },
    { id: 5, title: "Advisor Payout", path: "/employee/advisor_payout", icon: <NotebookPen /> },
    { id: 6, title: "My Performance", path: "/employee/my_performance", icon: <ChartNoAxesCombined /> }
]

const EmployeeSidebar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className=' h-full overflow-y-auto cursor-pointer scrollbar-thin  bg-gray-800'>
            {sidebarMenuList.map((menu) => (
                <div
                    key={menu.id} className={`flex gap-2 items-center p-4 text-white hover:bg-black border-b border-gray-500 border-opacity-15 ${location.pathname === menu.path ? 'bg-black' : 'bg-gray-800'}`}
                    onClick={() => { onMenuClick(); navigate(menu.path) }}
                >
                    {menu.icon}
                    <h1>{menu.title}</h1>
                </div>
            ))}
        </div>
    )
}

export default EmployeeSidebar
