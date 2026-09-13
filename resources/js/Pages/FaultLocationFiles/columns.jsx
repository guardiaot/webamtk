import React from "react";
import Icon from "@mdi/react";
import {
    mdiDownloadOutline,
    mdiEyeOutline
} from "@mdi/js";

const dash = "\u2014";

const formatDate = (value) => {
    if (!value) return dash;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString("pt-BR");
};

export function getFaultLocationFileColumns(canDownload) {
    return [
        {
            field: "calculated_at",
            label: "Data/Hora",
            sortable: true,
            render: (value) => formatDate(value)
        },
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
            field: "installation_name",
            label: "Instalação",
            sortable: true,
            render: (value) => value || dash
        },
        {
            field: "comtrade_record_id",
            label: "Registro COMTRADE",
            sortable: true,
            render: (value) => value ?? dash
        },
        {
            field: "cfg_filename",
            label: "Arquivo CFG",
            sortable: true,
            render: (value, row) => value && canDownload ? (
                <a
                    href={`/api/v1/comtrade/${row.comtrade_record_id}/files/cfg`}
                    className="text-decoration-none"
                    title="Baixar CFG"
                >
                    <Icon path={mdiDownloadOutline} size={0.7} className="me-1" />
                    {value}
                </a>
            ) : value || dash
        },
        {
            field: "dat_filename",
            label: "Arquivo DAT",
            sortable: true,
            render: (value, row) => value && canDownload ? (
                <a
                    href={`/api/v1/comtrade/${row.comtrade_record_id}/files/dat`}
                    className="text-decoration-none"
                    title="Baixar DAT"
                >
                    <Icon path={mdiDownloadOutline} size={0.7} className="me-1" />
                    {value}
                </a>
            ) : value || dash
        },
        {
            field: "source",
            label: "Origem",
            sortable: true,
            render: (value) => value === "mms" ? "MMS" : value || dash
        },
        {
            field: "fault_distance_km",
            label: "Distância",
            sortable: true,
            render: (value) => value === null || value === undefined
                ? dash
                : `${value} km`
        },
        {
            field: "status",
            label: "Status",
            sortable: true,
            render: (value) => value === "insufficient_data"
                ? "Dados insuficientes"
                : value || dash
        },
        {
            field: "fault_location_id",
            label: "Ações",
            sortable: false,
            width: "1%",
            className: "text-end text-nowrap",
            render: (value, row) => (
                <div className="d-flex gap-1 justify-content-end">
                    <a
                        href={`/fault-locations/${value}`}
                        className="btn btn-sm btn-outline-secondary"
                        title="Visualizar localização da falta"
                    >
                        <Icon path={mdiEyeOutline} size={0.7} />
                    </a>
                    <a
                        href={`/oscillography/${row.comtrade_record_id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Visualizar oscilografia"
                    >
                        <Icon path={mdiEyeOutline} size={0.7} />
                    </a>
                </div>
            )
        }
    ];
}
