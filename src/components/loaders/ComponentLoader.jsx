import React from 'react'

const ComponentLoader = () => {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Page Title Skeleton */}
            <div className="h-8 w-1/3 mx-auto rounded-md bg-gray-300 dark:bg-gray-700" />

            {/* Filter/Search bar skeleton */}
            <div className="h-10 rounded-md bg-gray-300 dark:bg-gray-700" />

            {/* Table/List Header Skeleton */}
            <div className="flex space-x-4 mt-6">
                <div className="h-6 w-1/3 rounded-md bg-gray-300 dark:bg-gray-700" />
                <div className="h-6 w-1/3 rounded-md bg-gray-300 dark:bg-gray-700" />
                <div className="h-6 w-1/3 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Multiple Rows */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="flex space-x-4 mt-4"
                >
                    <div className="h-6 w-1/3 rounded-md bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-1/3 rounded-md bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-1/3 rounded-md bg-gray-200 dark:bg-gray-800" />
                </div>
            ))}
        </div>
    )
}

export default ComponentLoader
