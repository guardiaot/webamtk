import React, { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@mdi/react";
import {
    mdiAlertCircleOutline,
    mdiAlertOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiInformationOutline,
    mdiFilterOutline,
    mdiRefresh,
    mdiCalendarRange,
    mdiServerNetwork,
    mdiClockOutline,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function Events() {
    /*
     * ============================================================
     * ESTADOS
     * ============================================================
     */
    const [events, setEvents] = useState([]);
    const [ieds, setIeds] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        active: 0,
        critical: 0,
        warning: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);
    const [loadingIeds, setLoadingIeds] = useState(true);
    const [error, setError] = useState(null);

    /* Filtros */
    const [filterStatus, setFilterStatus] = useState("");
    const [filterSeverity, setFilterSeverity] = useState("");
    const [filterIed, setFilterIed] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");

    /* Paginação */
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0
    });

    /*
     * ============================================================
     * CARREGAR IEDS (para o filtro)
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
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const result = await response.json();
                const data = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];
                setIeds(data);
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
            if (filterIed) params.append("ied_id", filterIed);
            if (filterStatus) params.append("status", filterStatus);
            if (filterSeverity) params.append("severity", filterSeverity);
            if (dateStart) params.append("data_inicial", dateStart);
            if (dateEnd) params.append("data_final", dateEnd);

            const response = await fetch(`/api/v1/events/resumo?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            setSummary(result || {});
        } catch (err) {
            console.error("Erro ao carregar resumo:", err);
        }
    }, [filterIed, filterStatus, filterSeverity, dateStart, dateEnd]);

    /*
     * ============================================================
     * CARREGAR EVENTOS
     * ============================================================
     */
    const carregarEventos = useCallback(async () => {
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
            if (filterSeverity) {
                params.append("severity", filterSeverity);
            }
            if (dateStart) {
                params.append("data_inicial", dateStart);
            }
            if (dateEnd) {
                params.append("data_final", dateEnd);
            }

            const response = await fetch(
                `/api/v1/events?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erro HTTP ${response.status} ao carregar eventos`
                );
            }

            const result = await response.json();
            const payload = result?.data || result || {};

            setEvents(
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
            console.error("Erro ao carregar eventos:", err);
            setError(
                err.message || "Erro ao carregar eventos."
            );
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [
        page,
        perPage,
        filterIed,
        filterStatus,
        filterSeverity,
        dateStart,
        dateEnd
    ]);

    /*
     * ============================================================
     * PRIMEIRA CARGA + RESUMO
     * ============================================================
     */
    useEffect(() => {
        carregarResumo();
    }, [carregarResumo]);

    useEffect(() => {
        carregarEventos();
    }, [carregarEventos]);

    /*
     * ============================================================
     * FILTROS — resetam a página
     * ============================================================
     */
    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setFilterStatus("");
        setFilterSeverity("");
        setFilterIed("");
        setDateStart("");
        setDateEnd("");
        setPage(1);
    };

    /*
     * ============================================================
     * HELPERS
     * ============================================================
     */
    const getSeverity = (type) => {
        switch (type) {
            case "critical":
                return {
                    label: "Crítico",
                    className: "bg-danger",
                    icon: mdiAlertCircleOutline
                };
            case "warning":
                return {
                    label: "Atenção",
                    className: "bg-warning text-dark",
                    icon: mdiAlertOutline
                };
            case "info":
                return {
                    label: "Informação",
                    className: "bg-info text-dark",
                    icon: mdiInformationOutline
                };
            default:
                return {
                    label: "Normal",
                    className: "bg-secondary",
                    icon: mdiInformationOutline
                };
        }
    };

    const getEventType = (type) => {
        switch (type) {
            case "critical":
                return "Crítico";
            case "warning":
                return "Atenção";
            case "info":
                return "Informação";
            default:
                return type || "—";
        }
    };

    const getStatus = (status) => {
        if (status === "active") {
            return {
                label: "Ativo",
                className: "bg-success",
                icon: mdiAlertCircleOutline
            };
        }
        if (status === "open") {
            return {
                label: "Aberto",
                className: "bg-warning text-dark",
                icon: mdiAlertOutline
            };
        }
        if (status === "resolved") {
            return {
                label: "Resolvido",
                className: "bg-success",
                icon: mdiCheckCircleOutline
            };
        }
        if (!status) {
            return {
                label: "—",
                className: "bg-secondary",
                icon: mdiInformationOutline
            };
        }
        return {
            label: status,
            className: "bg-secondary",
            icon: mdiInformationOutline
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
                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">
                            Eventos Operacionais
                        </h2>
                        <div className="text-muted">
                            Ocorrências e alarmes dos equipamentos monitorados
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            clearFilters();
                            carregarEventos();
                            carregarResumo();
                        }}
                    >
                        <Icon
                            path={mdiRefresh}
                            size={0.8}
                            className="me-1"
                        />
                        Atualizar
                    </button>
                </div>
                {/* =================================================
                    ERRO
                ================================================== */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <Icon
                            path={mdiAlertCircleOutline}
                            size={1}
                            className="me-2"
                        />
                        <div>{error}</div>
                    </div>
                )}
                {/* =================================================
                    RESUMO
                ================================================== */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Total</div>
                                        <div className="fs-3 fw-bold">{summary.total}</div>
                                        <div className="text-muted small">Eventos registrados</div>
                                    </div>
                                    <div className="text-primary opacity-75">
                                        <Icon path={mdiInformationOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #dc3545" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Ativos</div>
                                        <div className="fs-3 fw-bold text-danger">{summary.active}</div>
                                        <div className="text-muted small">Necessitam atenção</div>
                                    </div>
                                    <div className="text-danger opacity-75">
                                        <Icon path={mdiAlertCircleOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #dc3545" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Críticos</div>
                                        <div className="fs-3 fw-bold text-danger">{summary.critical}</div>
                                        <div className="text-muted small">Alta prioridade</div>
                                    </div>
                                    <div className="text-danger opacity-75">
                                        <Icon path={mdiCloseCircleOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #ffc107" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Atenção</div>
                                        <div className="fs-3 fw-bold text-warning">{summary.warning}</div>
                                        <div className="text-muted small">Alertas</div>
                                    </div>
                                    <div className="text-warning opacity-75">
                                        <Icon path={mdiAlertOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">
                                            Resolvidos
                                        </div>
                                        <div className="fs-3 fw-bold text-success">
                                            {summary.resolved}
                                        </div>
                                        <div className="text-muted small">
                                            Ocorrências encerradas
                                        </div>
                                    </div>
                                    <div className="text-success opacity-75">
                                        <Icon path={mdiCheckCircleOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* =================================================
                    FILTROS
                ================================================== */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex align-items-center">
                            <Icon
                                path={mdiFilterOutline}
                                size={1}
                                className="text-primary me-2"
                            />
                            <div>
                                <div className="fw-semibold">
                                    Filtros
                                </div>
                                <div className="text-muted small">
                                    Refine a consulta de eventos
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-6 col-xl-3">
                                <label className="form-label">
                                    IED
                                </label>
                                <select
                                    className="form-select"
                                    value={filterIed}
                                    onChange={handleFilterChange(setFilterIed)}
                                    disabled={loadingIeds}
                                >
                                    <option value="">
                                        {loadingIeds
                                            ? "Carregando IEDs..."
                                            : "Todos os IEDs"
                                        }
                                    </option>
                                    {ieds.map((ied) => (
                                        <option
                                            key={ied.id}
                                            value={ied.id}
                                        >
                                            {ied.name || ied.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-xl-3">
                                <label className="form-label">
                                    Severidade
                                </label>
                                <select
                                    className="form-select"
                                    value={filterSeverity}
                                    onChange={handleFilterChange(setFilterSeverity)}
                                >
                                    <option value="">
                                        Todas
                                    </option>
                                    <option value="critical">
                                        Crítico
                                    </option>
                                    <option value="warning">
                                        Atenção
                                    </option>
                                    <option value="info">
                                        Informação
                                    </option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-xl-2">
                                <label className="form-label">
                                    Status
                                </label>
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={handleFilterChange(setFilterStatus)}
                                >
                                    <option value="">
                                        Todos
                                    </option>
                                    <option value="active">
                                        Ativo
                                    </option>
                                    <option value="open">
                                        Aberto
                                    </option>
                                    <option value="resolved">
                                        Resolvido
                                    </option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-xl-2">
                                <label className="form-label">
                                    Data inicial
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon
                                            path={mdiCalendarRange}
                                            size={0.8}
                                        />
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
                                <label className="form-label">
                                    Data final
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Icon
                                            path={mdiCalendarRange}
                                            size={0.8}
                                        />
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
                {/* =================================================
                    TABELA
                ================================================== */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-semibold">
                                    Eventos registrados
                                </div>
                                <div className="text-muted small">
                                    {pagination.total} ocorrências encontradas
                                </div>
                            </div>
                            <Icon
                                path={mdiAlertCircleOutline}
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
                                    <th>Tipo</th>
                                    <th>Severidade</th>
                                    <th>Status</th>
                                    <th>Mensagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5"
                                        >
                                            <Icon
                                                path={mdiLoading}
                                                size={1}
                                                spin
                                            />
                                            <div className="mt-2 text-muted">
                                                Carregando eventos...
                                            </div>
                                        </td>
                                    </tr>
                                ) : events.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center text-muted py-5"
                                        >
                                            <Icon
                                                path={mdiCheckCircleOutline}
                                                size={1.8}
                                                className="mb-2 text-success"
                                            />
                                            <div>
                                                Nenhum evento encontrado
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event) => {
                                        const severity =
                                            getSeverity(event.type);
                                        const status =
                                            getStatus(event.status);
                                        const dt = formatDateTime(
                                            event.timestamp
                                        );
                                        return (
                                            <tr key={event.id}>
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
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Icon
                                                            path={mdiServerNetwork}
                                                            size={0.9}
                                                            className="text-primary me-2"
                                                        />
                                                        <div>
                                                            <div className="fw-semibold">
                                                                {event.ied_name || event.ied_id || "—"}
                                                            </div>
                                                            <div className="small text-muted">
                                                                {event.ied_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">
                                                        {getEventType(event.type)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${severity.className} d-flex align-items-center`}
                                                    >
                                                        <Icon
                                                            path={severity.icon}
                                                            size={0.65}
                                                            className="me-1"
                                                        />
                                                        {severity.label}
                                                    </span>
                                                </td>
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
                                                <td>
                                                    <span className="text-muted">
                                                        {event.message || "—"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* =================================================
                        PAGINAÇÃO
                    ================================================== */}
                    {pagination.last_page > 1 && (
                        <div className="card-footer bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div className="text-muted small">
                                    Exibindo {pagination.from} até {pagination.to} de{" "}
                                    {pagination.total}
                                </div>
                                <nav>
                                    <ul className="pagination pagination-sm mb-0">
                                        <li
                                            className={`page-item ${
                                                page <= 1 ? "disabled" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                disabled={page <= 1}
                                                onClick={() => setPage(page - 1)}
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        {pages.map((number) => (
                                            <li
                                                key={number}
                                                className={`page-item ${
                                                    number === page ? "active" : ""
                                                }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(number)}
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                        <li
                                            className={`page-item ${
                                                page >= pagination.last_page
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                disabled={
                                                    page >= pagination.last_page
                                                }
                                                onClick={() => setPage(page + 1)}
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
