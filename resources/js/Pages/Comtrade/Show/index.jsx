import React from "react";
import Icon from "@mdi/react";
import {
    mdiArrowLeft,
    mdiServerNetwork,
    mdiCalendarRange,
    mdiClockOutline,
    mdiWaveform,
    mdiInformationOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiFileChartOutline,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function ComtradeShow({ record }) {
    const online = record?.status === "available";

    const formatDateTime = (value) => {
        if (!value) return "—";
        try {
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return "—";
            return date.toLocaleString("pt-BR");
        } catch {
            return value;
        }
    };

    const formatNumber = (value, decimals = 1) => {
        if (value === null || value === undefined || !Number.isFinite(Number(value))) {
            return "—";
        }
        return Number(value).toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    if (!record) {
        return (
            <LayoutAdmin>
                <div className="container-fluid py-4">
                    <div className="d-flex align-items-center mb-4">
                        <a href="/comtrade" className="btn btn-outline-secondary me-3">
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <h2>Registro não encontrado</h2>
                    </div>
                    <div className="alert alert-warning">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        O registro COMTRADE solicitado não foi encontrado.
                    </div>
                </div>
            </LayoutAdmin>
        );
    }

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <a
                            href="/comtrade"
                            className="btn btn-outline-secondary me-3"
                            title="Voltar"
                        >
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <div>
                            <h2 className="mb-1">
                                {record.station_name || record.device_id || "Registro COMTRADE"}
                            </h2>
                            <div className="text-muted">
                                {record.ied_name || record.ied_id} — {record.trigger_reason || "Sem motivo informado"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATUS + RESUMO RÁPIDO */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${online ? "#198754" : "#dc3545"}` }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Status</div>
                                <div className="d-flex align-items-center">
                                    <Icon
                                        path={online ? mdiCheckCircleOutline : mdiCloseCircleOutline}
                                        size={1.2}
                                        className={online ? "text-success me-2" : "text-danger me-2"}
                                    />
                                    <span className={`fs-5 fw-bold ${online ? "text-success" : "text-danger"}`}>
                                        {online ? "Disponível" : "Indisponível"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Duração</div>
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiWaveform} size={1.1} className="text-primary me-2" />
                                    <span className="fs-5 fw-bold">
                                        {formatNumber(record.duration, 3)} s
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0dcaf0" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Data/Hora</div>
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiCalendarRange} size={1.1} className="text-info me-2" />
                                    <span className="fs-5 fw-bold">
                                        {formatDateTime(record.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IDENTIFICAÇÃO */}
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
                                        <div className="text-muted small">IED</div>
                                        <div className="fw-semibold">{record.ied_name || record.ied_id || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Fabricante</div>
                                        <div className="fw-semibold">{record.manufacturer || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Modelo</div>
                                        <div className="fw-semibold">{record.model || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Station Name</div>
                                        <div className="fw-semibold">{record.station_name || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Device ID</div>
                                        <div className="fw-semibold">{record.device_id || "—"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Agent</div>
                                        <div className="fw-semibold">{record.agent_name || record.agent_id || "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CANAIS E AMOSTRAGEM */}
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiWaveform} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">Canais e Amostragem</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="text-muted small">Canais Analógicos</div>
                                        <div className="fs-5 fw-semibold">{record.analog_channels || 0}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Canais Digitais</div>
                                        <div className="fs-5 fw-semibold">{record.digital_channels || 0}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Taxa de Amostragem</div>
                                        <div className="fs-5 fw-semibold">{formatNumber(record.sample_rate, 0)} Hz</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Total de Samples</div>
                                        <div className="fs-5 fw-semibold">{formatNumber(record.total_samples, 0)}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Frequência Nominal</div>
                                        <div className="fs-5 fw-semibold">{formatNumber(record.nominal_frequency, 2)} Hz</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-muted small">Duração</div>
                                        <div className="fs-5 fw-semibold">{formatNumber(record.duration, 3)} s</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFORMAÇÕES COMTRADE */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 pt-3">
                        <div className="d-flex align-items-center">
                            <Icon path={mdiFileChartOutline} size={0.9} className="text-primary me-2" />
                            <h5 className="mb-0">Informações COMTRADE</h5>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="text-muted small">Motivo do Disparo</div>
                                <div className="fw-semibold">{record.trigger_reason || "—"}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Arquivo CFG</div>
                                <div className="fw-semibold">{record.file_cfg || "—"}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Arquivo DAT</div>
                                <div className="fw-semibold">{record.file_dat || "—"}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Criado em</div>
                                <div className="fw-semibold">{formatDateTime(record.created_at)}</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small">Última atualização</div>
                                <div className="fw-semibold">{formatDateTime(record.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AVISO VISUALIZAÇÃO FUTURA */}
                <div className="alert alert-info d-flex align-items-center">
                    <Icon path={mdiInformationOutline} size={1} className="me-2" />
                    <div>
                        A visualização gráfica dos sinais COMTRADE será disponibilizada em uma atualização futura.
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
