import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';

const Reports = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex items-center gap-2 pb-2 border-b-2  '>
                <Avatar >
                    <AvatarImage src={barchart} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Reports</h1>
            </div>

            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 shadow mt-4 border border-gray-100 rounded-md p-4 bg-white">
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">RECEIVABLES REPORT</Button>
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">GST RECEIVABLE REPORT</Button>
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">PAYABLES REPORT</Button>
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">GST PAYABLES REPORT</Button>
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">PERFORMANCE REPORT</Button>
                <Button className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg">LEAD DOWNLOAD</Button>
            </div>


        </div>
    )
}

export default Reports
