import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiPlus, mdiToggleSwitchOutline } from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import InstallationOffcanvas from "./InstallationOffcanvas";

export default function Installations() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [owners, setOwners] = useState([]);
  const [regionals, setRegionals] = useState([]);
  const [filters, setFilters] = useState({
    owner_id: "",
    regional_id: "",
    state_id: "",
    enabled: "",
  });
  const [states, setStates] = useState([]);
  const [installation, setInstallation] = useState(null);
  const [show, setShow] = useState(false);
  const canManage = (user.permissions || []).includes("installations.manage");

  useEffect(() => {
    fetch("/api/v1/owners/simples", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((j) => setOwners(j.data || []))
      .catch(() => setOwners([]));

    fetch("/api/v1/states/simples", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((j) => setStates(j.data || []))
      .catch(() => setStates([]));
  }, []);
  useEffect(() => {
    const query = filters.owner_id
      ? `?owner_id=${encodeURIComponent(filters.owner_id)}`
      : "";
    fetch(`/api/v1/regionals/simples${query}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((j) => setRegionals(j.data || []))
      .catch(() => setRegionals([]));
  }, [filters.owner_id]);

  const refresh = () => table.current?.refresh();
  const close = () => {
    setShow(false);
    setInstallation(null);
  };
  const open = (row = null) => {
    setInstallation(row);
    setShow(true);
  };
  const openNew = () => {
    setInstallation(null);
    setShow(true);
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
          <div className="fw-semibold mb-1">{action} Instalação?</div>
          <div className="text-muted small mb-3">
            Deseja realmente {enabled ? "ativar" : "desativar"}
            <strong className="text-body">"{row.name}"</strong>?
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
                  const r = await fetch(
                    `/api/v1/installations/${row.id}/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({ enabled }),
                    },
                  );

                  const j = await r.json();
                  const result = j.data || j;
                  if (!r.ok || result.erro === 1)
                    throw new Error(result.mensagem);
                  toast.success(result.mensagem);
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
      { duration: Infinity, position: "top-center" },
    );
  };
  const columns = [
    {
      label: "Instalação",
      field: "name",
      render: (_, row) => (
        <>
          <div className="fw-semibold">{row.name}</div>
          <small className="text-muted">ID #{row.id}</small>
        </>
      ),
    },
    {
      label: "Proprietário",
      field: "owner_name",
    },
    {
      label: "Regional",
      field: "regional_name",
    },
    {
      label: "UF",
      field: "state_name",
      sortable: false,
      render: (_, row) => `${row.state_abbreviation} - ${row.state_name}`,
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
    ...(canManage
      ? [
          {
            label: "Ação",
            field: "id",
            sortable: false,
            render: (_, row) => (
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  title="Editar"
                  onClick={() => open(row)}
                >
                  <Icon path={mdiPencilOutline} size={0.75} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  title={row.enabled ? "Desativar" : "Ativar"}
                  onClick={() => changeStatus(row)}
                >
                  <Icon path={mdiToggleSwitchOutline} size={0.75} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];
  return (
    <LayoutAdmin>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Instalações</h2>
            <div className="text-muted">
              Cadastro de instalações e subestações
            </div>
          </div>
          {canManage && (
            <button type="button" className="btn btn-primary" onClick={openNew}>
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Nova Instalação
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Instalações cadastradas"
          ajax="/api/v1/installations"
          columns={columns}
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((current) =>
              key === "owner_id"
                ? { ...current, owner_id: value, regional_id: "" }
                : { ...current, [key]: value },
            )
          }
          filterOptions={{
            owner_id: owners.map((owner) => ({
              value: owner.id,
              label: owner.name,
            })),
            regional_id: regionals.map((regional) => ({
              value: regional.id,
              label: regional.name,
            })),
            state_id: states.map((state) => ({
              value: state.id,
              label: state.label,
            })),
            enabled: [
              { value: "true", label: "Ativos" },
              { value: "false", label: "Inativos" },
            ],
          }}
          rowActions={[]}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <InstallationOffcanvas
          show={show}
          installation={installation}
          onHide={close}
          onSaved={() => {
            close();
            refresh();
          }}
        />
      </div>
    </LayoutAdmin>
  );
}
