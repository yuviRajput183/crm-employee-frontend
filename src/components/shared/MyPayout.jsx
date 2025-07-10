import React from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Monitor } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";



const payoutData = [
    {
        label: "Gross Amount",
        value: "39,13,093",
        color: "bg-red-500",
        iconColor: "text-red-500"
    },
    {
        label: "Total Payout",
        value: "38,40,072",
        color: "bg-blue-500",
        iconColor: "text-blue-500",
    },
    {
        label: "TDS Amount",
        value: "38,186",
        color: "bg-teal-400",
        iconColor: "text-teal-400"
    },
    {
        label: "GST Amount",
        value: "73,021",
        color: "bg-amber-400",
        iconColor: "text-amber-400"
    },
];


const MyPayout = () => {
    return (
        <div className=' p-3 bg-white rounded shadow'>

            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Advisor Payout</h1>
                </div>
                <Button className=" bg-purple-950 px-10">Show Filter</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
                {payoutData.map((item, index) => (
                    <div
                        key={index}
                        className={` cursor-pointer text-white p-5 rounded-md shadow-md flex items-center justify-between ${item.color} opacity-`}
                    >
                        <div>
                            <h2 className="text-md font-semibold">{item.label}</h2>
                            <p className="text-xl font-bold mt-1">{item.value}</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded shadow-md">
                            <Monitor className={`w-5 h-5 ${item.iconColor}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyPayout
