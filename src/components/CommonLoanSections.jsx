import React, { useState, useEffect, useRef } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiListAllocatedTo } from '@/services/lead.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from './ui/alert';



const attachmentTypeOptions = [
    'PAN Card',
    'Aadhar Card',
    'Residence Proof',
    'Salary Slip 1',
    'Salary Slip 2',
    'Salary Slip 3',
    'Bank Statement',
    'Form 16 (If Available)',
    'Office ID Card (If Available)',
    'Loan Statement (If Any)',
    'Other Docs (If Any)',
];


// Helper function to check if logged-in user is an advisor
const isAdvisorUser = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        return profile?.role?.toLowerCase() === "advisor";
    } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        return false;
    }
};

// Helper function to get logged-in user's ID
const getLoggedInUserId = () => {
    try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        return profile?._id || profile?.id || null;
    } catch (error) {
        console.error("Error getting user ID from localStorage:", error);
        return null;
    }
};

const CommonLoanSections = ({ form, isEdit = false, onDocumentsChange }) => {

    console.log("isEdit>>>", isEdit);

    const isAdvisor = isAdvisorUser();
    const [allocatedToUsers, setAllocatedToUsers] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const fileInputRef = useRef(null);

    // Notify parent component when documents change
    useEffect(() => {
        if (onDocumentsChange) {
            onDocumentsChange(uploadedDocuments);
        }
    }, [uploadedDocuments, onDocumentsChange]);

    // Handle adding a document to the list
    const handleAddDocument = () => {
        const attachmentType = form.getValues('attachmentType');
        const uploadFile = form.getValues('uploadFile');
        const filePassword = form.getValues('filePassword');

        if (!attachmentType) {
            alert('Please select an attachment type');
            return;
        }
        if (!uploadFile) {
            alert('Please select a file to upload');
            return;
        }

        const newDocument = {
            id: Date.now(), // Unique identifier
            attachmentType,
            file: uploadFile,
            password: filePassword || '',
            fileName: uploadFile.name
        };

        setUploadedDocuments(prev => [...prev, newDocument]);

        // Clear the form fields
        form.setValue('attachmentType', '');
        form.setValue('uploadFile', null);
        form.setValue('filePassword', '');

        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle viewing a document
    const handleViewDocument = (doc) => {
        const url = URL.createObjectURL(doc.file);
        window.open(url, '_blank');
    };

    // Handle deleting a document from the list
    const handleDeleteDocument = (docId) => {
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
    };

    // Auto-set allocateTo for advisor users to their own ID
    useEffect(() => {
        if (isAdvisor) {
            const userId = getLoggedInUserId();
            if (userId) {
                form.setValue('allocateTo', userId);
            }
        }
    }, [isAdvisor, form]);

    // query to  fetch all the allocated To users on component mount
    const {
        isError: isListAllocatedToError,
        error: listAllocatedToError,
    } = useQuery({
        queryKey: ['allocatedToUsers'],
        enabled: !isAdvisor, // Only fetch when user is not an advisor
        queryFn: async () => {
            const res = await apiListAllocatedTo();
            console.log("📦 queryFn response of list allocated To users:", res);
            setAllocatedToUsers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching list allocated To Users:", err);
        }
    });


    console.log('allocateTo Users>>', allocatedToUsers);




    return (
        <>
            <div className=' p-2 bg-[#67C8FF] rounded-md shadow'>
                <h1 className=' font-semibold'>Any Running Loan?</h1>
            </div>
            {
                isListAllocatedToError && (
                    <Alert variant="destructive">{getErrorMessage(listAllocatedToError)}</Alert>
                )
            }

            <div className="w-full overflow-x-auto p-2 border border-gray-200 shadow rounded">
                {/* === Running Loans Section (up to 4 loans) === */}
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="min-w-[850px] grid grid-cols-5 gap-4 mb-4">
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.loanType`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Type</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.loanAmount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Amount</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.bankName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.emiAmount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>EMI Amount</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`runningLoans.${index}.paidEmi`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paid EMI</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>References 1</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="reference1.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile No</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference1.relation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>References 2</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="reference2.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile No</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reference2.relation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className=' p-2 bg-[#FED8B1] rounded-md shadow'>
                <h1 className=' font-semibold'>Upload Documents</h1>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                <FormField
                    control={form.control}
                    name="attachmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attachment Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {attachmentTypeOptions.map((option, index) => (
                                        <SelectItem key={index} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="uploadFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Upload</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="filePassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password (If Any)</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    type="button"
                    onClick={handleAddDocument}
                    className="bg-blue-800 text-white h-10 mt-5 shadow"
                >
                    UPLOAD
                </Button>
            </div>

            {/* Uploaded Documents Table */}
            {uploadedDocuments.length > 0 && (
                <div className="mt-3 border border-gray-200 shadow rounded overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#67C8FF]">
                                <th className="text-left p-2 text-white font-semibold">Attachment Type</th>
                                <th className="text-left p-2 text-white font-semibold">Password (If Any)</th>
                                <th className="text-center p-2 text-white font-semibold">View</th>
                                <th className="text-center p-2 text-white font-semibold">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedDocuments.map((doc) => (
                                <tr key={doc.id} className="border-b border-gray-200">
                                    <td className="p-2">{doc.attachmentType}</td>
                                    <td className="p-2">{doc.password || '-'}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleViewDocument(doc)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isEdit && !isAdvisor && <>
                <div className=' p-2 bg-[#67C8FF] rounded-md shadow'>
                    <h1 className=' font-semibold'>Allocate To</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2 border border-gray-200 shadow mt-3 rounded">
                    <FormField
                        control={form.control}
                        name="allocateTo"
                        render={({ field }) => (
                            <FormItem className="col-span-1 mt-2">
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allocatedToUsers?.map((allocate) => (
                                                <SelectItem key={allocate?._id} value={allocate?._id}>{allocate?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </>
            }
        </>
    )
}

export default CommonLoanSections
