import React from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";


const HistoryTable = ({ data = [] }) => {
    console.log("data>>>", data);

    return (
        <>
            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>Comment History With Advisor</h1>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[50vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-900 text-white hover:bg-green-900">
                            <TableHead className="text-white">Feedback</TableHead>
                            <TableHead className="text-white">Comment By</TableHead>
                            <TableHead className="text-white">Comment Date</TableHead>
                            <TableHead className="text-white">Remarks</TableHead>
                            <TableHead className="text-white">Reply Date</TableHead>
                            <TableHead className="text-white">Advisor Reply</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=" ">
                        {data.map((history, index) => (
                            <TableRow
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                            >
                                <TableCell>{history.feedback}</TableCell>
                                <TableCell>{history.commentBy}</TableCell>
                                <TableCell>{history.commentDate}</TableCell>
                                <TableCell>{history.remarks}</TableCell>
                                <TableCell>{history.replyDate}</TableCell>
                                <TableCell>{history.advisorReply}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default HistoryTable
