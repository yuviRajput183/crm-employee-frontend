import React, { useEffect, useState } from 'react'
import { Monitor, NotebookPen, LayoutDashboard, ChartNoAxesCombined, Command, UserRound, FileCheck2, File, LaptopMinimal, ShieldHalf, Landmark, BriefcaseBusiness, Gauge } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate, useLocation } from 'react-router-dom'


const sidebarMenuList = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: <Monitor /> },
    { id: 2, title: "Add Lead", path: "/admin/add_lead", icon: <NotebookPen /> },
    { id: 3, title: "New Lead", path: "/admin/new_leads", icon: <LayoutDashboard /> },
    { id: 4, title: "My Lead", path: "/admin/my_leads", icon: <ChartNoAxesCombined /> },
    { id: 5, title: "Advisor Payout", path: "/admin/advisor_payout", icon: <NotebookPen /> },
    { id: 6, title: "Invoices", path: "/admin/invoices", icon: <NotebookPen /> },
    { id: 7, title: "Receivables", path: "/admin/receivables_payout", icon: <NotebookPen /> },
    { id: 8, title: "Payables", path: "/admin/payable_payout", icon: <NotebookPen /> },
    { id: 9, title: "Delete Attachments", path: "/admin/delete_attachments", icon: <ChartNoAxesCombined /> },
    { id: 10, title: "Reports", path: "/admin/reports", icon: <NotebookPen /> },
]

// sidebar menu for admin only
const masterMenuList = [
    {
        id: 1, title: "Employee", icon: <UserRound />, subList: [
            { id: 1, title: "Add Employee", path: "/admin/add_employee", icon: <UserRound /> },
            { id: 2, title: "List Employee", path: "/admin/list_employee", icon: <UserRound /> },
        ]
    },
    {
        id: 2, title: "Employee Login", icon: <FileCheck2 />, subList: [
            { id: 1, title: "Add Employee Login", path: "/admin/add_login", icon: <UserRound /> },
            { id: 2, title: "List Employee Login", path: "/admin/list_login", icon: <UserRound /> },
        ]
    },
    {
        id: 3, title: "Advisor", icon: <LayoutDashboard />, subList: [
            { id: 1, title: "Add Advisor", path: "/admin/add_loan_advisor", icon: <UserRound /> },
            { id: 2, title: "List Advisor", path: "/admin/list_loan_advisor", icon: <UserRound /> },
        ]
    },
    {
        id: 4, title: "Advisor Login", icon: <File />, subList: [
            { id: 1, title: "Add Advisor Login", path: "/admin/add_advisor_login", icon: <UserRound /> },
            { id: 2, title: "List Advisor Login", path: "/admin/list_advisor_login", icon: <UserRound /> },
        ]
    },
    {
        id: 5, title: "Department", icon: <LaptopMinimal />, subList: [
            { id: 1, title: "Add Department", path: "/admin/add_department", icon: <LaptopMinimal /> },
            { id: 2, title: "List Department", path: "/admin/list_department", icon: <LaptopMinimal /> },
        ]
    },
    {
        id: 6, title: "Designation", icon: <LaptopMinimal />, subList: [
            { id: 1, title: "Add Designation", path: "/admin/add_designation", icon: <LaptopMinimal /> },
            { id: 2, title: "List Designation", path: "/admin/list_designation", icon: <LaptopMinimal /> },
        ]
    },
    {
        id: 7, title: "City", icon: <ShieldHalf />, subList: [
            { id: 1, title: "Add City", path: "/admin/add_city", icon: <Landmark /> },
            { id: 2, title: "List City", path: "/admin/list_city", icon: <Landmark /> },
        ]
    },
    {
        id: 8, title: "Bank Master", icon: <ShieldHalf />, subList: [
            { id: 1, title: "Add Bank", path: "/admin/add_bank", icon: <Landmark /> },
            { id: 2, title: "List Bank", path: "/admin/list_bank", icon: <Landmark /> },
        ]
    },
    {
        id: 9, title: "Banker Details", icon: <ShieldHalf />, subList: [
            { id: 1, title: "Add Banker Details", path: "/admin/add_banker_details", icon: <Landmark /> },
            { id: 2, title: "List Banker Details", path: "/admin/list_banker_details", icon: <Landmark /> },
        ]
    },
    {
        id: 10, title: "Processed By", icon: <ShieldHalf />, subList: [
            { id: 1, title: "Add Processed By", path: "/admin/add_processed_by", icon: <Landmark /> },
            { id: 2, title: "List Processed By", path: "/admin/list_processed_by", icon: <Landmark /> },
        ]
    },
    { id: 11, title: "Payout", path: "/admin/add_payout_document", icon: <BriefcaseBusiness />, subList: [] },
    { id: 12, title: "Slider Images", path: "/admin/add_slider_images", icon: <LaptopMinimal />, subList: [] },
    { id: 13, title: "Company Profile", path: "/admin/company_profile", icon: <NotebookPen />, subList: [] },
    { id: 14, title: "Licenses", path: "/admin/licenses", icon: <NotebookPen />, subList: [] },
    { id: 15, title: "Backup Database", path: "/admin/backup", icon: <NotebookPen />, subList: [] },
    { id: 16, title: "Transactions", path: "/dashboard", icon: <Gauge />, subList: [], shouldCloseMaster: true }
]

