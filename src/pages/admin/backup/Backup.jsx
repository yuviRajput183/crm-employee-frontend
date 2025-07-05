import React from 'react'
import backup from "@/assets/images/backup.png";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';


const Backup = () => {
    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar className=" rounded-none">
                    <AvatarImage src={backup} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Database Backup</h1>
            </div>

            <div className=' mt-4 p-3 py-6 rounded-md border border-gray-300'>
                <Button
                    type="submit"
                    className="bg-blue-950 hover:bg-blue-400 text-white"
                >
                    TAKE DATABASE BACKUP
                </Button>
            </div>
        </div>
    )
}

export default Backup
