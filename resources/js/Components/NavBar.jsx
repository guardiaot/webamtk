import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { IoChatboxSharp } from "react-icons/io5";
import getGreetingMessage from '../utils/greetingHandler';
import GreetingBanner from '@/Components/GreetingBanner';

export default function NavBar({ handleShow, active = false, className = '', children, ...props }) {
        const users = usePage().props.users;

        const [dados, setDados] = useState([]);
        useEffect(() => {
                axios.get('/user/listar-usuario-id/1')
                        .then(function (response) {
                                const db = response.data
                                setDados(db)
                        })
                        .catch((error) => console.log(error));
        }, [users]);

        console.log(dados);


        return (
                <>

                        <nav
                                className="layout-navbar  navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                                id="layout-navbar" style={{ width: '95% !important' }}>
                                <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                                        <a aria-label='toggle for sidebar' className="nav-item nav-link px-0 me-xl-4" href="#">
                                                <i className="bx bx-menu bx-sm"></i>
                                        </a>
                                </div>

                                <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                                        <GreetingBanner />
                                        <ul className="navbar-nav flex-row align-items-center ms-auto">
                                                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                                        <a aria-label='dropdown profile avatar' className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                                                                <div className="avatar avatar-online">
                                                                        <img src={`painel/images/perfil/${dados.foto}`} className="w-px-40 h-auto rounded-circle" alt="avatar-image" aria-label='Avatar Image' />
                                                                </div>
                                                        </a>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                                <li>
                                                                        <a aria-label='go to profile' className="dropdown-item" href="#">
                                                                                <div className="d-flex">
                                                                                        <div className="flex-shrink-0 me-3">
                                                                                                <div className="avatar avatar-online">
                                                                                                        <img src={`painel/images/perfil/${dados.foto}`} className="w-px-40 h-auto rounded-circle" alt='avatar-image' aria-label='Avatar Image' />
                                                                                                </div>
                                                                                        </div>
                                                                                        <div className="flex-grow-1">
                                                                                                <span className="fw-medium d-block">{users.nome}</span>
                                                                                                <small className="text-muted">{users.nivel}</small>
                                                                                        </div>
                                                                                </div>
                                                                        </a>
                                                                </li>
                                                                <li>
                                                                        <div className="dropdown-divider"></div>
                                                                </li>
                                                                <li>
                                                                        <a aria-label='go to profile' className="dropdown-item" href="#">
                                                                                <i className="bx bx-user me-2"></i>
                                                                                <span className="align-middle">Meu Perfil</span>
                                                                        </a>
                                                                </li>
                                                                <li>
                                                                        <a aria-label='go to setting' className="dropdown-item" href="#">
                                                                                <i className="bx bx-cog me-2"></i>
                                                                                <span className="align-middle">Configurações</span>
                                                                        </a>
                                                                </li>
                                                                <li>
                                                                        <a aria-label='go to billing' className="dropdown-item" href="#">
                                                                                <span className="d-flex align-items-center align-middle">
                                                                                        <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                                                                                        <span className="flex-grow-1 align-middle ms-1">Faturamento</span>
                                                                                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                                                                                </span>
                                                                        </a>
                                                                </li>
                                                                <li>
                                                                        <div className="dropdown-divider"></div>
                                                                </li>
                                                                <li>
                                                                        <a aria-label='click to log out' className="dropdown-item" href="#">
                                                                                <i className="bx bx-power-off me-2"></i>
                                                                                <span className="align-middle">Sair</span>
                                                                        </a>
                                                                </li>
                                                        </ul>
                                                </li>
                                        </ul>
                                </div>
                        </nav>

                </>
        )
}