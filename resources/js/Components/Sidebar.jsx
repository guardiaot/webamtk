
import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react";
import menuData from '../data/menuData.json'

const iconStyles = {
    display: 'inline-block',
    width: '1.5rem',
    height: '1.5rem',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
}

const Sidebar = () => {


    return (
        <>
            <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
                <div className="app-brand demo">
                    <Link aria-label='Navigate to sneat homepage' to="/" className="app-brand-link">
                        <span className="app-brand-logo demo">
                            <img style={{width: 181}} src="https://hml-painel.ksssolucoes.com.br/img/logos/logo-kss-line-waith.jpg" alt="sneat-logo" aria-label='Sneat logo image' />
                        </span>
                        <span className="app-brand-text demo menu-text fw-bold ms-2"></span>
                    </Link>

                    <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                        <i className="bx bx-chevron-left bx-sm align-middle"></i>
                    </a>
                </div>

                <div className="menu-inner-shadow"></div>

                <ul className="menu-inner py-1">

                    {menuData.map((section) => (

                        <React.Fragment key={section.header}>

                            {section.header && (
                                <li className="menu-header small text-uppercase">
                                    <span className="menu-header-text">
                                        {section.header}
                                    </span>
                                </li>
                            )}

                            {section.items.map((item, index) => (
                                <MenuItem
                                    key={item.id || `${item.link}-${item.text}` || index}
                                    {...item}
                                />
                            ))}

                        </React.Fragment>

                    ))}

                </ul>
            </aside>
        </>
    )
};

const MenuItem = (item) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = location.pathname === item.link;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuActive = hasSubmenu && item.submenu.some(subitem => location.pathname === subitem.link);
    const open = hasSubmenu && (isOpen || isSubmenuActive);

    const handleToggle = (e) => {
        if (!hasSubmenu) return;
        e.preventDefault();
        setIsOpen((prev) => !prev);
    };

    return (
        <li className={`menu-item ${isActive || isSubmenuActive ? 'active' : ''} ${open ? 'open' : ''}`}>
            {hasSubmenu ? (
                <a
                    aria-label={`Toggle ${item.text}`}
                    href="#"
                    className="menu-link menu-toggle"
                    onClick={handleToggle}
                >
                    <Icon icon={item.icon} style={iconStyles} />

                    <div>{item.text}</div>

                    {item.available === false && (
                        <div className="badge bg-label-primary fs-tiny rounded-pill ms-auto">
                            Pro
                        </div>
                    )}
                </a>
            ) : (
                <NavLink
                    aria-label={`Navigate to ${item.text} ${!item.available ? 'Pro' : ''}`}
                    to={item.link}
                    className="menu-link"
                    target={item.link.includes('http') ? '_blank' : undefined}
                >
                    <Icon icon={item.icon} style={iconStyles} />

                    <div>{item.text}</div>

                    {item.available === false && (
                        <div className="badge bg-label-primary fs-tiny rounded-pill ms-auto">
                            Pro
                        </div>
                    )}
                </NavLink>
            )}

            {item.submenu && (
                <ul className="menu-sub">
                    {item.submenu.map((subitem, subindex) => (
                        <MenuItem
                            key={subitem.id || `${subitem.link}-${subitem.text}` || subindex}
                            {...subitem}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Sidebar;