import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiRefresh,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiLoading
} from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";

const dash = "\u2014";
const emptyFilters = {};

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
    online: {
        label: "Online",
        className: "bg-success",
        icon: mdiCheckCircleOutline
    },
    offline: {
        label: "Offline",
        className: "bg-secondary",
        icon: mdiCloseCircleOutline
    }
};

const iedColumns = [
    {
        field: "name",
        label: "IED",
        sortable: true,
        render: (value, row) => (
            <div>
                <div className="fw-semibold">{value || dash}</div>
                <div className="small text-muted">{row.code || row.id || dash}</div>
            </div>
        )
    },
    {
        field: "agent_id",
        label: "Agent",
        sortable: true,
        render: (value) => value || dash
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
        field: "status",
        label: "Status",
        sortable: true,
        render: (value) => {
            const status = statusMap[value] || {
                label: value || "Desconhecido",
                className: "bg-warning text-dark",
                icon: mdiAlertCircleOutline
            };

            return (
                <span className={"badge " + status.className + " d-flex align-items-center"} style={{ width: "fit-content" }}>
                    <Icon path={status.icon} size={0.65} className="me-1" />
                    {status.label}
                </span>
            );
        }
    },
    {
        field: "effective_driver_name",
        label: "Driver efetivo",
        sortable: true,
        render: (value, row) => (
            <div>
                <div>{value || dash}</div>
                {row.effective_driver_code && (
                    <div className="small text-muted">{row.effective_driver_code}</div>
                )}
            </div>
        )
    },
    {
        field: "response_time_us",
        label: "Tempo de resposta",
        sortable: true,
        render: (value) => value === null || value === undefined ? dash : value + " µs"
    },
    {
        field: "last_check",
        label: "Última verificação",
        sortable: true,
        render: (value) => formatDate(value)
    },
    {
        field: "last_seen",
        label: "Última comunicação",
        sortable: true,
        render: (value) => formatDate(value)
    },
    {
        field: "consecutive_failures",
        label: "Falhas consecutivas",
        sortable: true,
        render: (value) => value ?? 0
    }
];

export default function Monitoring() {
    const table = useRef(null);
    const [agents, setAgents] = useState([]);
    const [summary, setSummary] = useState({
        total_agents: 0,
        total_ieds: 0,
        ieds_online: 0,
        ieds_offline: 0,
        ieds_unknown: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMonitoring = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/v1/monitoring", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error("Erro ao carregar o monitoramento.");
            }

            const data = result?.data || {};
            setAgents(data.agents || []);
            setSummary(data.summary || {
                total_agents: 0,
                total_ieds: 0,
                ieds_online: 0,
                ieds_offline: 0,
                ieds_unknown: 0
            });
        } catch (loadError) {
            setError(loadError.message || "Erro inesperado ao carregar o monitoramento.");
            setAgents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMonitoring();
    }, [loadMonitoring]);

    const refresh = () => {
        loadMonitoring();
        table.current?.refresh();
    };

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Monitoramento</h2>
                        <div className="text-muted">
                            Visão operacional dos Agents e IEDs monitorados
                        </div>
                    </div>
                    <button type="button" className="btn btn-outline-secondary" onClick={refresh} disabled={loading}>
                        <Icon path={mdiRefresh} size={0.8} className="me-1" />
                        Atualizar
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        {error}
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Agents cadastrados</div>
                                <div className="fs-3 fw-bold">{summary.total_agents}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #6f42c1" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">IEDs monitorados</div>
                                <div className="fs-3 fw-bold">{summary.total_ieds}</div>
                                <div className="small text-muted">{summary.ieds_unknown} desconhecidos</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">IEDs online</div>
                                <div className="fs-3 fw-bold text-success">{summary.ieds_online}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #6c757d" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">IEDs offline</div>
                                <div className="fs-3 fw-bold text-secondary">{summary.ieds_offline}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-1">Agents</h5>
                        <small className="text-body-secondary">Últimas atividades registradas no Web</small>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>ID</th>
                                    <th>Versão</th>
                                    <th>IEDs</th>
                                    <th>Última telemetria</th>
                                    <th>Último evento</th>
                                    <th>Última atividade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <Icon path={mdiLoading} size={1} spin />
                                        </td>
                                    </tr>
                                ) : agents.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            Nenhum Agent encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    agents.map((agent) => (
                                        <tr key={agent.id}>
                                            <td>
                                                <div className="fw-semibold">{agent.name || dash}</div>
                                                <div className="small text-muted">
                                                    {agent.total_ieds ?? 0} IEDs, {agent.ieds_online ?? 0} online, {agent.ieds_offline ?? 0} offline
                                                </div>
                                            </td>
                                            <td>{agent.id || dash}</td>
                                            <td>{agent.version || dash}</td>
                                            <td>
                                                <div>{agent.total_ieds ?? 0}</div>
                                                <div className="small text-muted">{agent.ieds_unknown ?? 0} desconhecidos</div>
                                            </td>
                                            <td>{formatDate(agent.ultima_telemetria)}</td>
                                            <td>{formatDate(agent.ultimo_evento)}</td>
                                            <td>{formatDate(agent.ultima_atividade)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <DataTable
                    ref={table}
                    title="IEDs monitorados"
                    subtitle="Estado operacional dos IEDs associados aos Agents"
                    ajax="/api/v1/ieds"
                    columns={iedColumns}
                    filters={emptyFilters}
                    pageSize={100}
                    pageSizeOptions={[100]}
                />
            </div>
        </LayoutAdmin>
    );
}
