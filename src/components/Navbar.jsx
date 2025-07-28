import React from 'react'
import logo from '@/assets/images/crm-logo.jpg';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KeySquare, LogOut, UserRound, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Alert } from './ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';



const Navbar = ({ setIsSidebarOpen, isSidebarOpen, name }) => {

    const navigate = useNavigate();

    const { logOut } = useAuth();
    const { mutateAsync, isError, error } = logOut;

    const handleLogout = async () => {
        console.log("handleLogout function initiated...");

        try {
            const res = await mutateAsync();

            console.log("response of logOut api call>>", res?.data?.data);

            if (res?.data?.success) {
                alert(res?.data?.message);
                localStorage.removeItem("token");
                localStorage.removeItem("profile");
                // const redirectPath = res?.data?.data?.role === "employee" ? "/admin/dashboard" : "/advisor/dashboard";
                navigate("/sign-in");
            }
        } catch (error) {
            console.log("Error in LogOut api call>>", error);
        }
    }

    return (
        <nav className=' h-16 px-4 sm:px-8 md:px-12 flex items-center justify-between border-b-2 overflow-hidden'>

            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}
            {/* left navbar */}
            <div className=' h-full'>
                <img src={logo} className=' h-full cursor-pointer'></img>
            </div>

            {/* right navbar */}
            <div className=' flex gap-4 items-center'>
                <Button className=' bg-blue-500 hover:bg-black'>New Leads</Button>

                <DropdownMenu>

                    <DropdownMenuTrigger className=' flex gap-2 items-center cursor-pointer'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className=' font-bold'>{name}</h1>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className='cursor-pointer'>
                        <DropdownMenuLabel className=' flex gap-2'>
                            <UserRound />
                            My Profile
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className=' flex gap-2'>
                            <KeySquare />
                            Change Password
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className=' flex gap-2' onClick={handleLogout}>
                            <LogOut />
                            Logout
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Hamburger menu - visible only on small screens */}
                <div className="flex items-center justify-center md:hidden border-2 bg-gray-200">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
