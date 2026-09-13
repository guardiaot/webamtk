import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import Icon from "@mdi/react";

import {
    mdiFlashOutline,
    mdiTransmissionTower,
    mdiGauge,
    mdiAccessPoint,
    mdiRefresh,
    mdiClockOutline,
    mdiServerNetwork,
    mdiAlertCircleOutline,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable.jsx";
import { getTelemetryColumns } from "./columns";

export default function Telemetry() {
    /*
     * ============================================================
     * ESTADOS
     * ============================================================
     */
    const [telemetry, setTelemetry] = useState([]);
    const [ieds, setIeds] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedIed, setSelectedIed] = useState("all");
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableFilters, setTableFilters] = useState({ status: "" });

    const tableFilterOptions = {
        status: [
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" }
        ]
    };

    const handleTableFilterChange = (key, value) => {
        setTableFilters((prev) => ({ ...prev, [key]: value }));
    };
    /*
     * ============================================================
     * CARREGAR IEDS
     *
     * GET /api/v1/ieds
     * ============================================================
     */
    const carregarIeds = useCallback(async () => {
        try {
            const response = await fetch("/telemetry/ieds",
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
                    `Erro HTTP ${response.status} ao carregar IEDs`
                );
            }
            const result = await response.json();
            /*
             * A API do Agent pode retornar:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * ou:
             *
             * {
             *   status: "OK",
             *   data: [...]
             * }
             */
            const data = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];
            setIeds(data);
        } catch (err) {
            console.error(
                "Telemetry - IEDs:",
                err
            );
            setIeds([]);
            setError(
                err.message ||
                "Erro ao carregar IEDs."
            );
        }
    }, []);
    /*
     * ============================================================
     * CARREGAR ÚLTIMAS TELEMETRIAS
     *
     * GET /telemetry/ultimas
     * ============================================================
     */
    const carregarUltimas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/telemetry/ultimas",
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
                    `Erro HTTP ${response.status} ao carregar telemetria`
                );
            }
            const result = await response.json();
            /*
             * Esperado:
             *
             * {
             *   status: "OK",
             *   data: [...]
             * }
             */
            if (
                result &&
                result.status &&
                result.status !== "OK"
            ) {
                throw new Error(
                    result.message ||
                    "Erro ao carregar telemetria."
                );
            }
            const data = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];
            setTelemetry(data);
        } catch (err) {
            console.error(
                "Telemetry:",
                err
            );
            setTelemetry([]);
            setError(
                err.message ||
                "Erro ao carregar telemetria."
            );
        } finally {
            setLoading(false);
        }
    }, []);
    /*
     * ============================================================
     * CARREGAR DADOS
     * ============================================================
     */
    const carregarDados = useCallback(async () => {
        await Promise.all([
            carregarIeds(),
            carregarUltimas()
        ]);
    }, [
        carregarIeds,
        carregarUltimas
    ]);
    /*
     * ============================================================
     * PRIMEIRA CARGA
     * ============================================================
     */
    useEffect(() => {
        carregarDados();
    }, [carregarDados]);
    /*
     * ============================================================
     * ATUALIZAÇÃO AUTOMÁTICA
     * ============================================================
     */
    useEffect(() => {
        if (!autoRefresh) {
            return;
        }
        const interval = setInterval(() => {
            carregarDados();
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [
        autoRefresh,
        carregarDados
    ]);
    /*
     * ============================================================
     * FILTRO
     * ============================================================
     */
    const filteredTelemetry = useMemo(() => {
        const value = search.trim().toLowerCase();
        return telemetry.filter((item) => {
            const matchesIed =
                selectedIed === "all" ||
                item.ied_id === selectedIed;
            if (!matchesIed) {
                return false;
            }
            if (!value) {
                return true;
            }
            return (
                String(item.ied_id || "")
                    .toLowerCase()
                    .includes(value) ||
                String(item.ied_name || "")
                    .toLowerCase()
                    .includes(value) ||
                String(item.manufacturer || "")
                    .toLowerCase()
                    .includes(value)
            );
        });
    }, [
        telemetry,
        search,
        selectedIed
    ]);
    /*
     * ============================================================
     * RESUMO
     * ============================================================
     */
    const summary = useMemo(() => {
        if (!filteredTelemetry.length) {
            return {
                currentAverage: 0,
                voltageAverage: 0,
                voltageUnbalance: 0,
                frequency: null,
                powerKw: null
            };
        }
        let currentSum = 0;
        let currentCount = 0;
        let voltageSum = 0;
        let voltageCount = 0;
        let maxUnbalance = 0;
        let frequency = null;
        let powerKw = null;
        filteredTelemetry.forEach((item) => {
            /*
             * ----------------------------------------------------
             * CORRENTE
             * ----------------------------------------------------
             */
            const currents = [
                Number(item.ia),
                Number(item.ib),
                Number(item.ic)
            ].filter(Number.isFinite);
            currents.forEach((value) => {
                currentSum += value;
                currentCount++;
            });
            /*
             * ----------------------------------------------------
             * TENSÃO
             * ----------------------------------------------------
             */
            const va = Number(item.va);
            const vb = Number(item.vb);
            const vc = Number(item.vc);
            if (
                Number.isFinite(va) &&
                Number.isFinite(vb) &&
                Number.isFinite(vc)
            ) {
                const average = (va + vb + vc) / 3;
                voltageSum += average;
                voltageCount++;
                const maxDeviation = Math.max(
                    Math.abs(va - average),
                    Math.abs(vb - average),
                    Math.abs(vc - average)
                );
                if (average > 0) {
                    const unbalance =
                        (maxDeviation / average) * 100;
                    maxUnbalance =
                        Math.max(
                            maxUnbalance,
                            unbalance
                        );
                }
            }
            /*
             * ----------------------------------------------------
             * FREQUÊNCIA
             * ----------------------------------------------------
             */
            if (
                frequency === null &&
                item.frequency !== null &&
                item.frequency !== undefined
            ) {
                const value =
                    Number(item.frequency);
                if (Number.isFinite(value)) {
                    frequency = value;
                }
            }
            /*
             * ----------------------------------------------------
             * POTÊNCIA
             * ----------------------------------------------------
             */
            if (
                powerKw === null &&
                item.power_w !== null &&
                item.power_w !== undefined &&
                item.power_w !== ""
            ) {
                const value =
                    Number(item.power_w);
                if (Number.isFinite(value)) {
                    powerKw = value / 1000;
                }
            }
        });
        return {
            currentAverage:
                currentCount > 0
                    ? currentSum / currentCount
                    : 0,
            voltageAverage:
                voltageCount > 0
                    ? voltageSum / voltageCount
                    : 0,
            voltageUnbalance:
                maxUnbalance,
            frequency,
            powerKw
        };
    }, [
        filteredTelemetry
    ]);
    /*
     * ============================================================
     * COLUNAS
     * ============================================================
     */
    const columns = useMemo(() => {
        return getTelemetryColumns();
    }, []);
    /*
     * ============================================================
     * GARANTIR QUE O IED SELECIONADO AINDA EXISTE
     * ============================================================
     */
    useEffect(() => {
        if (
            selectedIed !== "all" &&
            ieds.length > 0 &&
            !ieds.some(
                (ied) =>
                    String(
                        ied.id ??
                        ied.ied_id
                    ) === selectedIed
            )
        ) {
            setSelectedIed("all");
        }
    }, [
        ieds,
        selectedIed
    ]);
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
                            Telemetria
                        </h2>
                        <div className="text-muted">
                            Monitoramento das grandezas elétricas
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center">
                            <span
                                className={
                                    `rounded-circle me-2 ${autoRefresh
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`
                                }
                                style={{
                                    width: "8px",
                                    height: "8px"
                                }}
                            />
                            <span className="small text-muted">
                                {autoRefresh
                                    ? "Atualização automática"
                                    : "Atualização pausada"
                                }
                            </span>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={carregarDados}
                            disabled={loading}
                        >
                            <Icon
                                path={mdiRefresh}
                                size={0.75}
                                className="me-2"
                            />
                            Atualizar
                        </button>
                    </div>
                </div>
                {/* =================================================
                    ERRO
                ================================================== */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        {error}
                    </div>
                )}
                {/* =================================================
                    FILTROS
                ================================================== */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            {/* IED */}
                            <div className="col-12 col-md-4">
                                <label className="form-label">
                                    IED
                                </label>
                                <select
                                    className="form-select"
                                    value={selectedIed}
                                    onChange={(event) =>
                                        setSelectedIed(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="all">
                                        Todos os IEDs
                                    </option>
                                    {ieds.map((ied) => {
                                        const id =
                                            ied.id ??
                                            ied.ied_id;
                                        const name =
                                            ied.name ??
                                            ied.ied_name ??
                                            id;
                                        return (
                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                                {!ieds.length && !loading && (
                                    <div className="small text-muted mt-1">
                                        Nenhum IED disponível
                                    </div>
                                )}
                            </div>
                            {/* PESQUISA */}
                            <div className="col-12 col-md-5">
                                <label className="form-label">
                                    Pesquisa
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <Icon
                                            path={mdiServerNetwork}
                                            size={0.75}
                                        />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="IED, fabricante..."
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            {/* AUTO REFRESH */}
                            <div className="col-12 col-md-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(event) =>
                                            setAutoRefresh(
                                                event.target.checked
                                            )
                                        }
                                    />
                                    <label className="form-check-label">
                                        Atualização automática
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* =================================================
                    CARDS
                ================================================== */}
                <div className="row g-3 mb-4">
                    {/* CORRENTE */}
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Corrente média</div>
                                        <div className="fs-4 fw-bold">
                                            {summary.currentAverage.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} A
                                        </div>
                                        <div className="small text-muted mt-1">Ia / Ib / Ic</div>
                                    </div>
                                    <div className="text-primary opacity-75">
                                        <Icon path={mdiFlashOutline} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TENSÃO */}
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Tensão média</div>
                                        <div className="fs-4 fw-bold">
                                            {summary.voltageAverage.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} V
                                        </div>
                                        <div className="small text-muted mt-1">Va / Vb / Vc</div>
                                        <div className="small mt-2">
                                            Desbalanceamento: <strong className="text-warning">{summary.voltageUnbalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</strong>
                                        </div>
                                    </div>
                                    <div className="text-success opacity-75">
                                        <Icon path={mdiTransmissionTower} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* POTÊNCIA */}
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #ffc107" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Potência ativa</div>
                                        <div className="fs-4 fw-bold">
                                            {summary.powerKw !== null
                                                ? `${summary.powerKw.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`
                                                : "—"
                                            }
                                        </div>
                                        <div className="small text-muted mt-1">
                                            {summary.powerKw !== null ? "Medição instantânea" : "Não disponível"}
                                        </div>
                                    </div>
                                    <div className="text-warning opacity-75">
                                        <Icon path={mdiGauge} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* FREQUÊNCIA */}
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0dcaf0" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Frequência</div>
                                        <div className="fs-4 fw-bold">
                                            {summary.frequency !== null
                                                ? `${summary.frequency.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Hz`
                                                : "—"
                                            }
                                        </div>
                                        <div className="small text-muted mt-1">
                                            {summary.frequency !== null ? "Medição instantânea" : "Não disponível"}
                                        </div>
                                    </div>
                                    <div className="text-info opacity-75">
                                        <Icon path={mdiAccessPoint} size={1.6} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* =================================================
                    TABELA
                ================================================== */}
                <div className="table-responsive">
                    <DataTable
                        height="530px"
                        title="Leituras"
                        subtitle="Última telemetria disponível por IED"
                        ajax="/telemetry/listar"
                        columns={columns}
                        selectable
                        filters={tableFilters}
                        filterOptions={tableFilterOptions}
                        onFilterChange={handleTableFilterChange}
                    />
                </div>
            </div>
        </LayoutAdmin>
    );
}