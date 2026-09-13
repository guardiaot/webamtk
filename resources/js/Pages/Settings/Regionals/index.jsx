import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiPencilOutline, mdiToggleSwitchOutline } from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import RegionalOffcanvas from "./RegionalOffcanvas";

export default function Regionals() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ enabled: "", owner_id: "" });
  const [regional, setRegional] = useState(null);
  const [show, setShow] = useState(false);

  const canManage = (user.permissions || []).includes("regionals.manage");

  useEffect(() => {
    fetch("/api/v1/owners/simples", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => setOwners(result.data || []))
      .catch(() => setOwners([]));
  }, []);

  const refresh = () => table.current?.refresh();
  const close = () => {
    setShow(false);
    setRegional(null);
  };
  const open = (item = null) => {
    setRegional(item);
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
          <div className="fw-semibold mb-1">{action} Regional?</div>
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
                  const response = await fetch(
                    `/api/v1/regionals/${row.id}/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({ enabled }),
                    },
                  );
                  const json = await response.json();
                  const result = json.data || json;
                  if (!response.ok || result.erro === 1)
                    throw new Error(result.mensagem);
                  toast.success(result.mensagem);
                  refresh();
                } catch (error) {
                  toast.error(error.message || "Erro ao alterar status.");
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
      label: "Regional",
      field: "name",
      render: (_, row) => (
        <>
          <div className="fw-semibold">{row.name}</div>
          <small className="text-muted">ID #{row.id}</small>
        </>
      ),
    },
    {
      label: "Abreviação",
      field: "abbreviation",
      sortable: false,
    },
    {
      label: "Proprietário",
      field: "owner_name",
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
      label: "Criado em",
      field: "created_at",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("pt-BR") : "—",
    },
    {
      label: "Ação",
      field: "id",
      render: (value, row) => (
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
            <h2 className="mb-1">Regionais</h2>
            <div className="text-muted">Cadastro de regionais operacionais</div>
          </div>
          {canManage && (
            <button className="btn btn-primary" onClick={() => open()}>
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Nova Regional
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Regionais cadastradas"
          ajax="/api/v1/regionals"
          columns={columns}
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((current) => ({ ...current, [key]: value }))
          }
          filterOptions={{
            owner_id: owners.map((owner) => ({
              value: owner.id,
              label: owner.name,
            })),
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
          }}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <RegionalOffcanvas
          show={show}
          regional={regional}
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
