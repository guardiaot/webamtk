import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiArrowLeft,
    mdiWaveform,
    mdiLoading,
    mdiAlertCircleOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiServerNetwork,
    mdiLanConnect,
    mdiChartLine
} from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";

const dash = "\u2014";

const statusMap = {
    pending: { label: "Pendente", className: "bg-secondary", icon: mdiLoading },
    processing: { label: "Processando", className: "bg-info text-dark", icon: mdiLoading },
    calculated: { label: "Calculada", className: "bg-success", icon: mdiCheckCircleOutline },
    insufficient_data: { label: "Dados insuficientes", className: "bg-warning text-dark", icon: mdiAlertCircleOutline },
    error: { label: "Erro", className: "bg-danger", icon: mdiCloseCircleOutline }
};

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

const valueOrDash = (value) => value === null || value === undefined || value === "" ? dash : value;

const formatNumeric = (value) => {
    if (value === null || value === undefined || value === "") return dash;
    const normalized = String(value).trim().replace(",", ".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return value;
    const [integer, decimal] = normalized.split(".");
    const trimmedDecimal = decimal ? decimal.replace(/0+$/, "") : "";
    return trimmedDecimal ? integer + "," + trimmedDecimal : integer;
};

function Field({ label, value, className = "col-md-6" }) {
    return (
        <div className={className}>
            <div className="text-muted small">{label}</div>
            <div className="fw-semibold">{valueOrDash(value)}</div>
        </div>
    );
}

function StatusBadge({ value }) {
    const status = statusMap[value] || {
        label: value || "Desconhecido",
        className: "bg-secondary",
        icon: null
    };

    return (
        <span className={"badge " + status.className + " d-flex align-items-center"} style={{ width: "fit-content" }}>
            {status.icon && <Icon path={status.icon} size={0.7} className="me-1" />}
            {status.label}
        </span>
    );
}

export default function FaultLocationShow({ user, id }) {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch("/api/v1/fault-locations/" + id, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });

                const result = await response.json();
                const data = result?.data || {};

                if (!response.ok) {
                    throw new Error(data.mensagem || "Erro ao carregar a localização da falta.");
                }

                if (data.erro === 1) {
                    setError(data.mensagem || "Localização da falta não encontrada.");
                    return;
                }

                setRecord(data);
            } catch (loadError) {
                setError(loadError.message || "Erro inesperado ao carregar a localização da falta.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <LayoutAdmin>
                <div className="container-fluid py-5 text-center">
                    <Icon path={mdiLoading} size={1.5} spin />
                    <div className="mt-2 text-muted">Carregando localização da falta...</div>
                </div>
            </LayoutAdmin>
        );
    }

    if (error || !record) {
        return (
            <LayoutAdmin>
                <div className="container-fluid py-4">
                    <div className="d-flex align-items-center mb-4">
                        <a href="/fault-locations" className="btn btn-outline-secondary me-3">
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <h2>Localização da Falta</h2>
                    </div>
                    <div className="alert alert-warning">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        {error || "Localização da falta não encontrada."}
                    </div>
                </div>
            </LayoutAdmin>
        );
    }

    const alertClass = record.status === "insufficient_data"
        ? "alert-warning"
        : record.status === "error"
            ? "alert-danger"
            : "alert-secondary";
    const alertTitle = record.status === "insufficient_data"
        ? "Dados insuficientes para localização"
        : record.status === "error"
            ? "Erro no processamento"
            : "Informação da localização";

    const hasCalculatedLocation = record.status === "calculated"
        && record.fault_distance_km !== null
        && record.fault_distance_km !== undefined;

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <a href="/fault-locations" className="btn btn-outline-secondary me-3" title="Voltar">
                            <Icon path={mdiArrowLeft} size={0.8} />
                        </a>
                        <div>
                            <h2 className="mb-1">Localização da Falta</h2>
                            <div className="text-muted">COMTRADE #{record.comtrade_record_id}</div>
                        </div>
                    </div>
                    {record.comtrade_record_id && (
                        <a
                            href={"/oscillography/" + record.comtrade_record_id}
                            className="btn btn-outline-primary"
                        >
                            <Icon path={mdiWaveform} size={0.75} className="me-2" />
                            Visualizar Oscilografia
                        </a>
                    )}
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Status</div>
                                <StatusBadge value={record.status} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Distância</div>
                                <div className="fs-5 fw-bold">
                                    {record.fault_distance_km === null || record.fault_distance_km === undefined
                                        ? dash
                                        : formatNumeric(record.fault_distance_km) + " km"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Distância percentual</div>
                                <div className="fs-5 fw-bold">
                                    {record.fault_distance_percent === null || record.fault_distance_percent === undefined
                                        ? dash
                                        : formatNumeric(record.fault_distance_percent) + "%"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Alto risco</div>
                                <span className={hasCalculatedLocation && record.is_high_risk === true ? "badge bg-danger" : "text-muted"}>
                                    {!hasCalculatedLocation
                                        ? dash
                                        : record.is_high_risk === true
                                            ? "Sim"
                                            : "Não"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {(record.status === "insufficient_data" || record.error_message) && (
                    <div className={"alert " + alertClass + " mb-4"}>
                        <div className="fw-semibold mb-1">{alertTitle}</div>
                        <div>
                            {record.status === "insufficient_data"
                                ? "Dados insuficientes para realizar o cálculo de localização da falta."
                                : record.error_message}
                        </div>
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiChartLine} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">Resultado da Localização</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <Field label="Distância da falta" value={record.fault_distance_km === null || record.fault_distance_km === undefined ? null : formatNumeric(record.fault_distance_km) + " km"} />
                                    <Field label="Distância percentual" value={record.fault_distance_percent === null || record.fault_distance_percent === undefined ? null : formatNumeric(record.fault_distance_percent) + "%"} />
                                    <Field label="Tipo de falta" value={record.fault_type} />
                                    <Field label="Algoritmo" value={record.algorithm} />
                                    <div className="col-md-6">
                                        <div className="text-muted small">Status</div>
                                        <StatusBadge value={record.status} />
                                    </div>
                                    <Field label="Calculado em" value={formatDate(record.calculated_at)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <div className="d-flex align-items-center">
                                    <Icon path={mdiServerNetwork} size={0.9} className="text-primary me-2" />
                                    <h5 className="mb-0">IED</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <Field label="Nome" value={record.ied_name} />
                                    <Field label="Código" value={record.ied_code} />
                                    <Field label="Fabricante" value={record.manufacturer} />
                                    <Field label="Modelo" value={record.model} />
                                    {record.ied_id && (
                                        <div className="col-12">
                                            <a href={"/ieds/" + record.ied_id} className="btn btn-sm btn-outline-secondary">
                                                Visualizar IED
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="mb-0">Registro COMTRADE</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <Field label="Registro" value={record.comtrade_record_id === null || record.comtrade_record_id === undefined ? null : "#" + record.comtrade_record_id} />
                                    <Field label="Estação" value={record.station_name} />
                                    <Field label="Dispositivo" value={record.device_id} />
                                    <Field label="Frequência nominal" value={record.nominal_frequency === null || record.nominal_frequency === undefined ? null : record.nominal_frequency + " Hz"} />
                                    <Field label="Formato" value={record.data_format} />
                                    <Field label="Amostras" value={record.sample_count} />
                                    <Field label="Arquivo CFG" value={record.cfg_filename} />
                                    <Field label="Arquivo DAT" value={record.dat_filename} />
                                    <Field label="Origem" value={record.comtrade_source === "mms" ? "MMS" : record.comtrade_source} />
                                    <Field label="Início" value={formatDate(record.start_time)} />
                                    <Field label="Disparo" value={formatDate(record.trigger_time)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-3">
                                <h5 className="mb-0">Hierarquia</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <Field label="Proprietário" value={record.owner_name} />
                                    <Field label="Regional" value={record.regional_name} />
                                    <Field label="Instalação" value={record.installation_name} />
                                    <Field label="Estado" value={record.state_name ? record.state_name + (record.state_abbreviation ? " (" + record.state_abbreviation + ")" : "") : null} />
                                    <Field label="Função de Transmissão" value={record.transmission_function_name} />
                                    <Field label="Tipo de Função" value={record.transmission_function_type_name} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 pt-3">
                        <h5 className="mb-0">Parâmetros da Linha de Transmissão</h5>
                    </div>
                    <div className="card-body">
                        {record.line_parameters ? (
                            <div className="row g-3">
                                <Field label="Nível de Tensão" value={formatNumeric(record.line_parameters.voltage_level)} />
                                <Field label="Corrente Nominal" value={formatNumeric(record.line_parameters.nominal_current)} />
                                <Field label="Comprimento da LT" value={record.line_parameters.line_length_km === null || record.line_parameters.line_length_km === undefined ? null : formatNumeric(record.line_parameters.line_length_km) + " km"} />
                                <Field label="INFEED" value={record.line_parameters.infeed === null || record.line_parameters.infeed === undefined ? null : record.line_parameters.infeed ? "Sim" : "Não"} />
                                <Field label="R1" value={formatNumeric(record.line_parameters.r1)} />
                                <Field label="R0" value={formatNumeric(record.line_parameters.r0)} />
                                <Field label="X1" value={formatNumeric(record.line_parameters.x1)} />
                                <Field label="X0" value={formatNumeric(record.line_parameters.x0)} />
                            </div>
                        ) : (
                            <div className="text-muted">Nenhum parâmetro de linha associado a este registro.</div>
                        )}
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 pt-3">
                        <h5 className="mb-0">Trechos de Alto Risco</h5>
                    </div>
                    <div className="card-body">
                        {!record.risk_sections || record.risk_sections.length === 0 ? (
                            <div className="text-muted">Nenhum trecho de alto risco cadastrado para esta função de transmissão.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-sm table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Km Inicial</th>
                                            <th>Km Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {record.risk_sections.map((section) => (
                                            <tr key={section.id}>
                                                <td>{formatNumeric(section.km_start)}</td>
                                                <td>{formatNumeric(section.km_end)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 pt-3">
                        <h5 className="mb-0">Datas</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <Field label="Calculado em" value={formatDate(record.calculated_at)} />
                            <Field label="Início" value={formatDate(record.start_time)} />
                            <Field label="Disparo" value={formatDate(record.trigger_time)} />
                            <Field label="Cadastro" value={formatDate(record.created_at)} />
                            <Field label="Última atualização" value={formatDate(record.updated_at)} />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
