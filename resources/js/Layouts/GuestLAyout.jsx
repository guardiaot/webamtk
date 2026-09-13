import React from 'react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';


export default function Guest({ children }) {
    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>AMTK</title>

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&amp;display=swap" rel="stylesheet"/>
            <link rel="stylesheet" href="/admin/assets/vendor/fonts/iconify-icons.css" />

            <link rel="stylesheet" href="/admin/assets/vendor/css/core.css" />
            <link rel="stylesheet" href="/admin/assets/vendor/css/theme-default.css" className="template-customizer-theme-css" />

            <link rel="stylesheet" href="/admin/assets/css/demo.css" />
            <link rel="stylesheet" href="/admin/assets/css/partial.css" />
            <link rel="stylesheet" href="/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
            

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100" style={{ background: 'none' }}>
                <div className="w-full sm:max-w-md mt-6 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </>
    );
}