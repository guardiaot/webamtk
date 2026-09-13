import React, { useEffect, useState } from "react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import { getFaultLocationColumns } from "./columns";

const columns = getFaultLocationColumns();

export default function FaultLocations() {
    const [filters, setFilters] = useState({
        status: ""
    });
    const [summary, setSummary] = useState({
        total: 0,
        calculated: 0,
        insufficient_data: 0,
        error: 0
    });

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const params = new URLSearchParams();
                params.append("per_page", "1");

                if (filters.status) {
                    params.append("status", filters.status);
                }

                const response = await fetch(
                    "/api/v1/fault-locations?" + params.toString(),
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "X-Requested-With": "XMLHttpRequest"
                        }
                    }
                );

                if (!response.ok) {
                    return;
                }

                const result = await response.json();
                const data = result?.data || {};

                setSummary({
                    total: data.total || 0,
                    calculated: data.calculated || 0,
                    insufficient_data: data.insufficient_data || 0,
                    error: data.error || 0
                });
            } catch (error) {
                console.error("FaultLocations:", error);
            }
        };

        loadSummary();
    }, [filters.status]);

    const handleFilterChange = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value
        }));
    };

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Localiza&ccedil;&atilde;o da Falta</h2>
                        <div className="text-muted">
                            Resultados de localiza&ccedil;&atilde;o de faltas associados &agrave;s oscilografias
                        </div>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Total</div>
                                <div className="fs-3 fw-bold">{summary.total}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Calculadas</div>
                                <div className="fs-3 fw-bold text-success">{summary.calculated}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #ffc107" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Dados insuficientes</div>
                                <div className="fs-3 fw-bold text-warning">{summary.insufficient_data}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #dc3545" }}>
                            <div className="card-body">
                                <div className="text-muted small mb-1">Erros</div>
                                <div className="fs-3 fw-bold text-danger">{summary.error}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    title="Localiza&ccedil;&otilde;es de Falta"
                    subtitle="Resultados calculados a partir dos registros COMTRADE"
                    ajax="/api/v1/fault-locations"
                    columns={columns}
                    filters={filters}
                    filterOptions={{
                        status: [
                            { value: "pending", label: "Pendente" },
                            { value: "processing", label: "Processando" },
                            { value: "calculated", label: "Calculada" },
                            { value: "insufficient_data", label: "Dados insuficientes" },
                            { value: "error", label: "Erro" }
                        ]
                    }}
                    onFilterChange={handleFilterChange}
                    pageSize={20}
                    pageSizeOptions={[10, 20, 50, 100]}
                />
            </div>
        </LayoutAdmin>
    );
}

