import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import barchart from "@/assets/images/barchat.png";
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { apiListAllLeads } from '@/services/attachments.api'; // reused since it points to /all-leads
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import ReportsFilterSection from './ReportsFilterSection';
import { useForm } from 'react-hook-form';
import { Download, FileText } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const LeadDownload = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({});
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    const form = useForm({
        defaultValues: {
            loanType: '',
            advisorName: '',
            status: '',
            fromDate: '',
            toDate: '',
        },
    });

    const {
        data: reportData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['lead-download', filterParams],
        queryFn: async () => {
            const res = await apiListAllLeads({ ...filterParams, limit: 1000 });
            return res?.data?.data?.leads || [];
        },
        refetchOnWindowFocus: false,
    });

    const handleFilter = (values) => {
        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== '')
        );
        setFilterParams(cleanParams);
    };

    const handleSelectLead = (leadId) => {
        setSelectedLeadId(prev => prev === leadId ? null : leadId);
    };

    const handleDownloadPDF = () => {
        if (!selectedLeadId) return alert("Please select a lead first.");
        const lead = reportData.find(l => l._id === selectedLeadId);
        if (!lead) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(10);
        doc.text(format(new Date(), 'dd-MM-yyyy'), 190, 15, { align: 'right' });
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Details-Sheet", 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const dataGrid = [
            ['Advisor :', lead.advisorId?.name || '', 'Loan Type :', lead.productType || ''],
            ['Client Name :', lead.clientName || '', 'Loan Amount :', lead.loanRequirementAmount || lead.carExShowroomPrice || ''],
            ['Mobile No :', lead.mobileNo || '', 'Email Id :', lead.emailId || ''],
            ['DOB :', lead.dob ? format(new Date(lead.dob), 'dd-MM-yyyy') : '', 'PAN No :', lead.panNo || ''],
            ['Aadhar No :', lead.aadharNo || '', 'Marital Status :', lead.maritalStatus || ''],
            ['Spouse Name :', lead.spouseName || '', 'Mother Name :', lead.motherName || ''],
            ['Other No :', lead.otherContactNo || '', 'Qualification :', lead.qualification || ''],
            ['Residence Type :', lead.residenceType || '', 'Residence Address :', lead.residentialAddress || ''],
            ['Residence Taken From :', lead.residentialAddressTakenFrom || '', 'Residence Stability :', lead.residentialStability || ''],
            ['State Name :', lead.stateName || '', 'City Name :', lead.cityName || ''],
            ['Pin Code :', lead.pinCode || '', 'Designation :', lead.designation || ''],
            ['Company Name :', lead.companyName || '', 'Company Address :', lead.companyAddress || ''],
            ['Net Salary :', lead.netSalary || '', 'Salary Transfer Mode :', lead.salaryTransferMode || ''],
            ['Job Period :', lead.jobPeriod || '', 'Total Job Exp :', lead.totalJobExperience || ''],
            ['Official Email Id :', lead.officialEmailId || '', 'Official Number :', lead.officialNumber || ''],
            ['No of Dependent :', lead.noOfDependent || '', 'Credit Card Outstanding :', lead.creditCardOutstandingAmount || '']
        ];

        autoTable(doc, {
            startY: 35,
            body: dataGrid,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40 },
                1: { cellWidth: 50 },
                2: { fontStyle: 'bold', cellWidth: 40 },
                3: { cellWidth: 50 }
            },
            margin: { left: 15, right: 15 }
        });

        const currentY = doc.lastAutoTable.finalY + 2;

        autoTable(doc, {
            startY: currentY,
            head: [['Any Running Loan ?', '', '', '', '']],
            body: [
                ['Loan Type', 'Loan Amount', 'Bank Name', 'EMI Amount', 'Paid EMI'],
                ...Array.from({ length: 4 }).map((_, i) => {
                    const loan = lead.runningLoans?.[i] || {};
                    return [loan.loanType || '', loan.loanAmount || '0', loan.bankName || '', loan.emiAmount || '0', loan.paidEmi || '0'];
                })
            ],
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: 15, right: 15 }
        });

        // References
        const refY = doc.lastAutoTable.finalY + 2;
        autoTable(doc, {
            startY: refY,
            head: [['Reference 1', '', '', '']],
            body: [
                ['Name', 'Mobile No', 'Address', 'Relation'],
                [lead.references?.[0]?.name || '', lead.references?.[0]?.mobileNo || '', lead.references?.[0]?.address || '', lead.references?.[0]?.relation || '']
            ],
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: 15, right: 15 }
        });

        const refY2 = doc.lastAutoTable.finalY + 2;
        autoTable(doc, {
            startY: refY2,
            head: [['Reference 2', '', '', '']],
            body: [
                ['Name', 'Mobile No', 'Address', 'Relation'],
                [lead.references?.[1]?.name || '', lead.references?.[1]?.mobileNo || '', lead.references?.[1]?.address || '', lead.references?.[1]?.relation || '']
            ],
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
            margin: { left: 15, right: 15 }
        });

        doc.save(`${lead.clientName}_Lead_Details.pdf`);
    };

    const handleDownloadWord = async () => {
        if (!selectedLeadId) return alert("Please select a lead first.");
        const lead = reportData.find(l => l._id === selectedLeadId);
        if (!lead) return;

        const makeRow = (label1, val1, label2, val2) => {
            return new DocxTableRow({
                children: [
                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: label1, bold: true })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new DocxTableCell({ children: [new Paragraph(val1 || '')], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: label2, bold: true })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new DocxTableCell({ children: [new Paragraph(val2 || '')], width: { size: 25, type: WidthType.PERCENTAGE } }),
                ],
            });
        };

        const table = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                makeRow('Advisor :', lead.advisorId?.name, 'Loan Type :', lead.productType),
                makeRow('Client Name :', lead.clientName, 'Loan Amount :', lead.loanRequirementAmount?.toString() || lead.carExShowroomPrice?.toString()),
                makeRow('Mobile No :', lead.mobileNo?.toString(), 'Email Id :', lead.emailId),
                makeRow('DOB :', lead.dob ? format(new Date(lead.dob), 'dd-MM-yyyy') : '', 'PAN No :', lead.panNo),
                makeRow('Aadhar No :', lead.aadharNo, 'Marital Status :', lead.maritalStatus),
                makeRow('Spouse Name :', lead.spouseName, 'Mother Name :', lead.motherName),
                makeRow('Other No :', lead.otherContactNo?.toString(), 'Qualification :', lead.qualification),
                makeRow('Residence Type :', lead.residenceType, 'Residence Address :', lead.residentialAddress),
                makeRow('Residence Taken From :', lead.residentialAddressTakenFrom, 'Residence Stability :', lead.residentialStability),
                makeRow('State Name :', lead.stateName, 'City Name :', lead.cityName),
                makeRow('Pin Code :', lead.pinCode?.toString(), 'Designation :', lead.designation),
                makeRow('Company Name :', lead.companyName, 'Company Address :', lead.companyAddress),
                makeRow('Net Salary :', lead.netSalary?.toString(), 'Salary Transfer Mode :', lead.salaryTransferMode),
                makeRow('Job Period :', lead.jobPeriod, 'Total Job Exp :', lead.totalJobExperience),
                makeRow('Official Email Id :', lead.officialEmailId, 'Official Number :', lead.officialNumber?.toString()),
                makeRow('No of Dependent :', lead.noOfDependent?.toString(), 'Credit Card Outstanding :', lead.creditCardOutstandingAmount?.toString()),
            ],
        });

        const makeLoanRow = (c1, c2, c3, c4, c5, isHeader = false) => {
            return new DocxTableRow({
                children: [c1, c2, c3, c4, c5].map(text => new DocxTableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: text || '0', bold: isHeader })] })]
                }))
            });
        };

        const runningLoansTable = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({
                    children: [new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Any Running Loan ?', bold: true })] })], columnSpan: 5 })]
                }),
                makeLoanRow('Loan Type', 'Loan Amount', 'Bank Name', 'EMI Amount', 'Paid EMI', true),
                ...Array.from({ length: 4 }).map((_, i) => {
                    const loan = lead.runningLoans?.[i] || {};
                    return makeLoanRow(loan.loanType || '', loan.loanAmount?.toString() || '0', loan.bankName || '', loan.emiAmount?.toString() || '0', loan.paidEmi?.toString() || '0');
                })
            ]
        });

        const makeRefRow = (name, mob, add, rel, isHeader = false) => {
            return new DocxTableRow({
                children: [name, mob, add, rel].map(text => new DocxTableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: text || '', bold: isHeader })] })]
                }))
            });
        };

        const refTable1 = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({ children: [new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Reference 1', bold: true })] })], columnSpan: 4 })] }),
                makeRefRow('Name', 'Mobile No', 'Address', 'Relation', true),
                makeRefRow(lead.references?.[0]?.name, lead.references?.[0]?.mobileNo?.toString(), lead.references?.[0]?.address, lead.references?.[0]?.relation)
            ]
        });

        const refTable2 = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({ children: [new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Reference 2', bold: true })] })], columnSpan: 4 })] }),
                makeRefRow('Name', 'Mobile No', 'Address', 'Relation', true),
                makeRefRow(lead.references?.[1]?.name, lead.references?.[1]?.mobileNo?.toString(), lead.references?.[1]?.address, lead.references?.[1]?.relation)
            ]
        });

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({ text: format(new Date(), 'dd-MM-yyyy'), alignment: 'right' }),
                    new Paragraph({ text: "Details-Sheet", alignment: 'center', heading: 'Heading1' }),
                    new Paragraph({ text: "" }),
                    table,
                    new Paragraph({ text: "" }),
                    runningLoansTable,
                    new Paragraph({ text: "" }),
                    refTable1,
                    new Paragraph({ text: "" }),
                    refTable2,
                ],
            }],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${lead.clientName}_Lead_Details.docx`);
        });
    };

    return (
        <div className='p-3 bg-white rounded shadow min-h-screen'>
            {/* Heading */}
            <div className='flex justify-between items-center pb-2 border-b-2'>
                <div className='flex items-center gap-2'>
                    <Avatar className="rounded-none w-8 h-8">
                        <AvatarImage src={barchart} className="object-contain" />
                        <AvatarFallback>LD</AvatarFallback>
                    </Avatar>
                    <h1 className='text-2xl font-bold text-gray-700'>Lead Download</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 px-4 rounded-md h-10 flex gap-2"
                        onClick={handleDownloadWord}
                    >
                        <FileText size={18} /> Word
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 px-4 rounded-md h-10 flex gap-2"
                        onClick={handleDownloadPDF}
                    >
                        <Download size={18} /> PDF
                    </Button>
                    {/* <Button
                        className="bg-[#4b3f5a] hover:bg-[#3d334a] px-10 rounded-md h-10"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        {showFilter ? "Hide Filter" : "Show Filter"}
                    </Button> */}
                </div>
            </div>

            {isError && (
                <Alert variant="destructive" className="mt-4">
                    {getErrorMessage(error)}
                </Alert>
            )}

            <ReportsFilterSection
                form={form}
                showFilter={showFilter}
                handleFilter={handleFilter}
            />

            {/* table container */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 w-full p-2 shadow border border-gray-100 rounded-md mt-4 max-h-[70vh] overflow-y-auto">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow className="bg-[#1e4d46] text-white hover:bg-[#1e4d46]">
                            <TableHead className="text-white h-10 text-xs font-bold w-12 text-center"></TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Lead No</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Product Type</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Amount</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Customer Name</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Mobile No</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Lead Date</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold border-r border-[#2a635a]">Advisor Name</TableHead>
                            <TableHead className="text-white h-10 text-xs font-bold">Allocated To</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-10">Loading leads...</TableCell>
                            </TableRow>
                        ) : reportData && reportData.length > 0 ? (
                            reportData.map((row, index) => (
                                <TableRow
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-[#f1f5f4]" : "bg-white"} hover:bg-gray-100 transition-colors border-b`}
                                >
                                    <TableCell className="text-xs py-2 border-r text-center">
                                        <Checkbox
                                            checked={selectedLeadId === row._id}
                                            onCheckedChange={() => handleSelectLead(row._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.leadNo}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.productType}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.loanRequirementAmount || row.carExShowroomPrice || ''}</TableCell>
                                    <TableCell className="text-xs py-2 border-r font-medium text-[#1e4d46]">{row.clientName}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.mobileNo}</TableCell>
                                    <TableCell className="text-xs py-2 border-r">{row.createdAt ? format(new Date(row.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>
                                    <TableCell className="text-xs py-2 border-r text-blue-700">{row.advisorId?.name}</TableCell>
                                    <TableCell className="text-xs py-2">{row.allocatedTo?.name}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-10 text-gray-500">No leads found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default LeadDownload;