const Sidebar = ({ onMenuClick, isOwner }) => {
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({}); // store which menus are expanded
    const navigate = useNavigate();
    const location = useLocation();


    console.log("isOwner>>", isOwner);

    // this function is called when the parent menu is clicked
    const toggleMenu = (id) => {
        setOpenMenus((prev) => ({
            ...prev,
            [id]: !prev[id]  // flips the current state (open to close, close to open)
        }));
    };



    return (
        <div className=' h-full overflow-y-auto cursor-pointer scrollbar-thin'>

            <div className=' flex gap-2 items-center p-4 bg-gray-800 text-white hover:bg-black' onClick={(() => setIsMasterOpen(true))}>
                <Command />
                <h1>Master</h1>
            </div>

            <div>
                {!isMasterOpen && sidebarMenuList.map((menu) => (
                    <div
                        key={menu.id} className={`flex gap-2 items-center p-4 text-white hover:bg-black ${location.pathname === menu.path ? 'bg-black' : 'bg-gray-800'}`}
                        onClick={() => { onMenuClick(); navigate(menu.path) }}
                    >
                        {menu.icon}
                        <h1>{menu.title}</h1>
                    </div>
                ))}

                {isMasterOpen && masterMenuList.filter((menu) => {
                    // Hide these 3 menus if not owner (i.e., admin)
                    if (!isOwner && ["Department", "Designation", "City", "Company Profile", "Backup Database"].includes(menu.title)) {
                        return false;
                    }
                    return true;
                })?.map((menu) => (
                    menu.subList.length > 0 ? (
                        <div key={menu.id}>

                            {/* always show the parent menu */}
                            <div
                                key={menu.id}
                                onClick={() => toggleMenu(menu.id)}
                                className={`flex gap-2 items-center p-4 text-gray-100 hover:bg-black border-b-1 border-white ${openMenus[menu.id] ? 'bg-black' : 'bg-gray-800'}`}
                            >
                                {menu.icon}
                                <h1>{menu.title}</h1>
                                <span className=' ml-auto text-xs'>▼</span>
                            </div>

                            {/* show the submenus only if the parent menu is open */}
                            {openMenus[menu.id] && menu.subList.map((sub) => (
                                <div
                                    key={sub.id} className={`pl-5 text-[12px] flex gap-2 items-center p-3 text-white hover:bg-black ${location.pathname === sub.path ? 'bg-black' : 'bg-gray-800'}`}
                                    onClick={() => { onMenuClick(); navigate(sub.path) }}
                                >
                                    {sub.icon}
                                    <h3>{sub.title}</h3>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                if (menu.shouldCloseMaster) {
                                    // close the master menu list
                                    setIsMasterOpen(false);
                                    navigate("/admin/dashboard")
                                } else {
                                    navigate(menu.path)
                                }
                            }}
                            key={menu.id} className={`flex gap-2 items-center p-4 text-white hover:bg-black ${location.pathname === menu.path ? 'bg-black' : 'bg-gray-800'}`}>
                            {menu.icon}
                            <h1>{menu.title}</h1>
                        </div>
                    )
                ))}
            </div>
        </div >
    )
}

export default Sidebar
