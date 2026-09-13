import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import toast from "react-hot-toast";

import {
    mdiServerNetwork,
    mdiClose,
    mdiContentSaveOutline
} from "@mdi/js";

export default function IEDForm({
    editing = null,
    agents: agentsProp = [],
    onClose = () => { },
    onSave = () => { }
}) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        manufacturer: "",
        model: "",
        host: "",
        source: "",
        port: 102,
        agent_id: ""
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [agents, setAgents] = useState(agentsProp);

    /*
     * ============================================================
     * CARREGAR AGENTS DA API
     * ============================================================
     */
    useEffect(() => {
        const loadAgents = async () => {
            try {
                const response = await fetch("/api/v1/agents/simples", {
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
                    setAgents(data);
                }
            } catch (err) {
                console.error("Erro ao carregar agents:", err);
            }
        };
        loadAgents();
    }, []);
    /*
     * ============================================================
     * CARREGA EDIÇÃO
     * ============================================================
     */
    console.log(editing)
    useEffect(() => {
        if (editing) {
            setForm({
                id: editing.id || null,
                name: editing.name || "",
                manufacturer: editing.manufacturer || "",
                model: editing.model || "",
                host: editing.host || "",
                source: editing.source || "",
                port: editing.port || 102,
                agent_id: editing.agent_id || ""
            });
            return;
        }
        setForm({
            id: null,
            name: "",
            manufacturer: "",
            model: "",
            source: "",
            host: "",
            port: 102,
            agent_id: ""
        });
        setErrors({});
    }, [editing]);
    /*
     * ============================================================
     * ALTERA CAMPO
     * ============================================================
     */
    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value
        }));
        setErrors((current) => ({
            ...current,
            [name]: undefined
        }));
    };
    /*
     * ============================================================
     * VALIDAÇÃO
     * ============================================================
     */
    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Informe o nome do IED.";
        }
        if (!form.manufacturer.trim()) {
            newErrors.manufacturer =
                "Informe o fabricante.";
        }
        if (!form.model.trim()) {
            newErrors.model =
                "Informe o modelo.";
        }
        if (!form.host.trim()) {
            newErrors.host =
                "Informe o Host/IP.";
        }
        if (!form.source.trim()) {
            newErrors.source =
                "Informe o Source.";
        }
        if (!form.port) {
            newErrors.port =
                "Informe a porta.";
        }
        if (!form.agent_id) {
            newErrors.agent_id =
                "Selecione o Agent responsável.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /*
     * ============================================================
     * SALVAR
     * ============================================================
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            setSaving(true);
            await onSave({
                ...form,
                port: Number(form.port)
            });
        } finally {
            setSaving(false);
        }
    };
    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.45)"
            }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {editing
                                ? "Editar IED"
                                : "Cadastrar IED"
                            }
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={saving}
                        />
                    </div>
                    {/* =================================================
                        FORM
                    ================================================== */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                {/* Nome */}
                                <div className="col-12">
                                    <label className="form-label">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={
                                            `form-control ${errors.name
                                                ? "is-invalid"
                                                : ""
                                            }`
                                        }
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ex.: SEL-751-01"
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                {/* Fabricante */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Fabricante
                                    </label>
                                    <input
                                        type="text"
                                        name="manufacturer"
                                        className={
                                            `form-control ${errors.manufacturer
                                                ? "is-invalid"
                                                : ""
                                            }`
                                        }
                                        value={form.manufacturer}
                                        onChange={handleChange}
                                        placeholder="Ex.: SEL"
                                    />
                                    {errors.manufacturer && (
                                        <div className="invalid-feedback">
                                            {errors.manufacturer}
                                        </div>
                                    )}
                                </div>
                                {/* Modelo */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Modelo
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        className={
                                            `form-control ${errors.model
                                                ? "is-invalid"
                                                : ""
                                            }`
                                        }
                                        value={form.model}
                                        onChange={handleChange}
                                        placeholder="Ex.: SEL-751"
                                    />
                                    {errors.model && (
                                        <div className="invalid-feedback">
                                            {errors.model}
                                        </div>
                                    )}
                                </div>
                                {/* Host */}
                                <div className="col-md-8">
                                    <label className="form-label">
                                        Host / IP
                                    </label>
                                    <input
                                        type="text"
                                        name="host"
                                        className={
                                            `form-control ${errors.host
                                                ? "is-invalid"
                                                : ""
                                            }`
                                        }
                                        value={form.host}
                                        onChange={handleChange}
                                        placeholder="192.168.1.100"
                                    />
                                    {errors.host && (
                                        <div className="invalid-feedback">
                                            {errors.host}
                                        </div>
                                    )}
                                </div>
                                {/* Porta */}
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Porta
                                    </label>
                                    <input
                                        type="number"
                                        name="port"
                                        min="1"
                                        max="65535"
                                        className={
                                            `form-control ${errors.port
                                                ? "is-invalid"
                                                : ""
                                            }`
                                        }
                                        value={form.port}
                                        onChange={handleChange}
                                    />
                                    {errors.port && (
                                        <div className="invalid-feedback">
                                            {errors.port}
                                        </div>
                                    )}
                                </div>
                                {/* Agent */}
                                <div className="col-8">
                                    <label className="form-label">
                                        Agent responsável
                                    </label>
                                    <select name="agent_id" className={`form-select ${errors.agent_id ? "is-invalid" : ""}`} value={form.agent_id} onChange={handleChange} >
                                        <option value=""> Selecione o Agent </option>
                                        {agents.map((agent) => (
                                            <option
                                                key={agent.id}
                                                value={agent.id}
                                            >
                                                {agent.name || agent.id}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.agent_id && (
                                        <div className="invalid-feedback">
                                            {errors.agent_id}
                                        </div>
                                    )}
                                </div>
                                <div className="col-4">
                                    <label className="form-label">
                                        Source
                                    </label>
                                    <select name="source" className={`form-select ${errors.agent_id ? "is-invalid" : ""}`} value={form.source} onChange={handleChange} >
                                        <option value=""> Selecione... </option>
                                        <option value="manual">Manual</option>
                                        <option value="discovery">Discovery</option>
                                    </select>
                                    {errors.source && (
                                        <div className="invalid-feedback">
                                            {errors.source}
                                        </div>
                                    )}
                                </div>
                                {/* Informação */}
                                <div className="col-12">
                                    <div className="alert alert-info mb-0">
                                        <Icon
                                            path={mdiServerNetwork}
                                            size={0.8}
                                            className="me-2"
                                        />
                                        Um IED cadastrado manualmente
                                        poderá ser monitorado mesmo
                                        quando não estiver disponível
                                        no processo de Discovery.
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* =================================================
                            FOOTER
                        ================================================== */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                <Icon
                                    path={mdiContentSaveOutline}
                                    size={0.75}
                                    className="me-2"
                                />
                                {saving
                                    ? "Salvando..."
                                    : "Salvar IED"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
