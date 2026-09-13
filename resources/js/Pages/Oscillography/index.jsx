import React, { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiWaveform,
    mdiServerNetwork,
    mdiCalendarRange,
    mdiClockOutline,
    mdiRefresh,
    mdiEyeOutline,
    mdiFilterOutline,
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiLoading,
    mdiChartLine,
    mdiFileChartOutline,
    mdiFlashOutline
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function Oscillography() {
    /*
     * ============================================================
     * ESTADOS
     * ============================================================
     */
    const [records, setRecords] = useState([]);
    const [ieds, setIeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingIeds, setLoadingIeds] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        total: 0,
        ieds: 0,
        analog_channels: 0,
        digital_channels: 0
    });

    /* Filtros */
    const [filterIed, setFilterIed] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");

    /* Paginação */
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0
    });

    /*
     * ============================================================
     * CARREGAR IEDS
     * ============================================================
     */
    useEffect(() => {
        const loadIeds = async () => {
            try {
                setLoadingIeds(true);
                const response = await fetch("/telemetry/ieds", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    const data = Array.isArray(result)
                        ? result
                        : Array.isArray(result?.data)
                            ? result.data
                            : [];
                    setIeds(data);
                }
            } catch (err) {
                console.error("Erro ao carregar IEDs:", err);
            } finally {
                setLoadingIeds(false);
            }
        };
        loadIeds();
    }, []);

    /*
     * ============================================================
     * CARREGAR RESUMO
     * ============================================================
     */
    const carregarResumo = useCallback(async () => {
        try {
            const params = new URLSearchParams();

            if (filterIed) {
                params.append("ied_id", filterIed);
            }
            if (filterStatus) {
                params.append("status", filterStatus);
            }
            if (dateStart) {
                params.append("data_inicial", dateStart);
            }
            if (dateEnd) {
                params.append("data_final", dateEnd);
            }

            const response = await fetch(
                `/api/v1/oscillography/resumo?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );
            if (response.ok) {
                const result = await response.json();
                setSummary(result.data || {});
            }
        } catch (err) {
            console.error("Erro ao carregar resumo:", err);
        }
    }, [filterIed, filterStatus, dateStart, dateEnd]);

    console.log("Resumo:", summary);

    /*
     * ============================================================
     * CARREGAR REGISTROS
     * ============================================================
     */
    const carregarRegistros = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append("page", page);
            params.append("per_page", perPage);

            if (filterIed) {
                params.append("ied_id", filterIed);
            }
            if (filterStatus) {
                params.append("status", filterStatus);
            }
            if (dateStart) {
                params.append("data_inicial", dateStart);
            }
            if (dateEnd) {
                params.append("data_final", dateEnd);
            }

            const response = await fetch(
                `/api/v1/oscillography?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const payload = result?.data || result || {};

            setRecords(
                Array.isArray(payload.data)
                    ? payload.data
                    : Array.isArray(payload)
                        ? payload
                        : []
            );

            setPagination({
                total: payload.total || 0,
                current_page: payload.current_page || page,
                last_page: payload.last_page || 1,
                from: payload.from || 0,
                to: payload.to || 0
            });
        } catch (err) {
            console.error("Erro ao carregar oscilografia:", err);
            setError(err.message || "Erro ao carregar oscilografia.");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, filterIed, filterStatus, dateStart, dateEnd]);

    /*
     * ============================================================
     * PRIMEIRA CARGA
     * ============================================================
     */
    useEffect(() => {
        carregarResumo();
    }, [carregarResumo]);

    useEffect(() => {
        carregarRegistros();
    }, [carregarRegistros]);

    /*
     * ============================================================
     * FILTROS
     * ============================================================
     */
    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setFilterIed("");
        setFilterStatus("");
        setDateStart("");
        setDateEnd("");
        setPage(1);
    };

    /*
     * ============================================================
     * HELPERS
     * ============================================================
     */
    const getStatus = (status) => {
        if (status === "available") {
            return {
                label: "Disponível",
                className: "bg-success",
                icon: mdiCheckCircleOutline
            };
        }
        if (status === "incomplete") {
            return {
                label: "Incompleto",
                className: "bg-warning text-dark",
                icon: mdiAlertCircleOutline
            };
        }
        return {
            label: "Indisponível",
            className: "bg-secondary",
            icon: mdiAlertCircleOutline
        };
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) {
            return { date: "—", time: "—" };
        }
        try {
            const date = new Date(timestamp);
            if (Number.isNaN(date.getTime())) {
                return { date: "—", time: "—" };
            }
            return {
                date: date.toLocaleDateString("pt-BR"),
                time: date.toLocaleTimeString("pt-BR")
            };
        } catch {
            return { date: "—", time: "—" };
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

    /*
     * ============================================================
     * PAGINAÇÃO
     * ============================================================
     */
    const pages = useMemo(() => {
        const total = pagination.last_page;
        let start = Math.max(1, page - 2);
        let end = Math.min(total, page + 2);
        if (end - start < 4) {
            if (start === 1) end = Math.min(total, 5);
            if (end === total) start = Math.max(1, total - 4);
        }
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }, [pagination.last_page, page]);

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */
    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Oscilografia</h2>
                        <div className="text-muted">
                            Registros oscilográficos e arquivos de perturbação
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            clearFilters();
                            carregarRegistros();
                            carregarResumo();
                        }}
                    >
                        <Icon path={mdiRefresh} size={0.8} className="me-1" />
                        Atualizar
                    </button>
                </div>

                {/* ERRO */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        <div>{error}</div>
                    </div>
                )}

                {/* RESUMO */}
                <div className="row g-3 mb-4">

                    {/* Registros */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderLeft: "4px solid #0d6efd" }}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">
                                            Registros
                                        </div>
                                        <div className="fs-3 fw-bold">
                                            {summary.total || 0}
                                        </div>
                                        <div className="text-muted small">
                                            Total de oscilações
                                        </div>
                                    </div>

                                    <div className="text-primary opacity-75">
                                        <Icon path={mdiWaveform} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* IEDs */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderLeft: "4px solid #198754" }}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">
                                            IEDs
                                        </div>
                                        <div className="fs-3 fw-bold text-success">
                                            {summary.ieds || 0}
                                        </div>
                                        <div className="text-muted small">
                                            Com registros de oscilografia
                                        </div>
                                    </div>

                                    <div className="text-success opacity-75">
                                        <Icon path={mdiServerNetwork} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Canais analógicos */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderLeft: "4px solid #dc3545" }}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">
                                            Canais analógicos
                                        </div>
                                        <div className="fs-3 fw-bold text-danger">
                                            {summary.analog_channels || 0}
                                        </div>
                                        <div className="text-muted small">
                                            Canais registrados
                                        </div>
                                    </div>

                                    <div className="text-danger opacity-75">
                                        <Icon path={mdiChartLine} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Canais digitais */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{ borderLeft: "4px solid #ffc107" }}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">
                                            Canais digitais
                                        </div>
                                        <div className="fs-3 fw-bold text-warning">
                                            {summary.digital_channels || 0}
                                        </div>
                                        <div className="text-muted small">
                                            Canais de estado
                                        </div>
                                    </div>

                                    <div className="text-warning opacity-75">
                                        <Icon path={mdiCheckCircleOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {/* FILTROS */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex align-items-center">
                            <Icon path={mdiFilterOutline} size={1} className="text-primary me-2" />
                            <div>
                                <div className="fw-semibold">Filtros</div>
                                <div className="text-muted small">Localize registros oscilográficos</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-6 col-xl-3">
                                <label className="form-label">IED</label>
                                <select
                                    className="form-select"
                                    value={filterIed}
                                    onChange={handleFilterChange(setFilterIed)}
                                    disabled={loadingIeds}
                                >
                                    <option value="">
                                        {loadingIeds ? "Carregando..." : "Todos os IEDs"}
                                    </option>
                                    {ieds.map((ied) => (
                                        <option key={ied.id} value={ied.id}>
                                            {ied.name || ied.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-xl-2">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={handleFilterChange(setFilterStatus)}
                                >
                                    <option value="">Todos</option>
                                    <option value="available">Disponível</option>
                                    <option value="incomplete">Incompleto</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-xl-2">
                                <label className="form-label">Data inicial</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon path={mdiCalendarRange} size={0.8} />
                                    </span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateStart}
                                        onChange={(e) => {
                                            setDateStart(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-2">
                                <label className="form-label">Data final</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon path={mdiCalendarRange} size={0.8} />
                                    </span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateEnd}
                                        min={dateStart || undefined}
                                        onChange={(e) => {
                                            setDateEnd(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* TABELA */}
                <div className="card border-0 shadow-sm">

                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">

                            <div>
                                <div className="fw-semibold">
                                    Registros oscilográficos
                                </div>

                                <div className="text-muted small">
                                    {pagination.total} registros encontrados
                                </div>
                            </div>

                            <Icon
                                path={mdiFileChartOutline}
                                size={1.1}
                                className="text-primary"
                            />

                        </div>
                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead>
                                <tr>

                                    <th>Data / Hora</th>

                                    <th>IED</th>

                                    <th>Disparo</th>

                                    <th className="text-end">
                                        Duração estimada
                                    </th>

                                    <th className="text-end">
                                        Taxa de amostragem
                                    </th>

                                    <th className="text-end">
                                        Canais
                                    </th>

                                    <th>Status</th>

                                    <th className="text-end">
                                        Ações
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5"
                                        >
                                            <Icon
                                                path={mdiLoading}
                                                size={1}
                                                spin
                                            />

                                            <div className="mt-2 text-muted">
                                                Carregando registros...
                                            </div>
                                        </td>
                                    </tr>

                                ) : records.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center text-muted py-5"
                                        >
                                            <Icon
                                                path={mdiWaveform}
                                                size={1.8}
                                                className="mb-2"
                                            />

                                            <div>
                                                Nenhum registro encontrado
                                            </div>
                                        </td>
                                    </tr>

                                ) : (

                                    records.map((record) => {

                                        const status = getStatus(record.status);

                                        /*
                                         * Data principal da oscilografia.
                                         *
                                         * Prioridade:
                                         * 1. start_time
                                         * 2. created_at
                                         */
                                        const eventDate =
                                            record.start_time ||
                                            record.created_at;

                                        const dt = formatDateTime(eventDate);

                                        /*
                                         * Data/hora do disparo
                                         */
                                        const trigger = record.trigger_time
                                            ? formatDateTime(record.trigger_time)
                                            : null;

                                        return (

                                            <tr key={record.id}>

                                                {/* =====================================================
                                    DATA / HORA
                                   ===================================================== */}
                                                <td>

                                                    <div className="fw-semibold d-flex align-items-center">

                                                        <Icon
                                                            path={mdiCalendarRange}
                                                            size={0.7}
                                                            className="me-1"
                                                        />

                                                        {dt.date}

                                                    </div>

                                                    <div className="small text-muted d-flex align-items-center">

                                                        <Icon
                                                            path={mdiClockOutline}
                                                            size={0.65}
                                                            className="me-1"
                                                        />

                                                        {dt.time}

                                                    </div>

                                                </td>


                                                {/* =====================================================
                                    IED
                                   ===================================================== */}
                                                <td>

                                                    <div className="d-flex align-items-center">

                                                        <Icon
                                                            path={mdiServerNetwork}
                                                            size={0.9}
                                                            className="text-primary me-2"
                                                        />

                                                        <div>

                                                            <div className="fw-semibold">

                                                                {record.ied_name ||
                                                                    record.ied_id ||
                                                                    "—"}

                                                            </div>

                                                            <div className="small text-muted">

                                                                {record.manufacturer &&
                                                                    record.model
                                                                    ? `${record.manufacturer} ${record.model}`
                                                                    : `IED ID: ${record.ied_id ?? "—"}`}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =====================================================
                                    DISPARO
                                   ===================================================== */}
                                                <td>

                                                    {trigger ? (

                                                        <>
                                                            <div className="fw-semibold d-flex align-items-center">

                                                                <Icon
                                                                    path={mdiFlashOutline}
                                                                    size={0.7}
                                                                    className="me-1 text-warning"
                                                                />

                                                                {trigger.date}

                                                            </div>

                                                            <div className="small text-muted d-flex align-items-center">

                                                                <Icon
                                                                    path={mdiClockOutline}
                                                                    size={0.65}
                                                                    className="me-1"
                                                                />

                                                                {trigger.time}

                                                            </div>
                                                        </>

                                                    ) : (

                                                        <span className="text-muted">
                                                            —
                                                        </span>

                                                    )}

                                                </td>


                                                {/* =====================================================
                                    DURAÇÃO
                                   ===================================================== */}
                                                <td className="text-end">

                                                    {formatNumber(
                                                        record.duration,
                                                        3
                                                    )}

                                                    <span className="ms-1">
                                                        s
                                                    </span>

                                                </td>


                                                {/* =====================================================
                                    AMOSTRAGEM
                                   ===================================================== */}
                                                <td className="text-end">

                                                    <div className="fw-semibold">

                                                        {formatNumber(
                                                            record.sample_rate,
                                                            0
                                                        )}

                                                        <span className="ms-1">
                                                            Hz
                                                        </span>

                                                    </div>

                                                    <div className="small text-muted">

                                                        {record.sample_count ?? 0}
                                                        {" "}
                                                        amostras

                                                    </div>

                                                </td>


                                                {/* =====================================================
                                    CANAIS
                                   ===================================================== */}
                                                <td className="text-end">

                                                    <div>
                                                        {record.analog_channels || 0}
                                                        {" "}
                                                        analógicos
                                                    </div>

                                                    <div className="small text-muted">

                                                        {record.digital_channels || 0}
                                                        {" "}
                                                        digitais

                                                    </div>

                                                </td>


                                                {/* =====================================================
                                    STATUS
                                   ===================================================== */}
                                                <td>

                                                    <span
                                                        className={`badge ${status.className} d-flex align-items-center`}
                                                    >

                                                        <Icon
                                                            path={status.icon}
                                                            size={0.65}
                                                            className="me-1"
                                                        />

                                                        {status.label}

                                                    </span>

                                                </td>


                                                {/* =====================================================
                                    AÇÕES
                                   ===================================================== */}
                                                <td className="text-end">

                                                    <div className="d-flex justify-content-end gap-1">

                                                        <a 
                                                        href={`/oscillography/${record.id}`} 
                                                        className="btn btn-sm btn-outline-primary" 
                                                        title="Visualizar oscilografia" > 
                                                        <Icon path={mdiEyeOutline} size={0.8} /> 
                                                        </a>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ============================================================
        PAGINAÇÃO
       ============================================================ */}
                    {pagination.last_page > 1 && (

                        <div className="card-footer bg-white">

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

                                <div className="text-muted small">

                                    Exibindo{" "}
                                    {pagination.from}{" "}
                                    até{" "}
                                    {pagination.to}{" "}
                                    de{" "}
                                    {pagination.total}

                                </div>


                                <nav>

                                    <ul className="pagination pagination-sm mb-0">

                                        {/* ANTERIOR */}
                                        <li
                                            className={`page-item ${page <= 1
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                        >

                                            <button
                                                className="page-link"
                                                disabled={page <= 1}
                                                onClick={() =>
                                                    setPage(page - 1)
                                                }
                                            >
                                                Anterior
                                            </button>

                                        </li>


                                        {/* PÁGINAS */}
                                        {pages.map((number) => (

                                            <li
                                                key={number}
                                                className={`page-item ${number === page
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >

                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(number)
                                                    }
                                                >
                                                    {number}
                                                </button>

                                            </li>

                                        ))}


                                        {/* PRÓXIMO */}
                                        <li
                                            className={`page-item ${page >= pagination.last_page
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                        >

                                            <button
                                                className="page-link"
                                                disabled={
                                                    page >= pagination.last_page
                                                }
                                                onClick={() =>
                                                    setPage(page + 1)
                                                }
                                            >
                                                Próximo
                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            </div>

                        </div>

                    )}

                </div>

            </div>
        </LayoutAdmin>
    );
}
