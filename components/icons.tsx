
import React from 'react';

export const F1LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 230" {...props}>
        <path fill="currentColor" d="M120,20h130v20h-90v60h80v20h-80v70h90v20H120V20z M280,20h40l70,170h-40l-10-30h-70l-10,30h-40L280,20z M310,140h-20l-20-50l-20,50h40z M400,20h130v20h-90v150h-40V20z M550,20h110v20h-40v150h-40V40h-30v150h-40V20z"/>
    </svg>
);


export const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <svg
            className="animate-spin h-12 w-12 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        <p className="text-gray-300">Loading F1 Data...</p>
    </div>
);
