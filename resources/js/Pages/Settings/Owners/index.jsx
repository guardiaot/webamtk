import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import toast, { Toaster } from "react-hot-toast";
import {
  mdiAccountTieOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiMagnify,
  mdiPencilOutline,
  mdiPlus,
  mdiRefresh,
  mdiLoading,
  mdiToggleSwitchOutline,
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";
import OwnerOffcanvas from "./OwnerOffcanvas";

export default function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enabledFilter, setEnabledFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    ativos: 0,
    inativos: 0,
  });
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const statusConfirmationRef = useRef(null);

  const carregarOwners = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        per_page: "20",
      });
      if (search.trim()) params.append("search", search.trim());
      if (enabledFilter !== "") params.append("enabled", enabledFilter);

      const response = await fetch(`/api/v1/owners?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok)
        throw new Error(
          `Erro HTTP ${response.status} ao carregar proprietários.`,
        );

      const result = await response.json();
      const payload = result?.data || result || {};
      setOwners(Array.isArray(payload.data) ? payload.data : []);
      setPagination({
        current_page: payload.current_page || page,
        last_page: payload.last_page || 1,
        total: payload.total || 0,
        from: payload.from || 0,
        to: payload.to || 0,
        ativos: payload.ativos || 0,
        inativos: payload.inativos || 0,
      });
    } catch (error) {
      toast.error(
        error.message || "Erro inesperado ao carregar proprietários.",
      );
      setOwners([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, enabledFilter]);

  useEffect(() => {
    carregarOwners();
  }, [carregarOwners]);
  useEffect(() => {
    setPage(1);
  }, [search, enabledFilter]);

  const openNew = () => {
    setEditingOwner(null);
    setShowOffcanvas(true);
  };
  const openEdit = (owner) => {
    setEditingOwner(owner);
    setShowOffcanvas(true);
  };
  const closeOffcanvas = () => {
    setShowOffcanvas(false);
    setEditingOwner(null);
  };

  const confirmarAlteracaoStatus = (owner) => {
    if (statusConfirmationRef.current || statusUpdating !== null) return;

    const enabled = !Boolean(owner.enabled);
    const action = enabled ? "ativar" : "desativar";

    const executarAlteracaoStatus = async (toastId) => {
      toast.dismiss(toastId);
      statusConfirmationRef.current = null;
      setStatusUpdating(owner.id);

      try {
        const response = await fetch(`/api/v1/owners/${owner.id}/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ enabled }),
        });
        if (!response.ok)
          throw new Error(`Erro HTTP ${response.status} ao alterar status.`);
        const result = await response.json();
        if (result.erro === 1)
          throw new Error(
            result.mensagem || "Não foi possível alterar o status.",
          );
        toast.success(result.mensagem || "Status atualizado com sucesso.");
        carregarOwners();
      } catch (error) {
        toast.error(error.message || "Erro inesperado ao alterar status.");
      } finally {
        setStatusUpdating(null);
      }
    };

    statusConfirmationRef.current = toast.custom(
      (t) => (
        <div
          className="bg-white border rounded shadow p-3"
          style={{ minWidth: "320px", maxWidth: "420px" }}
        >
          <div className="fw-semibold mb-1">
            {enabled ? "Ativar proprietário?" : "Desativar proprietário?"}
          </div>
          <div className="text-muted small mb-3">
            <strong className="text-body">{owner.name}</strong> será{" "}
            {enabled ? "ativado" : "desativado"}.
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                toast.dismiss(t.id);
                statusConfirmationRef.current = null;
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`btn btn-sm ${enabled ? "btn-success" : "btn-danger"}`}
              onClick={() => executarAlteracaoStatus(t.id)}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  const pages = Array.from(
    { length: pagination.last_page },
    (_, index) => index + 1,
  ).slice(Math.max(0, page - 3), page + 2);

  return (
    <LayoutAdmin>
      <Toaster position="top-right" />
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Proprietários</h2>
            <div className="text-muted">
              Cadastro de proprietários da infraestrutura monitorada
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={carregarOwners}
              disabled={loading}
            >
              <Icon path={mdiRefresh} size={0.8} className="me-1" /> Atualizar
            </button>
            <button className="btn btn-primary" onClick={openNew}>
              <Icon path={mdiPlus} size={0.8} className="me-1" /> Novo
              Proprietário
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Total</div>
                <div className="fs-3 fw-bold text-primary">
                  {pagination.total}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Ativos</div>
                <div className="fs-3 fw-bold text-success">
                  {pagination.ativos}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Inativos</div>
                <div className="fs-3 fw-bold text-secondary">
                  {pagination.inativos}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    className="form-control"
                    placeholder="Nome, nome ONS ou pasta FTP ONS..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={enabledFilter}
                  onChange={(event) => setEnabledFilter(event.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="true">Ativos</option>
                  <option value="false">Inativos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <div className="fw-semibold">Proprietários cadastrados</div>
            <div className="text-muted small">
              {pagination.total} registros encontrados
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Proprietário</th>
                  <th>Nome ONS</th>
                  <th>Pasta FTP ONS</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Icon path={mdiLoading} size={1} spin />
                      <div className="mt-2 text-muted">
                        Carregando proprietários...
                      </div>
                    </td>
                  </tr>
                ) : owners.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <Icon path={mdiAccountTieOutline} size={1.8} />
                      <div>Nenhum proprietário encontrado</div>
                    </td>
                  </tr>
                ) : (
                  owners.map((owner) => (
                    <tr key={owner.id}>
                      <td>
                        <div className="fw-semibold">{owner.name}</div>
                        <div className="small text-muted">ID #{owner.id}</div>
                      </td>
                      <td>{owner.ons_name || "—"}</td>
                      <td>{owner.ons_ftp_folder || "—"}</td>
                      <td>
                        <span
                          className={`badge ${owner.enabled ? "bg-success" : "bg-secondary"} d-flex align-items-center gap-1`}
                        >
                          <Icon
                            path={
                              owner.enabled
                                ? mdiCheckCircleOutline
                                : mdiCloseCircleOutline
                            }
                            size={0.65}
                            className="me-1"
                          />
                          {owner.enabled ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>
                        {owner.created_at
                          ? new Date(owner.created_at).toLocaleDateString(
                              "pt-BR",
                            )
                          : "—"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Editar"
                            onClick={() => openEdit(owner)}
                          >
                            <Icon path={mdiPencilOutline} size={0.8} />
                          </button>
                          <button
                            className={`btn btn-sm ${owner.enabled ? "btn-outline-secondary" : "btn-outline-success"}`}
                            title={owner.enabled ? "Desativar" : "Ativar"}
                            disabled={statusUpdating === owner.id}
                            onClick={() => confirmarAlteracaoStatus(owner)}
                          >
                            <Icon path={mdiToggleSwitchOutline} size={0.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination.last_page > 1 && (
            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Exibindo {pagination.from} até {pagination.to} de{" "}
                {pagination.total}
              </small>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    ‹
                  </button>
                </li>
                {pages.map((number) => (
                  <li
                    className={`page-item ${number === page ? "active" : ""}`}
                    key={number}
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
                  className={`page-item ${page >= pagination.last_page ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    disabled={page >= pagination.last_page}
                    onClick={() => setPage(page + 1)}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <OwnerOffcanvas
        show={showOffcanvas}
        owner={editingOwner}
        onHide={closeOffcanvas}
        onSaved={carregarOwners}
      />
    </LayoutAdmin>
  );
}
