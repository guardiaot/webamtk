import React, { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@mdi/react";
import toast, { Toaster } from "react-hot-toast";
import {
  mdiRobotOutline,
  mdiPlus,
  mdiPencilOutline,
  mdiDeleteOutline,
  mdiConnection,
  mdiMagnify,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiAlertCircleOutline,
  mdiInformationOutline,
  mdiRefresh,
  mdiLoading,
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";

export default function Agents() {
  /*
   * ============================================================
   * ESTADOS
   * ============================================================
   */
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    host: "",
    port: "8081",
    description: "",
    version: "1.0.0",
    enabled: true,
  });

  /*
   * ============================================================
   * CARREGAR AGENTS
   * ============================================================
   */
  const carregarAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("per_page", "100");

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(`/api/v1/agents?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        toast.error(`Erro HTTP ${response.status} ao carregar agents`);
        return;
      }

      const result = await response.json();
      const payload = result?.data || result || {};

      setAgents(
        Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [],
      );
    } catch (err) {
      console.error("Erro ao carregar agents:", err);
      toast.error("Erro inesperado ao carregar agents.");
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  /*
   * ============================================================
   * PRIMEIRA CARGA
   * ============================================================
   */
  useEffect(() => {
    carregarAgents();
  }, [carregarAgents]);

  /*
   * ============================================================
   * FILTROS
   * ============================================================
   */
  const filteredAgents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return agents.filter((agent) => {
      if (statusFilter && agent.status !== statusFilter) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        (agent.id || "").toLowerCase().includes(term) ||
        (agent.name || "").toLowerCase().includes(term) ||
        (agent.version || "").toLowerCase().includes(term)
      );
    });
  }, [agents, search, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: agents.length,
      online: agents.filter((agent) => agent.status === "online").length,
      offline: agents.filter((agent) => agent.status === "offline").length,
      error: agents.filter((agent) => agent.status === "error").length,
    };
  }, [agents]);

  /*
   * ============================================================
   * FORMULÁRIO
   * ============================================================
   */
  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      host: "",
      port: "8081",
      description: "",
      version: "1.0.0",
      enabled: true,
    });
    setEditingAgent(null);
  };

  const openNew = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (agent) => {
    setEditingAgent(agent);
    setForm({
      id: agent.id,
      name: agent.name || "",
      host: agent.host || "",
      port: String(agent.port || 8081),
      description: agent.description || "",
      version: agent.version || "1.0.0",
      enabled: agent.status !== "offline",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
   * ============================================================
   * SALVAR (criar ou atualizar)
   * ============================================================
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingAgent) {
        /* ATUALIZAR */
        const response = await fetch(
          `/api/v1/agents/${editingAgent.id}/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({
              name: form.name,
              version: form.version,
            }),
          },
        );

        if (!response.ok) {
          toast.error(`Erro HTTP ${response.status}`);
          return;
        }

        const result = await response.json();
        if (result.erro === 1) {
          toast.error(result.mensagem || "Erro ao atualizar Agent.");
          return;
        }
      } else {
        /* CRIAR */
        const response = await fetch("/api/v1/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            id: form.id,
            name: form.name,
            version: form.version,
          }),
        });

        if (!response.ok) {
          toast.error(`Erro HTTP ${response.status}`);
          return;
        }

        const result = await response.json();
        if (result.erro === 1) {
          toast.error(result.mensagem || "Erro ao cadastrar Agent.");
          return;
        }
      }

      toast.success(
        editingAgent
          ? "Agent atualizado com sucesso!"
          : "Agent cadastrado com sucesso!",
      );
      closeModal();
      carregarAgents();
    } catch (err) {
      console.error("Erro ao salvar agent:", err);
      toast.error("Erro inesperado ao salvar agent.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * EXCLUIR
   * ============================================================
   */
  const handleDelete = async (agent) => {
    if (!window.confirm(`Deseja realmente remover o Agent "${agent.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/agents/${agent.id}/delete`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        toast.error(`Erro HTTP ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.erro === 1) {
        toast.error(result.mensagem || "Erro ao excluir Agent.");
        return;
      }

      toast.success("Agent excluído com sucesso!");
      carregarAgents();
    } catch (err) {
      console.error("Erro ao excluir agent:", err);
      toast.error("Erro inesperado ao excluir agent.");
    }
  };

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */
  const getStatus = (status) => {
    switch (status) {
      case "online":
        return {
          label: "Online",
          className: "bg-success",
          icon: mdiCheckCircleOutline,
        };
      case "offline":
        return {
          label: "Offline",
          className: "bg-secondary",
          icon: mdiCloseCircleOutline,
        };
      case "error":
        return {
          label: "Erro",
          className: "bg-danger",
          icon: mdiAlertCircleOutline,
        };
      default:
        return {
          label: "Desconhecido",
          className: "bg-warning text-dark",
          icon: mdiInformationOutline,
        };
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <LayoutAdmin>
      <Toaster position="top-right" />
      <div className="container-fluid py-4">
        {/* =================================================
                    HEADER
                ================================================== */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Agents</h2>
            <div className="text-muted">
              Configuração dos agentes de monitoramento
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={carregarAgents}
              disabled={loading}
            >
              <Icon path={mdiRefresh} size={0.8} className="me-1" />
              Atualizar
            </button>
            <button type="button" className="btn btn-primary" onClick={openNew}>
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo Agent
            </button>
          </div>
        </div>
        {/* =================================================
                    ERRO
                ================================================== */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <Icon path={mdiAlertCircleOutline} size={1} className="me-2" />
            <div>{error}</div>
          </div>
        )}
        {/* =================================================
                    RESUMO
                ================================================== */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div
              className="card border-0 shadow-sm"
              style={{ borderLeft: "4px solid #0d6efd" }}
            >
              <div className="card-body">
                <div className="text-muted small mb-1">Total de Agents</div>
                <div className="fs-3 fw-bold">{summary.total}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div
              className="card border-0 shadow-sm"
              style={{ borderLeft: "4px solid #198754" }}
            >
              <div className="card-body">
                <div className="text-muted small mb-1">Online</div>
                <div className="fs-3 fw-bold text-success">
                  {summary.online}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div
              className="card border-0 shadow-sm"
              style={{ borderLeft: "4px solid #6c757d" }}
            >
              <div className="card-body">
                <div className="text-muted small mb-1">Offline</div>
                <div className="fs-3 fw-bold text-secondary">
                  {summary.offline}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div
              className="card border-0 shadow-sm"
              style={{ borderLeft: "4px solid #dc3545" }}
            >
              <div className="card-body">
                <div className="text-muted small mb-1">Erro</div>
                <div className="fs-3 fw-bold text-danger">{summary.error}</div>
              </div>
            </div>
          </div>
        </div>
        {/* =================================================
                    FILTROS
                ================================================== */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-lg-8">
                <label className="form-label">Pesquisar</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Icon path={mdiMagnify} size={0.8} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome, ID ou versão..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="error">Erro</option>
                </select>
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
                <div className="fw-semibold">Agents cadastrados</div>
                <div className="text-muted small">
                  {filteredAgents.length} agents encontrados
                </div>
              </div>
              <Icon
                path={mdiRobotOutline}
                size={1.1}
                className="text-primary"
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Versão</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Icon path={mdiLoading} size={1} spin />
                      <div className="mt-2 text-muted">
                        Carregando agents...
                      </div>
                    </td>
                  </tr>
                ) : filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <Icon
                        path={mdiRobotOutline}
                        size={1.8}
                        className="mb-2"
                      />
                      <div>Nenhum Agent encontrado</div>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => {
                    const status = getStatus(agent.status);
                    const createdAt = agent.created_at
                      ? new Date(agent.created_at).toLocaleDateString("pt-BR")
                      : "—";
                    return (
                      <tr key={agent.id}>
                        <td>
                          <div className="fw-semibold">{agent.name}</div>
                          <div className="small text-muted">{agent.id}</div>
                        </td>
                        <td>
                          <span className="badge bg-label-primary">
                            v{agent.version || "1.0.0"}
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
                        <td>{createdAt}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              title="Editar"
                              onClick={() => openEdit(agent)}
                            >
                              <Icon path={mdiPencilOutline} size={0.8} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Excluir"
                              onClick={() => handleDelete(agent)}
                            >
                              <Icon path={mdiDeleteOutline} size={0.8} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* =================================================
                    MODAL
                ================================================== */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingAgent ? "Editar Agent" : "Novo Agent"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                      disabled={saving}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      {!editingAgent && (
                        <div className="col-12 col-md-6">
                          <label className="form-label">ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.id}
                            onChange={(e) => handleChange("id", e.target.value)}
                            placeholder="Ex.: agent-001"
                            required
                          />
                        </div>
                      )}
                      <div className="col-12 col-md-6">
                        <label className="form-label">Nome</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Ex.: Agent Subestação 01"
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Versão</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.version}
                          onChange={(e) =>
                            handleChange("version", e.target.value)
                          }
                          placeholder="Ex.: 1.0.0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={closeModal}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Icon
                            path={mdiLoading}
                            size={0.75}
                            spin
                            className="me-1"
                          />
                          Salvando...
                        </>
                      ) : editingAgent ? (
                        "Salvar alterações"
                      ) : (
                        "Cadastrar Agent"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}
