import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiCalendarRange } from "@mdi/js";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";
import { getFaultLocationFileColumns } from "./columns";

export default function FaultLocationFiles({ user = {} }) {
    const [filters, setFilters] = useState({
        ied_id: "",
        installation_id: "",
        data_inicial: "",
        data_final: "",
        source: ""
    });

    const canDownload = (user.permissions || []).includes("comtrade.download");
    const columns = getFaultLocationFileColumns(canDownload);

    const updateFilter = (key, value) => {
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
                        <h2 className="mb-1">Arquivos de Localização de Falta</h2>
                        <div className="text-muted">
                            Arquivos COMTRADE associados aos resultados de localização de falta
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="fw-semibold">Filtros</div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-xl-3">
                                <label className="form-label">IED</label>
                                <AjaxSumoSelect
                                    url="/api/v1/ieds/simples"
                                    value={filters.ied_id}
                                    onChange={(event) => updateFilter("ied_id", event.value)}
                                    labelField="name"
                                    valueField="id"
                                    placeholder="Todos os IEDs"
                                />
                            </div>
                            <div className="col-12 col-xl-3">
                                <label className="form-label">Instalação</label>
                                <AjaxSumoSelect
                                    url="/api/v1/installations/simples"
                                    value={filters.installation_id}
                                    onChange={(event) => updateFilter("installation_id", event.value)}
                                    labelField="name"
                                    valueField="id"
                                    placeholder="Todas as instalações"
                                />
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
                                        value={filters.data_inicial}
                                        onChange={(event) => updateFilter("data_inicial", event.target.value)}
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
                                        value={filters.data_final}
                                        min={filters.data_inicial || undefined}
                                        onChange={(event) => updateFilter("data_final", event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-xl-2">
                                <label className="form-label">Origem</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.source}
                                    onChange={(event) => updateFilter("source", event.target.value)}
                                    placeholder="Todas"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    title="Arquivos de Localização de Falta"
                    subtitle="Arquivos COMTRADE associados aos resultados reais de localização de falta"
                    ajax="/api/v1/fault-location-files"
                    columns={columns}
                    filters={filters}
                    pageSize={20}
                    pageSizeOptions={[20, 50, 100]}
                />
            </div>
        </LayoutAdmin>
    );
}
