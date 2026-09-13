import React, { useCallback, useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiAlertCircleOutline,
    mdiCheckCircleOutline,
    mdiDatabaseOutline,
    mdiLoading,
    mdiRefresh,
    mdiServerNetwork
} from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";

const dash = "\u2014";

const formatDate = (value) => {
    if (!value) return dash;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR");
};

const formatValue = (value) => value === null || value === undefined || value === "" ? dash : value;

export default function Server() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadServer = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/v1/maintenance/server", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
            const result = await response.json();
            if (!response.ok) throw new Error("Erro ao carregar o diagnóstico do servidor.");
            setData(result?.data || {});
        } catch (loadError) {
            setError(loadError.message || "Erro inesperado ao carregar o diagnóstico do servidor.");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadServer();
    }, [loadServer]);

    const application = data?.application || {};
    const database = data?.database || {};
    const activity = data?.activity || {};
    const summary = data?.summary || {};

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Servidor</h2>
                        <div className="text-muted">Diagnóstico operacional do servidor AMTK</div>
                    </div>
                    <button type="button" className="btn btn-outline-secondary" onClick={loadServer} disabled={loading}>
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

                {loading && !data && (
                    <div className="alert alert-info d-flex align-items-center mb-4">
                        <Icon path={mdiLoading} size={1} spin className="me-2" />
                        Carregando diagnóstico...
                    </div>
                )}

                <div className="row g-3 mb-4">
                    {[
                        ["Aplicação Web", application.status === "available" ? "Disponível" : dash, application.status === "available" ? "text-success" : "text-muted"],
                        ["Banco de dados", database.status === "online" ? "Online" : "Erro", database.status === "online" ? "text-success" : "text-danger"],
                        ["Agents cadastrados", formatValue(summary.total_agents), ""],
                        ["IEDs monitorados", formatValue(summary.total_ieds), ""]
                    ].map(([label, value, className]) => (
                        <div className="col-12 col-sm-6 col-xl-3" key={label}>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-muted small mb-1">{label}</div>
                                    <div className={`fs-3 fw-bold ${className}`}>{value}</div>
                                    {label === "IEDs monitorados" && (
                                        <div className="small text-muted">
                                            {formatValue(summary.ieds_online)} online, {formatValue(summary.ieds_offline)} offline, {formatValue(summary.ieds_unknown)} desconhecidos
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    <div className="col-12 col-xl-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 py-3">
                                <Icon path={mdiServerNetwork} size={1} className="text-primary me-2" />
                                <span className="fw-semibold">Aplicação Web AMTK</span>
                            </div>
                            <div className="card-body">
                                <div>Status: {application.status === "available" ? "Disponível" : dash}</div>
                                <div>Versão PHP: {formatValue(application.php_version)}</div>
                                <div>Data/hora do servidor: {formatDate(application.server_time)}</div>
                                <div>Timezone: {formatValue(application.timezone)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 py-3">
                                <Icon path={mdiDatabaseOutline} size={1} className="text-primary me-2" />
                                <span className="fw-semibold">PostgreSQL</span>
                            </div>
                            <div className="card-body">
                                <div>Status: {database.status === "online" ? "Online" : "Erro"}</div>
                                <div>Banco atual: {formatValue(database.database_name)}</div>
                                <div>Versão PostgreSQL: {formatValue(database.version)}</div>
                                <div>Tempo de resposta: {database.response_time_ms === null || database.response_time_ms === undefined ? dash : `${database.response_time_ms} ms`}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 py-3">
                                <Icon path={mdiCheckCircleOutline} size={1} className="text-primary me-2" />
                                <span className="fw-semibold">Atividade do sistema</span>
                            </div>
                            <div className="card-body row g-3">
                                <div className="col-12 col-md-4">Última telemetria: {formatDate(activity.ultima_telemetria)}</div>
                                <div className="col-12 col-md-4">Último evento: {formatDate(activity.ultimo_evento)}</div>
                                <div className="col-12 col-md-4">Última atividade: {formatDate(activity.ultima_atividade)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
