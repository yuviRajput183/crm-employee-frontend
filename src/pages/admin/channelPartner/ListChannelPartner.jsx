import React from 'react';

const ListChannelPartner = () => {
    return (
        <div className="p-4 bg-white rounded shadow mx-auto mt-6">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">List Channel Partners</h1>
            <p className="text-gray-600">This feature is under development. Verified channel partners will be listed here.</p>
            
            <div className="mt-8 border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center text-gray-500 py-8">
                        <tr>
                            <td colSpan="4" className="px-6 py-8">No channel partners found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListChannelPartner;
