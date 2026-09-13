import React from "react";
import Icon from "@mdi/react";
import {
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiCloseCircleOutline,
    mdiLoading,
    mdiEyeOutline
} from "@mdi/js";

const dash = "\u2014";

const formatDate = (value) => {
    if (!value) return dash;
    try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString("pt-BR");
    } catch {
        return value;
    }
};

const statusMap = {
    pending: {
        label: "Pendente",
        className: "bg-secondary",
        icon: mdiLoading
    },
    processing: {
        label: "Processando",
        className: "bg-info text-dark",
        icon: mdiLoading
    },
    calculated: {
        label: "Calculada",
        className: "bg-success",
        icon: mdiCheckCircleOutline
    },
    insufficient_data: {
        label: "Dados insuficientes",
        className: "bg-warning text-dark",
        icon: mdiAlertCircleOutline
    },
    error: {
        label: "Erro",
        className: "bg-danger",
        icon: mdiCloseCircleOutline
    }
};

export function getFaultLocationColumns() {
    return [
        {
            field: "ied_name",
            label: "IED",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="fw-semibold">{value || dash}</div>
                    <div className="small text-muted">{row.ied_code || dash}</div>
                </div>
            )
        },
        {
            field: "comtrade_record_id",
            label: "COMTRADE",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="fw-semibold">#{value ?? dash}</div>
                    <div className="small text-muted">{row.cfg_filename || dash}</div>
                </div>
            )
        },
        {
            field: "transmission_function_name",
            label: "Função de Transmissão",
            sortable: true,
            render: (value) => value || dash
        },
        {
            field: "installation_name",
            label: "Instalação",
            sortable: true,
            render: (value) => value || dash
        },
        {
            field: "fault_distance_km",
            label: "Distância",
            sortable: true,
            render: (value, row) => {
                if (value === null || value === undefined) {
                    return row.fault_distance_percent === null || row.fault_distance_percent === undefined
                        ? dash
                        : <div>{row.fault_distance_percent}%</div>;
                }

                return (
                    <div>
                        <div>{value} km</div>
                        {row.fault_distance_percent !== null && row.fault_distance_percent !== undefined && (
                            <div className="small text-muted">{row.fault_distance_percent}%</div>
                        )}
                    </div>
                );
            }
        },
        {
            field: "fault_type",
            label: "Tipo",
            sortable: true,
            render: (value) => value || dash
        },
        {
            field: "status",
            label: "Status",
            sortable: true,
            render: (value) => {
                const status = statusMap[value] || {
                    label: value || "Desconhecido",
                    className: "bg-secondary",
                    icon: null
                };

                return (
                    <span className={"badge " + status.className + " d-flex align-items-center"} style={{ width: "fit-content" }}>
                        {status.icon && (
                            <Icon path={status.icon} size={0.65} className="me-1" />
                        )}
                        {status.label}
                    </span>
                );
            }
        },
        {
            field: "is_high_risk",
            label: "Alto Risco",
            sortable: true,
            render: (value) => (
                value === true
                    ? <span className="badge bg-danger">Sim</span>
                    : <span className="text-muted">N&atilde;o</span>
            )
        },
        {
            field: "calculated_at",
            label: "Data do cálculo",
            sortable: true,
            render: (value) => formatDate(value)
        },
        {
            field: "id",
            label: "Ações",
            sortable: false,
            render: (value, row) => (
                <a
                    href={`/fault-locations/${row.id}`}
                    className="btn btn-sm btn-outline-secondary"
                    title="Visualizar"
                >
                    <Icon path={mdiEyeOutline} size={0.75} />
                </a>
            )
        }
    ];
}
