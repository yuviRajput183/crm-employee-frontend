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
import { KeySquare, LogOut, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



const Navbar = () => {
    return (
        <nav className=' h-16 px-4 sm:px-8 md:px-12 flex items-center justify-between border-b-2 overflow-hidden'>

            {/* left navbar */}
            <div className=' h-full'>
                <img src={logo} className=' h-full cursor-pointer'></img>
            </div>

            {/* right navbar */}
            <div className=' flex gap-4'>
                <Button className=' bg-blue-500 hover:bg-black'>New Leads</Button>

                <DropdownMenu>

                    <DropdownMenuTrigger className=' flex gap-2 items-center cursor-pointer'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className=' font-bold'>Yuvraj</h1>
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

                        <DropdownMenuLabel className=' flex gap-2'>
                            <LogOut />
                            Logout
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </nav>
    )
}

export default Navbar
