import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import toast, { Toaster } from "react-hot-toast";

import {
    mdiCogOutline,
    mdiContentSaveOutline,
    mdiRefresh,
    mdiServerNetwork,
    mdiDatabaseOutline,
    mdiClockOutline,
    mdiChartLine,
    mdiShieldCheckOutline,
    mdiInformationOutline,
    mdiAccessPoint,
    mdiAlertCircleOutline,
    mdiLoading
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function System() {

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [settings, setSettings] = useState({
        systemName: "AMTK Monitoring",
        description: "Sistema de monitoramento de subestações",

        /*
         * Coleta
         */
        collectionInterval: 5,
        connectionTimeout: 5,
        retryAttempts: 3,

        /*
         * Telemetria
         */
        telemetryInterval: 5,
        telemetryRetention: 90,

        /*
         * Eventos
         */
        eventRetention: 180,

        /*
         * Comunicação
         */
        agentTimeout: 10,
        apiTimeout: 10,

        /*
         * Sistema
         */
        timezone: "America/Sao_Paulo",
        language: "pt-BR",

        /*
         * Segurança
         */
        sessionTimeout: 60,

        /*
         * Operação
         */
        maintenanceMode: false
    });

    /*
     * ============================================================
     * CARREGAR CONFIGURAÇÕES
     * ============================================================
     */
    useEffect(() => {
        const carregarConfig = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/v1/settings", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });

                if (!response.ok) {
                    toast.error(`Erro HTTP ${response.status} ao carregar configurações`);
                    return;
                }

                const result = await response.json();
                if (result.erro === 0 && result.data) {
                    setSettings((prev) => ({
                        ...prev,
                        ...result.data
                    }));
                }
            } catch (err) {
                console.error("Erro ao carregar configurações:", err);
                toast.error("Erro inesperado ao carregar configurações.");
            } finally {
                setLoading(false);
            }
        };
        carregarConfig();
    }, []);

    const handleChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/v1/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                toast.error(`Erro HTTP ${response.status}`);
                return;
            }

            const result = await response.json();
            if (result.erro === 1) {
                toast.error(result.mensagem || "Erro ao salvar configurações.");
                return;
            }

            toast.success("Configurações salvas com sucesso!");
            setSuccess("Configurações salvas com sucesso.");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Erro ao salvar configurações:", err);
            toast.error("Erro inesperado ao salvar configurações.");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {

        setSettings({
            systemName: "AMTK Monitoring",
            description: "Sistema de monitoramento de subestações",
            collectionInterval: 5,
            connectionTimeout: 5,
            retryAttempts: 3,
            telemetryInterval: 5,
            telemetryRetention: 90,
            eventRetention: 180,
            agentTimeout: 10,
            apiTimeout: 10,
            timezone: "America/Sao_Paulo",
            language: "pt-BR",
            sessionTimeout: 60,
            maintenanceMode: false
        });

        setSuccess("Configurações padrão restauradas no formulário. Clique em Salvar para persistir.");
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <LayoutAdmin>
            <Toaster position="top-right" />

            <div className="container-fluid py-4">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="mb-1">
                            Configurações do Sistema
                        </h2>

                        <div className="text-muted">
                            Parâmetros gerais de operação do AMTK Monitoring
                        </div>

                    </div>

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleReset}
                        >

                            <Icon
                                path={mdiRefresh}
                                size={0.8}
                                className="me-1"
                            />

                            Restaurar padrão

                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving || loading}
                        >

                            <Icon
                                path={mdiContentSaveOutline}
                                size={0.8}
                                className="me-1"
                            />

                            {saving
                                ? "Salvando..."
                                : "Salvar configurações"
                            }

                        </button>

                    </div>

                </div>

                {/* ERRO */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
                        <div>{error}</div>
                    </div>
                )}

                {/* SUCESSO */}
                {success && (
                    <div className="alert alert-success d-flex align-items-center mb-4">
                        <Icon path={mdiContentSaveOutline} size={1} className="me-2" />
                        <div>{success}</div>
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="alert alert-info d-flex align-items-center mb-4">
                        <Icon path={mdiLoading} size={1} spin className="me-2" />
                        <div>Carregando configurações...</div>
                    </div>
                )}

                <div className="alert alert-secondary small mb-4">
                    Os parâmetros desta tela são configurações cadastradas do sistema. A aplicação operacional de cada parâmetro depende do módulo correspondente.
                </div>

                {/* =====================================================
                    SISTEMA
                ====================================================== */}

                <div className="row g-4">

                    <div className="col-12 col-xl-8">

                        {/* IDENTIFICAÇÃO */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiCogOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div>

                                        <div className="fw-semibold">
                                            Identificação
                                        </div>

                                        <div className="text-muted small">
                                            Informações básicas do sistema
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card-body">

                                <div className="row g-3">

                                    <div className="col-12">

                                        <label className="form-label">
                                            Nome do sistema
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={settings.systemName}
                                            onChange={(e) =>
                                                handleChange(
                                                    "systemName",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="col-12">

                                        <label className="form-label">
                                            Descrição
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={settings.description}
                                            onChange={(e) =>
                                                handleChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* COLETA */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiServerNetwork}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div>

                                        <div className="fw-semibold">
                                            Coleta de dados
                                        </div>

                                        <div className="text-muted small">
                                            Parâmetros cadastrados para coleta
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card-body">

                                <div className="row g-3">

                                    <div className="col-12 col-md-4">

                                        <label className="form-label">
                                            Intervalo de coleta (configurado)
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={
                                                    settings.collectionInterval
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "collectionInterval",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                segundos
                                            </span>

                                        </div>

                                    </div>


                                    <div className="col-12 col-md-4">

                                        <label className="form-label">
                                            Timeout de conexão (configurado)
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={
                                                    settings.connectionTimeout
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "connectionTimeout",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                segundos
                                            </span>

                                        </div>

                                    </div>


                                    <div className="col-12 col-md-4">

                                        <label className="form-label">
                                            Tentativas
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                value={
                                                    settings.retryAttempts
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "retryAttempts",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                tentativas
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* TELEMETRIA */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiChartLine}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div>

                                        <div className="fw-semibold">
                                            Telemetria
                                        </div>

                                        <div className="text-muted small">
                                            Parâmetros cadastrados de coleta e retenção
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card-body">

                                <div className="row g-3">

                                    <div className="col-12 col-md-6">

                                        <label className="form-label">
                                            Intervalo de telemetria
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={
                                                    settings.telemetryInterval
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "telemetryInterval",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                segundos
                                            </span>

                                        </div>

                                    </div>


                                    <div className="col-12 col-md-6">

                                        <label className="form-label">
                                            Retenção de telemetria
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={
                                                    settings.telemetryRetention
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "telemetryRetention",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                dias
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* EVENTOS */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiAlertCircleOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div>

                                        <div className="fw-semibold">
                                            Eventos
                                        </div>

                                        <div className="text-muted small">
                                            Parâmetro cadastrado de retenção de eventos
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card-body">

                                <label className="form-label">
                                    Retenção de eventos
                                </label>

                                <div className="input-group">

                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        value={settings.eventRetention}
                                        onChange={(e) =>
                                            handleChange(
                                                "eventRetention",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                    <span className="input-group-text">
                                        dias
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* COMUNICAÇÃO */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiAccessPoint}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div>

                                        <div className="fw-semibold">
                                            Comunicação
                                        </div>

                                        <div className="text-muted small">
                                            Parâmetros cadastrados de comunicação
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="card-body">

                                <div className="row g-3">

                                    <div className="col-12 col-md-6">

                                        <label className="form-label">
                                            Timeout do Agent (configurado)
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={settings.agentTimeout}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "agentTimeout",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                segundos
                                            </span>

                                        </div>

                                    </div>


                                    <div className="col-12 col-md-6">

                                        <label className="form-label">
                                            Timeout da API (configurado)
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                value={settings.apiTimeout}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "apiTimeout",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <span className="input-group-text">
                                                segundos
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        COLUNA DIREITA
                    ================================================== */}

                    <div className="col-12 col-xl-4">


                        {/* REGIONAL */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiClockOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div className="fw-semibold">
                                        Regionalização
                                    </div>

                                </div>

                            </div>


                            <div className="card-body">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Fuso horário
                                    </label>

                                    <select
                                        className="form-select"
                                        value={settings.timezone}
                                        onChange={(e) =>
                                            handleChange(
                                                "timezone",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="America/Sao_Paulo">
                                            Brasília
                                        </option>

                                        <option value="America/New_York">
                                            Nova York
                                        </option>

                                        <option value="America/Chicago">
                                            Chicago
                                        </option>

                                        <option value="UTC">
                                            UTC
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="form-label">
                                        Idioma
                                    </label>

                                    <select
                                        className="form-select"
                                        value={settings.language}
                                        onChange={(e) =>
                                            handleChange(
                                                "language",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="pt-BR">
                                            Português (Brasil)
                                        </option>

                                        <option value="en-US">
                                            English
                                        </option>

                                        <option value="es-ES">
                                            Español
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* SEGURANÇA */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiShieldCheckOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div className="fw-semibold">
                                        Segurança
                                    </div>

                                </div>

                            </div>


                            <div className="card-body">

                                <label className="form-label">
                                    Timeout da sessão
                                </label>

                                <div className="input-group">

                                    <input
                                        type="number"
                                        className="form-control"
                                        min="5"
                                        value={settings.sessionTimeout}
                                        onChange={(e) =>
                                            handleChange(
                                                "sessionTimeout",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                    <span className="input-group-text">
                                        minutos
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* MODO MANUTENÇÃO */}

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiInformationOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div className="fw-semibold">
                                        Operação
                                    </div>

                                </div>

                            </div>


                            <div className="card-body">

                                <div className="form-check form-switch">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="maintenance-mode"
                                        checked={
                                            settings.maintenanceMode
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "maintenanceMode",
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="maintenance-mode"
                                    >
                                        Modo manutenção
                                    </label>

                                </div>

                                <div className="small text-muted mt-2">

                                    Quando ativado, o sistema poderá
                                    restringir operações de monitoramento.

                                </div>

                            </div>

                        </div>


                        {/* INFORMAÇÕES */}

                        <div className="card border-0 shadow-sm">

                            <div className="card-header bg-white border-0 py-3">

                                <div className="d-flex align-items-center">

                                    <Icon
                                        path={mdiInformationOutline}
                                        size={1}
                                        className="text-primary me-2"
                                    />

                                    <div className="fw-semibold">
                                        Informações da interface
                                    </div>

                                </div>

                                <div className="small text-muted mt-3">
                                    Informações da versão da interface e da configuração atual.
                                </div>

                            </div>


                            <div className="card-body">

                                <div className="d-flex justify-content-between mb-2">

                                    <span className="text-muted">
                                        Sistema
                                    </span>

                                    <span className="fw-semibold">
                                        AMTK Monitoring
                                    </span>

                                </div>


                                <div className="d-flex justify-content-between mb-2">

                                    <span className="text-muted">
                                        Versão
                                    </span>

                                    <span className="fw-semibold">
                                        1.0.0
                                    </span>

                                </div>


                                <div className="d-flex justify-content-between">

                                    <span className="text-muted">
                                        Ambiente
                                    </span>

                                    <span className="badge bg-label-primary">
                                        Homologação
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </LayoutAdmin>
    );
}
