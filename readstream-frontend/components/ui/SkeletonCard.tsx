import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
            <div className="h-48 bg-gray-200 w-full" />
            <div className="p-4 flex flex-col space-y-3">
                <div className="h-3 bg-gray-200 w-1/4 rounded" />
                <div className="h-6 bg-gray-200 w-3/4 rounded" />
                <div className="h-4 bg-gray-200 w-full rounded" />
                <div className="h-4 bg-gray-200 w-2/3 rounded" />
                <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="h-3 bg-gray-200 w-20 rounded" />
                    <div className="h-8 bg-gray-200 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
