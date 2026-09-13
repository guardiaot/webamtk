import React from 'react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

import OrigemSidebar from '@/Components/OrigemSidebar';

const LayoutAdmin = ({ children }) => {

    const [show, setShow] = useState('')
    const [showMenu, setShowMenu] = useState('')
    const [openMenus, setOpenMenus] = useState({});
    const version = Date.now();


    const onToggleMenu = (menuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };


    const handleShow = () => {
        setShow(!show)
        if (!show) {
            setShow("sidebar-icon-only");
        } else {
            setShow("");
        }
    }

    return (
        <>

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&amp;display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="/admin/assets/vendor/fonts/iconify-icons.css" />

            <link rel="stylesheet" href="/admin/assets/vendor/css/core.css" />
            <link rel="stylesheet" href="/admin/assets/vendor/css/theme-default.css" className="template-customizer-theme-css" />

            <link rel="stylesheet" href="/admin/assets/css/demo.css" />
            <link rel="stylesheet" href="/admin/assets/css/partial.css?i=1234" />
            <link rel="stylesheet" href="/admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
            <link rel="stylesheet" href="/admin/assets/vendor/css/pages/page-auth.css" />

            <title>AMTK</title>
            <Toaster />
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <OrigemSidebar
                        openMenus={openMenus}
                        onToggleMenu={onToggleMenu}
                    />

                    <div className="layout-page ">


                        <div className="content-wrapper">
                            <div className="pl-4 px-4 flex-grow-1 container-p-y">
                                {children}
                            </div>


                            <footer className="content-footer footer bg-footer-theme">
                                <div className="pl-4 px-4 d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                                    <div className="mb-2 mb-md-0">
                                        <a href="#" target="_blank">AMTK</a> — Monitoramento de Subestações
                                    </div>
                                    <div className="d-none d-lg-inline-block">
                                        <span className="float-none float-sm-end d-block mt-1 mt-sm-0 text-center">Copyright © 2026. All rights reserved.</span>
                                    </div>
                                </div>
                            </footer>

                        </div>
                    </div >
                    <div className="layout-overlay layout-menu-toggle"></div>
                </div >
            </div >

        </>
    );
}

export default LayoutAdmin; 