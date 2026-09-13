import React, { useState } from "react";
import Icon from "@mdi/react";
import {
    mdiCalendarRange,
    mdiEyeOutline,
    mdiFlashOutline,
    mdiServerNetwork
} from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const dash = "\u2014";

const formatDateTime = (value) => {
    if (!value) return dash;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString("pt-BR");
};

const columns = [
    {
        field: "trigger_time",
        label: "Data/Hora do Trigger",
        sortable: true,
        render: (value) => (
            <div>
                <div className="fw-semibold d-flex align-items-center">
                    <Icon path={mdiCalendarRange} size={0.7} className="me-1" />
                    {formatDateTime(value)}
                </div>
            </div>
        )
    },
    {
        field: "ied_name",
        label: "IED",
        sortable: true,
        render: (value, row) => (
            <div className="d-flex align-items-center">
                <Icon path={mdiServerNetwork} size={0.9} className="text-primary me-2" />
                <div>
                    <div className="fw-semibold">{value || dash}</div>
                    <div className="small text-muted">{row.ied_code || row.ied_id || dash}</div>
                </div>
            </div>
        )
    },
    {
        field: "manufacturer",
        label: "Fabricante / Modelo",
        sortable: true,
        render: (value, row) => (
            <div>
                <div>{value || dash}</div>
                <div className="small text-muted">{row.model || dash}</div>
            </div>
        )
    },
    {
        field: "station_name",
        label: "Estação",
        sortable: true,
        render: (value) => value || dash
    },
    {
        field: "device_id",
        label: "Device",
        sortable: true,
        render: (value) => value || dash
    },
    {
        field: "cfg_filename",
        label: "CFG",
        sortable: true,
        render: (value) => value || dash
    },
    {
        field: "dat_filename",
        label: "DAT",
        sortable: true,
        render: (value) => value || dash
    },
    {
        field: "source",
        label: "Origem",
        sortable: true,
        render: (value) => value === "mms" ? "MMS" : value || dash
    },
    {
        label: "Ação",
        field: "id",
        sortable: false,
        width: "1%",
        className: "text-end text-nowrap",
        render: (_, row) => (
            <a
                href={`/oscillography/${row.id}`}
                className="btn btn-sm btn-outline-primary"
                title="Visualizar oscilografia"
            >
                <Icon path={mdiEyeOutline} size={0.7} />
            </a>
        )
    }
];

export default function Triggers() {
    const [filters, setFilters] = useState({
        ied_id: "",
        data_inicial: "",
        data_final: ""
    });

    const updateFilter = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value
        }));
    };

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Consultas de triggers</h2>
                        <div className="text-muted">Registros COMTRADE com trigger identificado</div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="fw-semibold">Filtros</div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-xl-4">
                                <label className="form-label">IED</label>
                                <AjaxSumoSelect
                                    url="/api/v1/ieds/simples"
                                    value={filters.ied_id}
                                    onChange={(event) => updateFilter("ied_id", event.value)}
                                    labelField="name"
                                    placeholder="Todos os IEDs"
                                />
                            </div>
                            <div className="col-12 col-md-6 col-xl-3">
                                <label className="form-label">Data inicial</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon path={mdiCalendarRange} size={0.8} />
                                    </span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={filters.data_inicial}
                                        onChange={(event) => updateFilter("data_inicial", event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-3">
                                <label className="form-label">Data final</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon path={mdiCalendarRange} size={0.8} />
                                    </span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={filters.data_final}
                                        min={filters.data_inicial || undefined}
                                        onChange={(event) => updateFilter("data_final", event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    title="Triggers registrados"
                    subtitle="Registros COMTRADE disponíveis para visualização da oscilografia"
                    ajax="/api/v1/maintenance/triggers"
                    columns={columns}
                    filters={filters}
                    pageSize={20}
                    pageSizeOptions={[20, 50, 100]}
                />
            </div>
        </LayoutAdmin>
    );
}
