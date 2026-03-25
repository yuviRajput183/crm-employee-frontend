import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import barchart from "@/assets/images/barchat.png";
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();

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
                <Button
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/receivables_report')}
                >
                    RECEIVABLES REPORT
                </Button>
                <Button
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/gst_receivables_report')}
                >
                    GST RECEIVABLE REPORT
                </Button>
                <Button
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/payables_report')}
                >
                    PAYABLES REPORT
                </Button>
                <Button
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/gst_payables_report')}
                >
                    GST PAYABLES REPORT
                </Button>
                <Button
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/performance_report')}
                >
                    PERFORMANCE REPORT
                </Button>
                <Button 
                    className=" bg-blue-900 hover:bg-blue-400 opacity-85 h-[55px] text-lg"
                    onClick={() => navigate('/admin/lead_download')}
                >
                    LEAD DOWNLOAD
                </Button>
            </div>


        </div>
    )
}

export default Reports
