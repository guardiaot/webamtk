import React from "react";
import Icon from "@mdi/react";

import {
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiEyeOutline
} from "@mdi/js";


export function getTelemetryColumns() {
    return [
        {
            field: "ied_name",
            label: "IED",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="fw-semibold">
                        {row.ied_name || row.ied_id}
                    </div>
                    <div className="small text-muted">
                        {row.ied_id}
                    </div>
                </div>
            )
        },
        {
            field: "timestamp",
            label: "Data/Hora",
            sortable: true
        },
        {
            field: "ia",
            label: "Ia",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }
                    )} A
                </span>
            )
        },
        {
            field: "ib",
            label: "Ib",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }
                    )} A
                </span>
            )
        },
        {
            field: "ic",
            label: "Ic",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }
                    )} A
                </span>
            )
        },
        {
            field: "va",
            label: "Va",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            maximumFractionDigits: 0
                        }
                    )} V
                </span>
            )
        },
        {
            field: "vb",
            label: "Vb",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            maximumFractionDigits: 0
                        }
                    )} V
                </span>
            )
        },
        {
            field: "vc",
            label: "Vc",
            sortable: true,
            render: (value) => (
                <span>
                    {Number(value).toLocaleString(
                        "pt-BR",
                        {
                            maximumFractionDigits: 0
                        }
                    )} V
                </span>
            )
        },
        {
            field: "frequency",
            label: "Hz",
            sortable: true,
            render: (value) => (
                value !== null &&
                value !== undefined
                    ? `${Number(value).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )} Hz`
                    : "—"
            )
        },
        {
            field: "ied_id",
            label: "Status",
            sortable: false,
            render: (value, row) => {
                const status = row.status || "online";
                const isOnline = status === "online" || status === "active";
                return (
                    <span className={`badge ${isOnline ? "bg-success" : "bg-secondary"} d-flex align-items-center`} style={{ width: "fit-content" }}>
                        <Icon
                            path={isOnline ? mdiCheckCircleOutline : mdiCloseCircleOutline}
                            size={0.65}
                            className="me-1"
                        />
                        {isOnline ? "Online" : "Offline"}
                    </span>
                );
            }
        },
        {
            field: "ied_id",
            label: "Ações",
            sortable: false,
            render: (value, row) => (
                <a
                    href={`/ieds/${row.ied_id}`}
                    className="btn btn-sm btn-outline-secondary"
                    title="Visualizar IED"
                >
                    <Icon path={mdiEyeOutline} size={0.75} />
                </a>
            )
        }
    ];
}
