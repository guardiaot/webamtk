import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiAccountPlusOutline,
  mdiLockReset,
  mdiPencilOutline,
  mdiToggleSwitchOutline,
  mdiEyeOutline,
} from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import UserOffcanvas from "./UserOffcanvas";

export default function Users() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({ enabled: "" });
  const [roles, setRoles] = useState([]);

  const canManage = (user.permissions || []).includes("users.manage");
  const openEdit = (user) => {
    setEditing(user);
    setShow(true);
  };

  useEffect(() => {
    fetch("/api/v1/roles/simples", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => setRoles(Array.isArray(result.data) ? result.data : []))
      .catch(() => setRoles([]));
  }, []);

  const refresh = () => table.current?.refresh();
  const save = () => {
    setShow(false);
    setEditing(null);
    refresh();
  };

  const changeStatus = (row) => {
    if (confirmation.current) return;
    const enabled = !Boolean(row.enabled);
    const action = enabled ? "Ativar" : "Desativar";
    confirmation.current = toast.custom(
      (t) => (
        <div
          className="bg-white border rounded shadow p-3"
          style={{ minWidth: 320 }}
        >
          <div className="fw-semibold mb-1">{action} usuário?</div>
          <div className="text-muted small mb-3">
            <strong className="text-body">{row.name}</strong> será{" "}
            {enabled ? "ativado" : "desativado"}.
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                toast.dismiss(t.id);
                confirmation.current = null;
              }}
            >
              Cancelar
            </button>
            <button
              className={`btn btn-sm ${enabled ? "btn-success" : "btn-danger"}`}
              onClick={async () => {
                toast.dismiss(t.id);
                confirmation.current = null;
                try {
                  const r = await fetch(`/api/v1/users/${row.id}/status`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({ enabled }),
                  });
                  const j = await r.json();
                  const p = j.data || j;
                  if (!r.ok || p.erro === 1) throw new Error(p.mensagem);
                  toast.success(p.mensagem);
                  refresh();
                } catch (e) {
                  toast.error(e.message || "Erro ao alterar status.");
                }
              }}
            >
              {action}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  };

  const columns = [
    {
      label: "Nome",
      field: "name",
      render: (_, row) => (
        <>
          <div className="fw-semibold">{row.name}</div>
          <small className="text-muted">ID #{row.id}</small>
        </>
      ),
    },
    {
      label: "E-mail",
      field: "email",
    },
    {
      label: "Perfil",
      field: "role_names",
      sortable: false,
      render: (_, row) => (row.role_names || []).join(", ") || "—",
    },
    {
      label: "Status",
      field: "enabled",
      sortable: false,
      render: (_, row) => (
        <span
          className={`badge ${row.enabled ? "bg-success" : "bg-secondary"}`}
        >
          {row.enabled ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      label: "Último acesso",
      field: "last_login_at",
      render: (value) =>
        value ? new Date(value).toLocaleString("pt-BR") : "Nunca acessou",
    },
    {
      label: "Ação",
      field: "id",
      render: (value, row) => (
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Editar"
            onClick={() => openEdit(row)}
          >
            <Icon path={mdiPencilOutline} size={0.75} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-warning"
            title="Alterar senha"
            onClick={() => openEdit(row)}
          >
            <Icon path={mdiLockReset} size={0.75} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            title="Ativar / Desativar"
            onClick={() => changeStatus(row)}
          >
            <Icon path={mdiToggleSwitchOutline} size={0.75} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <LayoutAdmin>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Usuários</h2>
            <div className="text-muted">
              Gestão de usuários e perfis de acesso
            </div>
          </div>
          {canManage && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditing(null);
                setShow(true);
              }}
            >
              <Icon path={mdiAccountPlusOutline} size={0.8} className="me-1" />
              Novo usuário
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Usuários cadastrados"
          ajax="/api/v1/users"
          columns={columns}
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((current) => ({
              ...current,
              [key]: value,
            }))
          }
          filterOptions={{
            enabled: [
              {
                value: "true",
                label: "Ativos",
              },
              {
                value: "false",
                label: "Inativos",
              },
            ],
            role: roles.map((role) => ({
              value: role.slug,
              label: role.name,
            })),
          }}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <UserOffcanvas
          show={show}
          user={editing}
          onHide={() => {
            setShow(false);
            setEditing(null);
          }}
          onSaved={save}
        />
      </div>
    </LayoutAdmin>
  );
}
