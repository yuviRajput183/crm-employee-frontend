import React, { useEffect, useState } from 'react'
import money from "@/assets/images/money.png"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { useQuery } from '@tanstack/react-query';
import { apiListPayables } from '@/services/payables.api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdvisorInvoicesFilter from './AdvisorInvoicesFilter';
import { usePayables } from '@/lib/hooks/usePayables';
import { Alert } from '../ui/alert';
import AddPayables from './AddPayables';


const filterSchema = z.object({
    loanServiceType: z.string().optional(),
    advisorName: z.string().optional(),
    clientName: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})


const Payables = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [leads, setLeads] = useState([]);
    const [showAddPayable, setShowAddPayable] = useState(false);

    const navigate = useNavigate();

    // fetching payables on component mount and on filtering
    const {
        isError: isPayablesError,
        error: payablesError,
        data: queryData,
        refetch
    } = useQuery({
        queryKey: ['payables', filterParams],
        queryFn: async () => {
            const res = await apiListPayables(filterParams);
            console.log("📦 queryFn response of list payables:", res);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching my list payables:", err);
        }
    });

    console.log("payables data >>>", queryData);

    useEffect(() => {
        if (queryData?.data?.data?.payables?.length > 0) {
            setLeads(queryData.data.data.payables);
        } else if (queryData?.data?.data) {
            setLeads([]);
        }
    }, [queryData]);

    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            loanServiceType: '',
            advisorName: '',
            clientName: '',
            fromDate: '',
            toDate: '',
        },
    })


    const handleFilter = async (values) => {
        console.log("submitting values for filter>>", values);

        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '' && val !== undefined)
        );


        //  Convert loanServiceType to productType
        const mappedParams = {
            ...cleanParams,
            ...(cleanParams.loanServiceType && { productType: cleanParams.loanServiceType })
        };

        // Remove loanServiceType so API only receives productType
        delete mappedParams.loanServiceType;

        setFilterParams(mappedParams);
        setShowFilter(false);
    };


    const { deletePayable } = usePayables();
    const { mutateAsync, isLoading, isError, error } = deletePayable;

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {

            const res = await mutateAsync(id);

            console.log("res>>", res);
            if (res?.data?.success) {
                refetch();
            }
        }
    };


    return (
        <div className=' p-3 bg-white rounded shadow'>


            {/* Heading */}
            <div className=' flex justify-between items-center pb-2 border-b-2 '>
                <div className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={money} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className=' text-2xl text-bold'>Payable Payout</h1>
                </div>
                {!showAddPayable && <div className=' flex items-center gap-2'>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button>
                    <Button className=" bg-purple-950 px-10" onClick={() => setShowAddPayable(!showAddPayable)}>Add +</Button>
                </div>
                }
            </div>


            {isPayablesError && (
                <Alert variant="destructive">{getErrorMessage(payablesError)}</Alert>
            )}
            {isError && (
                <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}

            {showAddPayable ? <AddPayables onClose={() => setShowAddPayable(false)} /> : <>
                {showFilter && <AdvisorInvoicesFilter form={form} handleFilter={handleFilter} showFilter={showFilter}></AdvisorInvoicesFilter>}


                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-900 text-white hover:bg-green-900 cursor-pointer">
                                <TableHead className="text-white">Lead No</TableHead>
                                <TableHead className="text-white">Loan Type</TableHead>
                                <TableHead className="text-white">Customer Name</TableHead>
                                <TableHead className="text-white">Advisor Name</TableHead>
                                <TableHead className="text-white">Payment Against</TableHead>
                                <TableHead className="text-white">Paid On</TableHead>
                                <TableHead className="text-white">Paid Amt.</TableHead>
                                <TableHead className="text-white">Ref. No</TableHead>
                                <TableHead className="text-white">Remarks</TableHead>
                                <TableHead className="text-white">Edit</TableHead>
                                <TableHead className="text-white">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((item, index) => (
                                <TableRow
                                    key={item?._id}
                                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                                >
                                    <TableCell>{item?.leadId?.leadNo}</TableCell>
                                    <TableCell>{item?.leadId?.productType}</TableCell>
                                    <TableCell>{item?.leadId?.clientName}</TableCell>
                                    <TableCell>{item?.advisorId?.name}</TableCell>
                                    <TableCell>{item?.paymentAgainst}</TableCell>
                                    <TableCell>{item?.paidDate?.split("T")[0]}</TableCell>
                                    <TableCell>{item?.paidAmount}</TableCell>
                                    <TableCell>{item?.refNo || "-"}</TableCell>
                                    <TableCell>{item?.remarks || "-"}</TableCell>

                                    <TableCell>
                                        <Button
                                            onClick={() => navigate(`/admin/edit_payable/${item?._id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            isLoading={isLoading}
                                            onClick={() => handleDelete(item?._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
            }

        </div>
    )
}

export default Payables
