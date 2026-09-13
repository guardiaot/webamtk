import React, { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@mdi/react";
import toast, { Toaster } from "react-hot-toast";
import {
  mdiServerNetwork,
  mdiPlus,
  mdiPencilOutline,
  mdiDeleteOutline,
  mdiConnection,
  mdiRefresh,
  mdiMagnify,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiAlertCircleOutline,
  mdiInformationOutline,
  mdiLoading,
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

export default function IEDs() {
  /*
   * ============================================================
   * ESTADOS
   * ============================================================
   */
  const [ieds, setIeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIed, setEditingIed] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    manufacturer: "",
    model: "",
    host: "",
    port: "102",
    description: "",
    ied_template_id: "",
    driver_override_id: "",
    enabled: true,
  });

  /*
   * ============================================================
   * CARREGAR IEDS
   * ============================================================
   */
  const carregarIeds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("per_page", "100");

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(`/api/v1/ieds?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        toast.error(`Erro HTTP ${response.status} ao carregar IEDs`);
        return;
      }

      const result = await response.json();
      const payload = result?.data || result || {};

      setIeds(
        Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [],
      );
    } catch (err) {
      console.error("Erro ao carregar IEDs:", err);
      toast.error("Erro inesperado ao carregar IEDs.");
      setError(err.message || "Erro ao carregar IEDs.");
      setIeds([]);
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
    carregarIeds();
  }, [carregarIeds]);

  /*
   * ============================================================
   * FILTROS
   * ============================================================
   */
  const filteredIeds = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ieds.filter((ied) => {
      if (statusFilter && ied.status !== statusFilter) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        (ied.id || "").toLowerCase().includes(term) ||
        (ied.name || "").toLowerCase().includes(term) ||
        (ied.manufacturer || "").toLowerCase().includes(term) ||
        (ied.model || "").toLowerCase().includes(term) ||
        (ied.host || "").toLowerCase().includes(term)
      );
    });
  }, [ieds, search, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: ieds.length,
      online: ieds.filter(
        (ied) => ied.status === "online" || ied.status === "active",
      ).length,
      offline: ieds.filter((ied) => ied.status === "offline").length,
      error: ieds.filter((ied) => ied.status === "error").length,
    };
  }, [ieds]);

  /*
   * ============================================================
   * FORMULÁRIO
   * ============================================================
   */
  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      manufacturer: "",
      model: "",
      host: "",
      port: "102",
      description: "",
      ied_template_id: "",
      driver_override_id: "",
      enabled: true,
    });
    setEditingIed(null);
  };

  const openNew = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (ied) => {
    setEditingIed(ied);
    setForm({
      id: ied.code || ied.id,
      name: ied.name || "",
      manufacturer: ied.manufacturer || "",
      model: ied.model || "",
      host: ied.host || "",
      port: String(ied.port || 102),
      description: ied.description || "",
      ied_template_id: String(ied.ied_template_id || ""),
      driver_override_id: String(ied.driver_override_id || ""),
      enabled: ied.status !== "offline",
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
      if (editingIed) {
        /* ATUALIZAR */
        const response = await fetch(`/api/v1/ieds/${editingIed.id}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            code: form.id,
            name: form.name,
            manufacturer: form.manufacturer,
            model: form.model,
            host: form.host,
            port: Number(form.port),
            ied_template_id: form.ied_template_id || null,
            driver_override_id: form.driver_override_id || null,
          }),
        });

        if (!response.ok) {
          toast.error(`Erro HTTP ${response.status}`);
          return;
        }

        const result = await response.json();
        if (result.erro === 1) {
          toast.error(result.mensagem || "Erro ao atualizar IED.");
          return;
        }
      } else {
        /* CRIAR */
        const response = await fetch("/api/v1/ieds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            code: form.id,
            name: form.name,
            manufacturer: form.manufacturer,
            model: form.model,
            host: form.host,
            port: Number(form.port),
            ied_template_id: form.ied_template_id || null,
            driver_override_id: form.driver_override_id || null,
            source: "manual",
          }),
        });

        if (!response.ok) {
          toast.error(`Erro HTTP ${response.status}`);
          return;
        }

        const result = await response.json();
        if (result.erro === 1) {
          toast.error(result.mensagem || "Erro ao cadastrar IED.");
          return;
        }
      }

      toast.success(
        editingIed
          ? "IED atualizado com sucesso!"
          : "IED cadastrado com sucesso!",
      );
      closeModal();
      carregarIeds();
    } catch (err) {
      console.error("Erro ao salvar IED:", err);
      toast.error("Erro inesperado ao salvar IED.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * EXCLUIR
   * ============================================================
   */
  const handleDelete = async (ied) => {
    if (!window.confirm(`Deseja realmente remover o IED "${ied.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/ieds/${ied.id}/delete`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        // throw new Error(`HTTP ${response.status}`);
        toast.error(`HTTP ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.erro === 1) {
        // throw new Error(result.mensagem);
        toast.error(`HTTP ${response.status}`);
        return;
      }

      toast.success("IED excluído com sucesso!");
      carregarIeds();
    } catch (err) {
      console.error("Erro ao excluir IED:", err);
      toast.error(err.message || "Erro ao excluir IED.");
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
      case "active":
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

  const formatResponseTime = (value) => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      return "—";
    }
    return `${Number(value).toFixed(1)} μs`;
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
            <h2 className="mb-1">IEDs</h2>
            <div className="text-muted">
              Configuração dos Intelligent Electronic Devices
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={carregarIeds}
              disabled={loading}
            >
              <Icon path={mdiRefresh} size={0.8} className="me-1" />
              Atualizar
            </button>
            <button type="button" className="btn btn-primary" onClick={openNew}>
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo IED
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
                <div className="text-muted small mb-1">Total de IEDs</div>
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
                    placeholder="Nome, fabricante, modelo, IP ou ID..."
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
                <div className="fw-semibold">IEDs cadastrados</div>
                <div className="text-muted small">
                  {filteredIeds.length} equipamentos encontrados
                </div>
              </div>
              <Icon
                path={mdiServerNetwork}
                size={1.1}
                className="text-primary"
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>IED</th>
                  <th>Fabricante / Modelo</th>
                  <th>Template</th>
                  <th>Driver</th>
                  <th>Endereço</th>
                  <th>Status</th>
                  <th>Última verificação</th>
                  <th>Resposta</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <Icon path={mdiLoading} size={1} spin />
                      <div className="mt-2 text-muted">Carregando IEDs...</div>
                    </td>
                  </tr>
                ) : filteredIeds.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-5">
                      <Icon
                        path={mdiServerNetwork}
                        size={1.8}
                        className="mb-2"
                      />
                      <div>Nenhum IED encontrado</div>
                    </td>
                  </tr>
                ) : (
                  filteredIeds.map((ied) => {
                    const status = getStatus(ied.status);
                    return (
                      <tr key={ied.id}>
                        <td>
                          <div className="fw-semibold">{ied.name}</div>
                          <div className="small text-muted">{ied.id}</div>
                        </td>
                        <td>
                          <div className="fw-semibold">{ied.manufacturer}</div>
                          <div className="small text-muted">{ied.model}</div>
                        </td>
                        <td>{ied.ied_template_name || "-"}</td>
                        <td>
                          {ied.effective_driver_name || "-"}
                          {ied.effective_driver_source === "override" && (
                            <div className="small text-muted">(override)</div>
                          )}
                        </td>
                        <td>
                          <div>{ied.host}</div>
                          <div className="small text-muted">
                            Porta {ied.port}
                          </div>
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
                        <td>{ied.last_check || "—"}</td>
                        <td>{formatResponseTime(ied.response_time_us)}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              title="Editar"
                              onClick={() => openEdit(ied)}
                            >
                              <Icon path={mdiPencilOutline} size={0.8} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Excluir"
                              onClick={() => handleDelete(ied)}
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
                      {editingIed ? "Editar IED" : "Novo IED"}
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
                      {!editingIed && (
                        <div className="col-12 col-md-6">
                          <label className="form-label">ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.id}
                            onChange={(e) => handleChange("id", e.target.value)}
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
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Fabricante</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.manufacturer}
                          onChange={(e) =>
                            handleChange("manufacturer", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Modelo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.model}
                          onChange={(e) =>
                            handleChange("model", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Template de IED</label>
                        <AjaxSumoSelect
                          url="/api/v1/ied-templates/simples"
                          params={
                            form.ied_template_id
                              ? { include_id: form.ied_template_id }
                              : {}
                          }
                          value={form.ied_template_id}
                          onChange={(e) =>
                            handleChange("ied_template_id", e.value || "")
                          }
                          valueField="id"
                          labelField="name"
                          placeholder="Selecione o Template de IED"
                        />
                        <div className="form-text">
                          Opcional. Define o perfil padrÃ£o do equipamento.
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          Driver de Coleta (override)
                        </label>
                        <AjaxSumoSelect
                          url="/api/v1/collection-drivers/simples"
                          params={
                            form.driver_override_id
                              ? { include_id: form.driver_override_id }
                              : {}
                          }
                          value={form.driver_override_id}
                          onChange={(e) =>
                            handleChange("driver_override_id", e.value || "")
                          }
                          valueField="id"
                          labelField="name"
                          placeholder="Usar Driver padrão do Template"
                        />
                        <div className="form-text">
                          Opcional. Se não informado, será utilizado o Driver
                          padrão definido no Template de IED.
                        </div>
                        {editingIed && (
                          <div className="small text-muted mt-2">
                            Driver efetivo:{" "}
                            {editingIed.effective_driver_name || "não definido"}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-8">
                        <label className="form-label">Host / IP</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ex.: 192.168.1.100"
                          value={form.host}
                          onChange={(e) => handleChange("host", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label">Porta MMS</label>
                        <input
                          type="number"
                          className="form-control"
                          value={form.port}
                          onChange={(e) => handleChange("port", e.target.value)}
                          min="1"
                          max="65535"
                          required
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
                      ) : editingIed ? (
                        "Salvar alterações"
                      ) : (
                        "Cadastrar IED"
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
