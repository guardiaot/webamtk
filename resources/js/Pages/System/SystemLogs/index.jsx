import React, { useRef, useState } from "react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";

const columns = [
    { label: "DATA/HORA", field: "created_at", render: (value) => value ? new Date(value).toLocaleString("pt-BR") : "—" },
    { label: "NÍVEL", field: "level", render: (value) => <span className={`badge ${value === "ERROR" ? "bg-danger" : value === "WARNING" ? "bg-warning text-dark" : "bg-info text-dark"}`}>{value || "—"}</span> },
    { label: "MÓDULO", field: "module" },
    { label: "MENSAGEM", field: "message" },
    { label: "ROTA", field: "route", render: (value) => value || "—" },
];

export default function SystemLogs() {
    const table = useRef(null);
    const [filters, setFilters] = useState({ level: "", module: "", data_inicial: "", data_final: "" });
    const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="mb-4">
                    <h2 className="mb-1">Log do Sistema</h2>
                    <div className="text-muted">Registros técnicos e falhas do sistema</div>
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3"><label className="form-label">Nível</label><select className="form-select" value={filters.level} onChange={(event) => changeFilter("level", event.target.value)}><option value="">Todos</option><option value="ERROR">ERROR</option><option value="WARNING">WARNING</option><option value="INFO">INFO</option></select></div>
                            <div className="col-md-3"><label className="form-label">Módulo</label><input className="form-control" value={filters.module} onChange={(event) => changeFilter("module", event.target.value)} /></div>
                            <div className="col-md-3"><label className="form-label">Data inicial</label><input type="date" className="form-control" value={filters.data_inicial} onChange={(event) => changeFilter("data_inicial", event.target.value)} /></div>
                            <div className="col-md-3"><label className="form-label">Data final</label><input type="date" className="form-control" value={filters.data_final} onChange={(event) => changeFilter("data_final", event.target.value)} /></div>
                        </div>
                    </div>
                </div>
                <DataTable ref={table} title="Logs registrados" subtitle="Registros técnicos somente para consulta" ajax="/api/v1/system-logs" columns={columns} filters={filters} pageSize={20} pageSizeOptions={[10, 20, 50, 100]} />
            </div>
        </LayoutAdmin>
    );
}
