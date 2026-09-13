import React, { useMemo, useState, useRef } from "react";
import Icon from "@mdi/react";
import toast, { Toaster } from "react-hot-toast";
import {
    mdiMagnify,
    mdiPlus,
    mdiServerNetwork,
    mdiRefresh,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiRadioTower,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from '@/Components/DataTable.jsx';
import { getIEDColumns } from "./columns.jsx";
import IEDForm from "./IEDForm.jsx";

export default function IED({ user, iedResumo, ieds = [] }) {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showDiscovery, setShowDiscovery] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [filters, setFilters] = useState({ status: "" });
    const dataTableRef = useRef(null);

    const filterOptions = {
        status: [
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
            { value: "error", label: "Erro" }
        ]
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredIeds = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return ieds;
        return ieds.filter((ied) =>
            (ied.id || "").toLowerCase().includes(value) ||
            (ied.name || "").toLowerCase().includes(value) ||
            (ied.manufacturer || "").toLowerCase().includes(value) ||
            (ied.model || "").toLowerCase().includes(value) ||
            (ied.host || "").toLowerCase().includes(value)
        );
    }, [ieds, search]);

    const openCreate = () => { setEditing(null); setShowModal(true); };
    const openEdit = (ied) => { setEditing(ied); setShowModal(true); };
    const openDiscovery = () => { setShowDiscovery(true); };

    const informacao = getIEDColumns({ openEdit });

    const handleSave = async (data) => {
        setSaving(true);
        try {
            var url = "/save/ied";
            if (data.id !== undefined && data.id !== null && data.id !== "") {
                 url = `/api/v1/ieds/${data.id}/update`;
            }
            console.log(url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                toast.error(`Erro HTTP ${response.status}`);
                return;
            }
            const result = await response.json();

            if (result.erro === 1) {
                toast.error(result.mensagem || "Erro ao salvar IED.");
                return;
            }
            toast.success("IED salvo com sucesso!");
            dataTableRef.current?.refresh();
            setShowModal(false);

        } catch (err) {
            console.error("Erro ao salvar IED:", err);
            toast.error("Erro inesperado ao salvar IED.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <LayoutAdmin>
            <Toaster position="top-right" />
            <div className="container-fluid py-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">IEDs</h2>
                        <div className="text-muted">Gerenciamento dos equipamentos IEC 61850</div>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-primary" onClick={openDiscovery}>
                            <Icon path={mdiMagnify} size={0.8} className="me-2" />
                            Descobrir IEDs
                        </button>
                        <button type="button" className="btn btn-primary" onClick={openCreate}>
                            <Icon path={mdiPlus} size={0.8} className="me-2" />
                            Cadastrar IED
                        </button>
                    </div>
                </div>

                {/* RESUMO */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #0d6efd" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Total de IEDs</div>
                                        <div className="fs-3 fw-bold">{iedResumo?.total ?? 0}</div>
                                        <div className="text-muted small">Equipamentos cadastrados</div>
                                    </div>
                                    <div className="text-primary opacity-75">
                                        <Icon path={mdiServerNetwork} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #198754" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Online</div>
                                        <div className="fs-3 fw-bold text-success">{iedResumo?.status ?? 0}</div>
                                        <div className="text-muted small">IEDs conectados</div>
                                    </div>
                                    <div className="text-success opacity-75">
                                        <Icon path={mdiCheckCircleOutline} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm" style={{ borderLeft: "4px solid #6c757d" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="text-muted small mb-1">Origem</div>
                                        <div className="d-flex align-items-baseline gap-2">
                                            <span className="fs-3 fw-bold">{iedResumo?.discovery ?? 0}</span>
                                            <span className="small text-muted">Discovery</span>
                                        </div>
                                        <div className="small text-muted  d-flex">
                                            <Icon path={mdiRadioTower} size={0.8} className="me-1" />
                                            {iedResumo?.manual ?? 0} cadastro manual
                                        </div>
                                    </div>
                                    <div className="text-secondary opacity-75">
                                        <Icon path={mdiMagnify} size={1.8} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LISTA */}
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <DataTable
                            height="600px"
                            title="Equipamentos"
                            subtitle="IEDs configurados para monitoramento"
                            ajax="/lista/ieds"
                            columns={informacao}
                            ref={dataTableRef}
                            selectable
                            filters={filters}
                            filterOptions={filterOptions}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {/* MODAL CADASTRO / EDIÇÃO */}
            {showModal && (
                <IEDForm
                    editing={editing}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}

            {/* MODAL DISCOVERY */}
            {showDiscovery && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <Icon path={mdiMagnify} size={0.9} className="me-2" />
                                    Discovery de IEDs
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowDiscovery(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="text-center py-4">
                                    <Icon path={mdiMagnify} size={2} className="text-primary mb-3" />
                                    <h5>Descobrir equipamentos IEC 61850</h5>
                                    <p className="text-muted">O Agent irá procurar IEDs disponíveis na rede.</p>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label">Rede / Host</label>
                                        <input type="text" className="form-control" placeholder="172.30.0.0/24" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Porta IEC 61850</label>
                                        <input type="number" className="form-control" value="102" readOnly />
                                    </div>
                                </div>
                                <div className="alert alert-warning mt-3 mb-0">
                                    Discovery depende da disponibilidade do equipamento e da rede.
                                    Equipamentos que não forem encontrados podem ser cadastrados manualmente.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDiscovery(false)}>
                                    Fechar
                                </button>
                                <button type="button" className="btn btn-primary">
                                    <Icon path={mdiMagnify} size={0.75} className="me-2" />
                                    Iniciar Discovery
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </LayoutAdmin>
    );
}
