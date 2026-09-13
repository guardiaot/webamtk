import React, { useEffect, useMemo, useState } from "react";

import Icon from "@mdi/react";

import {
    mdiChartLine,
    mdiMagnify,
    mdiRefresh,
    mdiCalendarRange,
    mdiServerNetwork,
    mdiFlashOutline,
    mdiTransmissionTower,
    mdiGauge,
    mdiAlertCircleOutline,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";


export default function History() {
    const [ied, setIed] = useState("all");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [ieds, setIeds] = useState([]);
    const [records, setRecords] = useState([]);
    const [loadingIeds, setLoadingIeds] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 15;
    /*
     * ============================================================
     * CARREGA IEDS
     * ============================================================
     */
    useEffect(() => {
        const loadIeds = async () => {
            try {
                setLoadingIeds(true);
                setError(null);
                const response = await fetch("/telemetry/ieds", {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const result = await response.json();
                /*
                 * Aceita:
                 *
                 * { data: [...] }
                 * { ieds: [...] }
                 * [...]
                 */
                let list = [];
                if (Array.isArray(result)) {
                    list = result;
                } else if (Array.isArray(result.data)) {
                    list = result.data;
                } else if (Array.isArray(result.ieds)) {
                    list = result.ieds;
                }
                setIeds(list);
            } catch (err) {
                console.error(
                    "Erro ao carregar IEDs:",
                    err
                );
                setError(
                    err.message ||
                    "Erro ao carregar os IEDs."
                );
            } finally {
                setLoadingIeds(false);
            }
        };
        loadIeds();
    }, []);

    /*
     * ============================================================
     * CONSULTA HISTÓRICO
     * ============================================================
     */
    const handleSearch = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = "/telemetry/history/ied";
            if (ied !== "all") {
                url = `/telemetry/history/ied/${ied}`;
            }

            const params = new URLSearchParams();

            if (dateStart) {
                params.append("data_inicial", dateStart);
            }
            if (dateEnd) {
                params.append("data_final", dateEnd);
            }
            if (page) {
                params.append("page", page);
            }

            if (perPage) {
                params.append("per_page", perPage);
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const payload = result && typeof result === "object" ? result : {};
            const rows = Array.isArray(payload)
                ? payload
                : Array.isArray(payload.data)
                    ? payload.data
                    : Array.isArray(payload?.data?.data)
                        ? payload.data.data
                        : [];

            
            setRecords(rows);
            setTotal(payload?.data?.total || 0);
        } catch (error) {
            console.error("Erro ao consultar histórico:", error);
            setError(error.message || "Erro ao consultar o histórico.");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / perPage);

//console.log(records);

    /*
     * ============================================================
     * LIMPAR
     * ============================================================
     */
    const handleClear = () => {
        setIed("all");
        setDateStart("");
        setDateEnd("");
        setRecords([]);
        setError(null);
    };

    /*
     * ============================================================
     * CARREGA HISTÓRICO AUTOMATICAMENTE
     * ============================================================
     */
    useEffect(() => {
        if (!loadingIeds && ieds.length > 0) {
            handleSearch();
        }
    }, [loadingIeds,page, ieds]);
    /*
     * ============================================================
     * FORMATAÇÃO
     * ============================================================
     */
    const formatNumber = (
        value,
        decimals = 1
    ) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return "—";
        }
        return number.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }
        );
    };
    /*
     * ============================================================
     * NORMALIZA DATA/HORA
     * ============================================================
     */
    const getDate = (record) => {
        if (record.date) {
            return record.date;
        }
        if (record.timestamp) {
            const date = new Date(record.timestamp);
            if (!Number.isNaN(date.getTime())) {
                return date.toLocaleDateString(
                    "pt-BR"
                );
            }
        }
        if (record.created_at) {
            const date = new Date(record.created_at);
            if (!Number.isNaN(date.getTime())) {
                return date.toLocaleDateString(
                    "pt-BR"
                );
            }
        }
        return "—";
    };

    const getTime = (record) => {
        if (record.time) {
            return record.time;
        }
        if (record.timestamp) {
            const date = new Date(record.timestamp);
            if (!Number.isNaN(date.getTime())) {
                return date.toLocaleTimeString(
                    "pt-BR"
                );
            }
        }
        if (record.created_at) {
            const date = new Date(record.created_at);
            if (!Number.isNaN(date.getTime())) {
                return date.toLocaleTimeString(
                    "pt-BR"
                );
            }
        }
        return "—";
    };
    /*
     * ============================================================
     * RESUMO
     * ============================================================
     */

    const summary = useMemo(() => {
        if (!records.length) {
            return {
                current: null,
                voltage: null,
                frequency: null
            };
        }
        const currentValues = records
            .flatMap((item) => [
                Number(item.ia),
                Number(item.ib),
                Number(item.ic)
            ])
            .filter(Number.isFinite);
        const voltageValues = records
            .flatMap((item) => [
                Number(item.va),
                Number(item.vb),
                Number(item.vc)
            ])
            .filter(Number.isFinite);
        const frequencyValues = records
            .map((item) => item.frequency)
            .filter(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    Number.isFinite(Number(value))
            )
            .map(Number);
        const current =
            currentValues.length
                ? currentValues.reduce(
                    (sum, value) => sum + value,
                    0
                ) / currentValues.length
                : null;
        const voltage =
            voltageValues.length
                ? voltageValues.reduce(
                    (sum, value) => sum + value,
                    0
                ) / voltageValues.length
                : null;
        const frequency =
            frequencyValues.length
                ? frequencyValues.reduce(
                    (sum, value) => sum + value,
                    0
                ) / frequencyValues.length
                : null;
        return {
            current,
            voltage,
            frequency
        };
    }, [records]);
    /*
     * ============================================================
     * IED SELECIONADO
     * ============================================================
     */
    const selectedIed = useMemo(() => {
        return ieds.find(
            (item) =>
                String(item.id) === String(ied)
        );
    }, [ieds, ied]);



    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">
                            Histórico de Telemetria
                        </h2>
                        <div className="text-muted">
                            Consulta histórica das medições dos IEDs
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            <Icon
                                path={mdiRefresh}
                                size={0.8}
                                className="me-1"
                            />
                            Limpar
                        </button>
                    </div>
                </div>
                {/* =================================================
                    ERRO
                ================================================== */}
                {error && (
                    <div
                        className="alert alert-danger d-flex align-items-center mb-4"
                        role="alert"
                    >
                        <Icon
                            path={mdiAlertCircleOutline}
                            size={1}
                            className="me-2"
                        />
                        <div>
                            {error}
                        </div>
                    </div>
                )}
                {/* =================================================
                    FILTROS
                ================================================== */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="fw-semibold">
                            Filtros de consulta
                        </div>
                        <div className="text-muted small">
                            Selecione o equipamento e o período
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* IED */}
                            <div className="col-12 col-lg-4">
                                <label className="form-label">
                                    IED
                                </label>
                                <select
                                    className="form-select"
                                    value={ied}
                                    onChange={(e) => {
                                        setIed(e.target.value);
                                        setPage(1);
                                        setRecords([]);
                                        setTotal(0)
                                    }}
                                    disabled={loadingIeds}
                                >
                                    <option value="all">
                                        {loadingIeds
                                            ? "Carregando IEDs..."
                                            : "Selecione um IED"
                                        }
                                    </option>
                                    {ieds.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name ||
                                                item.nome ||
                                                item.id}
                                        </option>
                                    ))}
                                </select>
                                {selectedIed && (
                                    <div className="small text-muted mt-1">
                                        {selectedIed.manufacturer || ""}
                                        {" "}
                                        {selectedIed.model || ""}
                                    </div>
                                )}
                            </div>
                            {/* DATA INICIAL */}
                            <div className="col-12 col-md-6 col-lg-3">
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
                                        onChange={(e) =>
                                            setDateStart(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            {/* DATA FINAL */}
                            <div className="col-12 col-md-6 col-lg-3">
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
                                        onChange={(e) =>
                                            setDateEnd(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            {/* CONSULTAR */}
                            <div className="col-12 col-lg-2 d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleSearch}
                                    disabled={
                                        loading ||
                                        loadingIeds
                                    }
                                >
                                    <Icon
                                        path={mdiMagnify}
                                        size={0.8}
                                        className="me-1"
                                    />
                                    {loading
                                        ? "Consultando..."
                                        : "Consultar"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* =================================================
                    IED SELECIONADO
                ================================================== */}
                {selectedIed && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body py-3">
                            <div className="d-flex align-items-center">
                                <Icon
                                    path={mdiServerNetwork}
                                    size={1.2}
                                    className="text-primary me-3"
                                />
                                <div>
                                    <div className="fw-semibold">
                                        {selectedIed.name ||
                                            selectedIed.nome ||
                                            selectedIed.id}
                                    </div>
                                    <div className="text-muted small">
                                        {selectedIed.manufacturer || ""}
                                        {" "}
                                        {selectedIed.model || ""}
                                        {" • "}
                                        {selectedIed.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* =================================================
                    RESUMO
                ================================================== */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Corrente média</div>
                                        <div className="fs-4 fw-bold">{summary.current === null ? "—" : `${formatNumber(summary.current, 2)} A`}</div>
                                    </div>
                                    <div className="text-primary opacity-75">
                                        <Icon path={mdiFlashOutline} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Tensão média</div>
                                        <div className="fs-4 fw-bold">{summary.voltage === null ? "—" : `${formatNumber(summary.voltage, 0)} V`}</div>
                                    </div>
                                    <div className="text-success opacity-75">
                                        <Icon path={mdiTransmissionTower} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0dcaf0" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Frequência média</div>
                                        <div className="fs-4 fw-bold">{summary.frequency === null ? "—" : `${formatNumber(summary.frequency, 2)} Hz`}</div>
                                    </div>
                                    <div className="text-info opacity-75">
                                        <Icon path={mdiGauge} size={1.6} />
                                    </div>
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
                                    Medições
                                </div>
                                <div className="text-muted small">
                                    {records.length}
                                    {" "}registros encontrados
                                </div>
                            </div>
                            <Icon
                                path={mdiChartLine}
                                size={1.1}
                                className="text-primary"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">


                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Hora</th>
                                    <th>IED</th>
                                    <th className="text-end">
                                        Ia
                                    </th>
                                    <th className="text-end">
                                        Ib
                                    </th>
                                    <th className="text-end">
                                        Ic
                                    </th>
                                    <th className="text-end">
                                        Va
                                    </th>
                                    <th className="text-end">
                                        Vb
                                    </th>
                                    <th className="text-end">
                                        Vc
                                    </th>
                                    <th className="text-end">
                                        Hz
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center text-muted py-5"
                                        >
                                            {loading ? (
                                                <>
                                                    <Icon path={mdiLoading} size={1.5} spin className="mb-2" />
                                                    <div>Consultando medições...</div>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon path={mdiChartLine} size={1.8} className="mb-2" />
                                                    <div>Nenhuma medição encontrada</div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record, index) => (
                                        <tr
                                            key={
                                                record.id ||
                                                record.timestamp ||
                                                index
                                            }
                                        >
                                            <td>
                                                {getDate(record)}
                                            </td>
                                            <td>
                                                {getTime(record)}
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
                                                            {record.name ||
                                                                record.code ||
                                                                record.ied_id ||
                                                                "—"}
                                                        </div>
                                                        <div className="small text-muted">
                                                            IED ID: {record.ied_id ??
                                                                ied}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.ia,
                                                    1
                                                )} A
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.ib,
                                                    1
                                                )} A
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.ic,
                                                    1
                                                )} A
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.va,
                                                    0
                                                )} V
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.vb,
                                                    0
                                                )} V
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.vc,
                                                    0
                                                )} V
                                            </td>
                                            <td className="text-end">
                                                {formatNumber(
                                                    record.frequency,
                                                    2
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <nav className="d-flex justify-content-end mt-3">
                                <ul className="pagination pagination-sm">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(p => p - 1)}>‹</button>
                                    </li>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                        <li key={n} className={`page-item ${page === n ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(n)}>{n}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(p => p + 1)}>›</button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
