// components/Loader.jsx
import { Loader2 } from "lucide-react";
import React from "react";

const PageLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
        </div>
    );
};

export default PageLoader;
