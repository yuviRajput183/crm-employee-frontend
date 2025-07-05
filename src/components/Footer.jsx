import React from 'react';
import { Phone, Mail, ChartGantt } from 'lucide-react'; // Optional: use icons from Lucide

const Footer = () => {
    return (
        <div className="w-full mt-4">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-2 shadow-md text-white font-semibold text-md flex items-center gap-2">
                <ChartGantt /> {/* Replace with an icon if needed */}
                / <span>Contact Us</span> /
            </div>

            {/* Main footer content */}
            <div className="bg-gradient-to-br from-blue-400 to-teal-400 text-black p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
                    {/* Address */}
                    <div>
                        <h3 className="font-semibold mb-2">Loan Sahayak</h3>
                        <p>DSS-61, 1st Floor, Urban Estate - II, Delhi Road,</p>
                        <p>Adjacent to Pushpa Complex, Hisar - 125001(HR)</p>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-2">Support</h3>
                        <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> +91 90529-63000
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> contact@loansahayak.com
                        </p>
                    </div>

                    {/* Timings */}
                    <div>
                        <h3 className="font-semibold mb-2">Timings</h3>
                        <p><strong>Monday to Saturday:</strong> 10:00 AM to 6:30 PM</p>
                        <p><strong>Sunday:</strong> Closed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
