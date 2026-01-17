import React from 'react'
import { Monitor, NotebookPen, LayoutDashboard, ChartNoAxesCombined } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'


const sidebarMenuList = [
    { id: 1, title: "Dashboard", path: "/advisor/dashboard", icon: <Monitor /> },
    { id: 2, title: "Add Lead", path: "/advisor/add_lead", icon: <NotebookPen /> },
    { id: 3, title: "Draft", path: "/advisor/drafts", icon: <LayoutDashboard /> },
    { id: 4, title: "My Lead", path: "/advisor/my_leads", icon: <ChartNoAxesCombined /> },
    { id: 5, title: "My Payout", path: "/advisor/my_payout", icon: <ChartNoAxesCombined /> },
    { id: 6, title: "Loan Documents List", path: "/assets/loan_document.pdf", icon: <ChartNoAxesCombined />, isExternal: true },
    { id: 7, title: "Payout Percentage", path: "/advisor/payout_percentage", icon: <ChartNoAxesCombined /> },
    { id: 8, title: "My Performance", path: "/advisor/my_performance", icon: <ChartNoAxesCombined /> }
]



const AdvisorSidebar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className=' h-full overflow-y-auto cursor-pointer scrollbar-thin  bg-gray-800'>
            {sidebarMenuList.map((menu) => (
                <div
                    key={menu.id} className={`flex gap-2 items-center p-4 text-white hover:bg-black border-b border-gray-500 border-opacity-15 ${location.pathname === menu.path ? 'bg-black' : 'bg-gray-800'}`}
                    onClick={() => {
                        onMenuClick();
                        if (menu.isExternal) {
                            window.open(menu.path, '_blank');
                        } else {
                            navigate(menu.path);
                        }
                    }}
                >
                    {menu.icon}
                    <h1>{menu.title}</h1>
                </div>
            ))}
        </div>
    )
}

export default AdvisorSidebar
