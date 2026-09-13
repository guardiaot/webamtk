import React, { useRef, useState } from "react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";

const columns = [
  { label: "Data/Hora", field: "created_at" },
  { label: "Usuário", field: "user_name", render: (value, row) => value || row.user_email || row.user_id || "—" },
  { label: "Ação", field: "action" },
  { label: "Módulo", field: "module" },
  { label: "Descrição", field: "description" },
  { label: "Recurso", field: "entity_id", render: (value, row) => value ? `${row.entity_type || ""} #${value}` : "—" },
  { label: "IP", field: "ip_address", render: (value) => value || "—" },
];

export default function UserActivities() {
  const table = useRef(null);
  const [filters, setFilters] = useState({ user_id: "", action: "", module: "", data_inicial: "", data_final: "" });
  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <LayoutAdmin>
      <div className="container-fluid py-4">
        <div className="mb-4">
          <h2 className="mb-1">Atividades de Usuários</h2>
          <div className="text-muted">Histórico de ações realizadas pelos usuários</div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3"><label className="form-label">Usuário (ID)</label><input className="form-control" value={filters.user_id} onChange={(event) => changeFilter("user_id", event.target.value)} /></div>
              <div className="col-md-3"><label className="form-label">Ação</label><input className="form-control" value={filters.action} onChange={(event) => changeFilter("action", event.target.value)} placeholder="ex.: LOGIN" /></div>
              <div className="col-md-3"><label className="form-label">Módulo</label><input className="form-control" value={filters.module} onChange={(event) => changeFilter("module", event.target.value)} placeholder="ex.: COMTRADE" /></div>
              <div className="col-md-3"><label className="form-label">Data inicial</label><input type="date" className="form-control" value={filters.data_inicial} onChange={(event) => changeFilter("data_inicial", event.target.value)} /></div>
              <div className="col-md-3"><label className="form-label">Data final</label><input type="date" className="form-control" value={filters.data_final} onChange={(event) => changeFilter("data_final", event.target.value)} /></div>
            </div>
          </div>
        </div>
        <DataTable ref={table} title="Atividades registradas" subtitle="Registro imutável de ações auditadas" ajax="/api/v1/user-activities" columns={columns} filters={filters} pageSize={20} pageSizeOptions={[10, 20, 50, 100]} />
      </div>
    </LayoutAdmin>
  );
}
