import React from "react";
import Icon from "@mdi/react";

import {
    mdiViewDashboardOutline,
    mdiServerNetwork,
    mdiChartLine,
    mdiAlertOutline,
    mdiWaveform,
    mdiRobotOutline,
    mdiCogOutline,
    mdiChevronDown,
    mdiChevronRight,
    mdiRadioTower,
    mdiFileChartOutline,
    mdiWrenchOutline,
    mdiCloudUploadOutline,
    mdiAccountGroupOutline,
    mdiMapMarkerOutline,
    mdiOfficeBuildingOutline,
    mdiTransmissionTower,
    mdiMonitor,
    mdiFileSearchOutline,
    mdiMessageTextOutline,
    mdiAccountClockOutline,
    mdiFileCogOutline,
    mdiUpload
} from "@mdi/js";

export default function OrigemSidebar({
    active = "",
    openMenus = {},
    onToggleMenu = () => {}
}) {

    const isActive = (path) => active === path;

    const MenuItem = ({
        icon,
        label,
        path,
        children = null,
        menuKey = null
    }) => {

        const hasChildren = Array.isArray(children) && children.length > 0;
        const isOpen = menuKey ? openMenus[menuKey] : false;

        if (hasChildren) {

            return (
                <div className="mb-1">

                    <button
                        type="button"
                        className="btn btn-link text-decoration-none text-start w-100 d-flex align-items-center px-3 py-2"
                        onClick={() => onToggleMenu(menuKey)}
                    >

                        <Icon
                            path={icon}
                            size={0.95}
                            className="me-3"
                        />

                        <span className="flex-grow-1">
                            {label}
                        </span>

                        <Icon
                            path={
                                isOpen
                                    ? mdiChevronDown
                                    : mdiChevronRight
                            }
                            size={0.8}
                        />

                    </button>

                    {isOpen && (

                        <div className="ms-3 border-start ps-2">

                            {children.map((child) => {

                                const childClassName =
                                    `d-flex align-items-center text-decoration-none px-3 py-2 rounded ${
                                        child.disabled
                                            ? "text-muted pe-none"
                                            : isActive(child.path)
                                                ? "bg-primary text-white"
                                                : "text-body"
                                    }`;

                                const childContent = (
                                    <>

                                        {child.icon && (

                                            <Icon
                                                path={child.icon}
                                                size={0.8}
                                                className="me-2"
                                            />

                                        )}

                                        {child.label}

                                    </>
                                );

                                return child.disabled ? (
                                    <span
                                        key={child.label}
                                        className={childClassName}
                                        aria-disabled="true"
                                    >
                                        {childContent}
                                    </span>
                                ) : (
                                    <a
                                        key={child.path}
                                        href={child.path}
                                        className={childClassName}
                                    >
                                        {childContent}
                                    </a>
                                );

                            })}

                        </div>

                    )}

                </div>
            );
        }

        return (
            <a
                href={path}
                className={
                    `d-flex align-items-center text-decoration-none px-3 py-2 rounded mb-1 ${
                        isActive(path)
                            ? "bg-primary text-white"
                            : "text-body"
                    }`
                }
            >

                <Icon
                    path={icon}
                    size={0.95}
                    className="me-3"
                />

                {label}

            </a>
        );
    };

    return (

        <aside
            className="d-flex flex-column bg-white border-end"
            style={{
                width: "360px",
                minHeight: "100vh"
            }}
        >

            {/* Logo */}

            <div className="px-4 py-4 border-bottom" style={{background: '#444343'}}>

                <div className="fw-bold fs-4" style={{color: "#FFF", fontSize: '20px'}}>
                    A<span style={{color: "rgb(88 248 227)"}}>M</span>TK
                </div>

                <div className="small text-muted">
                    Monitoramento de Subestações
                </div>

            </div>


            {/* Menu */}

            <div className="p-3 flex-grow-1">

                <MenuItem
                    icon={mdiViewDashboardOutline}
                    label="Dashboard"
                    path="/"
                />


                <MenuItem
                    icon={mdiChartLine}
                    label="Telemetria"
                    menuKey="telemetry"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Tempo real",
                            path: "/telemetry",
                            icon: mdiRadioTower
                        },
                        {
                            label: "Histórico",
                            path: "/telemetry/history",
                            icon: mdiChartLine
                        }
                    ]}
                />


                <MenuItem
                    icon={mdiCogOutline}
                    label="Cadastros"
                    menuKey="registrations"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Proprietários",
                            path: "/settings/owners",
                            icon: mdiAccountGroupOutline
                        },
                        {
                            label: "Regionais",
                            path: "/settings/regionals",
                            icon: mdiMapMarkerOutline
                        },
                        {
                            label: "Instalações",
                            path: "/settings/installations",
                            icon: mdiOfficeBuildingOutline
                        },
                        {
                            label: "Funções Transm.",
                            path: "/settings/transmission-functions",
                            icon: mdiTransmissionTower
                        },
                        {
                            label: "IHM OSC",
                            disabled: true,
                            icon: mdiMonitor
                        },
                        {
                            label: "IEDs",
                            path: "/ieds",
                            icon: mdiServerNetwork
                        }
                    ]}
                />


                <MenuItem
                    icon={mdiFileChartOutline}
                    label="Consultas"
                    menuKey="queries"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Localização da Falta",
                            path: "/fault-locations",
                            icon: mdiAlertOutline
                        },
                        {
                            label: "Arquivos de Falta",
                            path: "/fault-location-files",
                            icon: mdiFileSearchOutline
                        },
                        {
                            label: "Oscilografia/Eventos",
                            path: "/oscillography",
                            icon: mdiWaveform
                        },
                        {
                            label: "Arquivos de PMU",
                            disabled: true,
                            icon: mdiWaveform
                        },
                        {
                            label: "Ordem de Ajuste (CODA)",
                            disabled: true,
                            icon: mdiFileCogOutline
                        }
                    ]}
                />


                <div className="border-top my-3" />


                <MenuItem
                    icon={mdiCogOutline}
                    label="Sistema"
                    menuKey="system"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Configuração",
                            path: "/settings/system",
                            icon: mdiCogOutline
                        },
                        {
                            label: "Log do Sistema",
                            path: "/system/logs",
                            icon: mdiFileChartOutline
                        },
                        {
                            label: "Atividades",
                            path: "/system/user-activities",
                            icon: mdiAccountClockOutline
                        },
                        {
                            label: "Eventos Operacionais",
                            path: "/events",
                            icon: mdiAlertOutline
                        }
                    ]}
                />

                <MenuItem
                    icon={mdiCogOutline}
                    label="Configurações"
                    menuKey="settings"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Usuários",
                            path: "/settings/users",
                            icon: mdiAccountGroupOutline
                        },
                        {
                            label: "Tipos Mensagem",
                            path: "/settings/message-types",
                            icon: mdiMessageTextOutline
                        },
                        {
                            label: "Tipos de IEDs",
                            path: "/settings/ied-types",
                            icon: mdiServerNetwork
                        },
                        {
                            label: "Templates IED",
                            path: "/settings/ied-templates",
                            icon: mdiFileCogOutline
                        },
                        {
                            label: "Tipos Função Transm.",
                            path: "/settings/transmission-function-types",
                            icon: mdiTransmissionTower
                        },
                        {
                            label: "Drivers",
                            path: "/settings/collection-drivers",
                            icon: mdiCogOutline
                        }
                    ]}
                />

                <MenuItem
                    icon={mdiRobotOutline}
                    label="Agentes"
                    path="/settings/agents"
                />

                <MenuItem
                    icon={mdiWrenchOutline}
                    label="Manutenção"
                    menuKey="maintenance"
                    openMenus={openMenus}
                    onToggleMenu={onToggleMenu}
                    children={[
                        {
                            label: "Monitoramento",
                            path: "/maintenance/monitoring",
                            icon: mdiMonitor
                        },
                        {
                            label: "Servidor",
                            path: "/maintenance/server",
                            icon: mdiServerNetwork
                        },
                        {
                            label: "Triggers",
                            path: "/maintenance/triggers",
                            icon: mdiFileChartOutline
                        },
                        {
                            label: "Upload COMTRADE",
                            path: "/maintenance/upload",
                            icon: mdiCloudUploadOutline
                        },
                        {
                            label: "Upload CODA",
                            disabled: true,
                            icon: mdiUpload
                        }
                    ]}
                />

            </div>


            {/* Footer */}

            <div className="border-top p-3">

                <div className="small text-muted">
                    AMTK Monitoring
                </div>

                <div className="small text-muted">
                    v1.0.0
                </div>

            </div>

        </aside>
    );
}
