import React from "react";
import Icon from "@mdi/react";
import {
    mdiArrowLeft,
    mdiPencilOutline,
    mdiServerNetwork,
    mdiLanConnect,
    mdiRobotOutline,
    mdiClockOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiChartLine,
    mdiFolderEditOutline,
    mdiMagnify,
    mdiLoading
} from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function Show({ user, ied }) {
    if (!ied) {
        return (
            <LayoutAdmin>
                <div className="container-fluid py-4">
                    <div className="d-flex align-items-center mb-4">
                        <a href="/settings/ieds" className="btn btn-outline-secondary me-3">
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <h2>IED não encontrado</h2>
                    </div>
                    <div className="alert alert-warning">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        O IED solicitado não foi encontrado.
                    </div>
                </div>
            </LayoutAdmin>
        );
    }

    const status = {
        online: { label: "Online", color: "#198754", icon: mdiCheckCircleOutline, className: "text-success" },
        offline: { label: "Offline", color: "#dc3545", icon: mdiCloseCircleOutline, className: "text-danger" },
        active: { label: "Ativo", color: "#0d6efd", icon: mdiCheckCircleOutline, className: "text-primary" },
        unknown: { label: "Desconhecido", color: "#6c757d", icon: mdiAlertCircleOutline, className: "text-secondary" },
    }[ied.status] || { label: "Desconhecido", color: "#6c757d", icon: mdiAlertCircleOutline, className: "text-secondary" };
    const source = { manual: "Manual", discovery: "Discovery" }[ied.source] || ied.source || "—";

    const formatDate = (value) => {
        if (!value) return "—";
        try {
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return value;
            return d.toLocaleString("pt-BR");
        } catch { return value; }
    };

    const hasSuccessRate = Number(ied.checks) > 0;
    const successRate = hasSuccessRate
        ? (((ied.checks - (ied.failures || 0)) / ied.checks) * 100).toFixed(1)
        : null;

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <a href="/settings/ieds" className="btn btn-outline-secondary me-3" title="Voltar">
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <div>
                            <h2 className="mb-1">{ied.name || "IED"}</h2>
                            <div className="text-muted">{ied.manufacturer} {ied.model}</div>
                        </div>
                    </div>
                    <a href="/settings/ieds" className="btn btn-outline-primary">
                        <Icon path={mdiPencilOutline} size={0.75} className="me-2" />
                        Gerenciar IED
                    </a>
                </div>

                {/* STATUS RÁPIDO */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${status.color}` }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Status</div>
                                <div className="d-flex align-items-center">
                                    <Icon
                                        path={status.icon}
                                        size={1.2}
                                        className={`${status.className} me-2`}
                                    />
                                    <span className={`fs-5 fw-bold ${status.className}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Origem</div>
                                <div className="d-flex align-items-center">
                                    <Icon
                                        path={ied.source === "manual" ? mdiFolderEditOutline : mdiMagnify}
                                        size={1.1} className="text-primary me-2"
                                    />
                                    <span className="fs-5 fw-bold">{source}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #ffc107" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Tempo de Resposta</div>
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiClockOutline} size={1.1} className="text-warning me-2" />
                                    <span className="fs-5 fw-bold">{ied.response_time_us == null ? "—" : `${ied.response_time_us} μs`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${hasSuccessRate && Number(successRate) > 90 ? "#198754" : "#dc3545"}` }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Taxa de Sucesso</div>
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiChartLine} size={1.1} className="text-primary me-2" />
                                    <span className="fs-5 fw-bold">{successRate == null ? "—" : `${successRate}%`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IDENTIFICAÇÃO + COMUNICAÇÃO */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiServerNetwork} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">Identificação</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="text-muted small">ID</div>
                                        <div className="fw-semibold">{ied.id ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Nome</div>
                                        <div className="fw-semibold">{ied.name ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Fabricante</div>
                                        <div className="fw-semibold">{ied.manufacturer ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Modelo</div>
                                        <div className="fw-semibold">{ied.model ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Tipo de IED</div>
                                        <div className="fw-semibold">{ied.ied_type_name ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Template</div>
                                        <div className="fw-semibold">{ied.ied_template_name ?? "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiLanConnect} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">Comunicação</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <div className="text-muted small">Endereço</div>
                                        <div className="fw-semibold">{ied.host ?? "—"}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-muted small">Porta TCP</div>
                                        <div className="fw-semibold">{ied.port ?? 102}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="text-muted small">Driver efetivo</div>
                                        <div className="fw-semibold">{ied.effective_driver_name ?? "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HIERARQUIA + DRIVER */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="mb-0">Hierarquia</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="text-muted small">Proprietário</div>
                                        <div className="fw-semibold">{ied.owner_name ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Regional</div>
                                        <div className="fw-semibold">{ied.regional_name ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Instalação</div>
                                        <div className="fw-semibold">{ied.installation_name ?? "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Função de Transmissão</div>
                                        <div className="fw-semibold">{ied.transmission_function_name ?? "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="mb-0">Driver de Coleta</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="text-muted small">Driver efetivo</div>
                                        <div className="fw-semibold">{ied.effective_driver_name ?? "—"}</div>
                                        <small className="text-muted">{ied.effective_driver_code || "—"}</small>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Origem</div>
                                        <div className="fw-semibold">
                                            {ied.effective_driver_source === "override"
                                                ? "Override do IED"
                                                : ied.effective_driver_source === "template"
                                                    ? "Template"
                                                    : "—"}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Driver padrão do Template</div>
                                        <div className="fw-semibold">{ied.default_driver_name ?? "—"}</div>
                                        <small className="text-muted">{ied.default_driver_code || "—"}</small>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Driver override</div>
                                        <div className="fw-semibold">{ied.driver_override_name ?? "—"}</div>
                                        <small className="text-muted">{ied.driver_override_code || "—"}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AGENT + MONITORAMENTO */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiRobotOutline} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">Agent</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="text-muted small">Nome</div>
                                        <div className="fw-semibold">{ied.agent_name || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Versão</div>
                                        <div className="fw-semibold">{ied.agent_version || "—"}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="text-muted small">Agent ID</div>
                                        <div className="fw-semibold">{ied.agent_id || "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiChartLine} size={0.9} className="text-primary me-2" />
                        <h5 className="mb-0">Dados de Monitoramento</h5>
                        <div className="text-muted small">Últimos dados registrados pelo monitoramento.</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="border rounded p-3 text-center">
                                            <div className="text-muted small">Verificações</div>
                                            <div className="fs-4 fw-bold text-primary">{ied.checks ?? 0}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 text-center">
                                            <div className="text-muted small">Falhas</div>
                                            <div className="fs-4 fw-bold text-danger">{ied.failures ?? 0}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 text-center">
                                            <div className="text-muted small">Falhas Consecutivas</div>
                                            <div className={`fs-4 fw-bold ${(ied.consecutive_failures ?? 0) > 0 ? "text-danger" : "text-success"}`}>
                                                {ied.consecutive_failures ?? 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 text-center">
                                            <div className="text-muted small">Taxa de Sucesso</div>
                                            <div className={`fs-4 fw-bold ${hasSuccessRate && Number(successRate) > 90 ? "text-success" : "text-danger"}`}>
                                                {successRate == null ? "—" : `${successRate}%`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DATAS */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 pt-3">
                        <div className="d-flex align-items-center">
                            <Icon path={mdiClockOutline} size={0.9} className="text-primary me-2" />
                            <h5 className="mb-0">Informações de Comunicação</h5>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="text-muted small">Última verificação</div>
                                <div className="fw-semibold">{formatDate(ied.last_check)}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Última leitura</div>
                                <div className="fw-semibold">{formatDate(ied.last_seen)}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Cadastro</div>
                                <div className="fw-semibold">{formatDate(ied.created_at)}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Última atualização</div>
                                <div className="fw-semibold">{formatDate(ied.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ALERTA FALHAS */}
                {(ied.consecutive_failures ?? 0) > 0 && (
                    <div className="alert alert-warning d-flex align-items-center">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        <div>
                            O IED possui <strong>{ied.consecutive_failures}</strong> falha(s) consecutiva(s) de comunicação.
                            Verifique a conectividade e o estado do equipamento.
                        </div>
                    </div>
                )}
            </div>
        </LayoutAdmin>
    );
}
