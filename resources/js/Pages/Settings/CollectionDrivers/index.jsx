import React, { useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiPlus, mdiToggleSwitchOutline } from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import CollectionDriverOffcanvas from "./CollectionDriverOffcanvas";

export default function CollectionDrivers() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [driver, setDriver] = useState(null);
  const [show, setShow] = useState(false);
  const [changingId, setChangingId] = useState(null);
  const [filters, setFilters] = useState({ enabled: "" });
  const canManage = (user.permissions || []).includes("ieds.manage");
  const open = (item = null) => {
    setDriver(item);
    setShow(true);
  };
  const close = () => {
    setShow(false);
    setDriver(null);
  };
  const refresh = () => table.current?.refresh();
  const changeStatus = (row) => {
    if (confirmation.current || changingId) return;
    const enabled = !Boolean(row.enabled);
    const action = enabled ? "Ativar" : "Desativar";
    confirmation.current = toast.custom(
      (t) => (
        <div
          className="bg-white border rounded shadow p-3"
          style={{ minWidth: 320 }}
        >
          <div className="fw-semibold mb-1">{action} Driver de Coleta?</div>
          <div className="text-muted small mb-3">
            Deseja realmente {enabled ? "ativar" : "desativar"}{" "}
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
                setChangingId(row.id);
                try {
                  const response = await fetch(
                    `/api/v1/collection-drivers/${row.id}/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                      },
                      body: JSON.stringify({ enabled }),
                    },
                  );
                  const json = await response.json();
                  const result = json.data || json;
                  if (!response.ok || result.erro === 1)
                    throw new Error(
                      result.mensagem || "Erro ao alterar status.",
                    );
                  toast.success(result.mensagem);
                  refresh();
                } catch (error) {
                  toast.error(error.message || "Erro ao alterar status.");
                } finally {
                  setChangingId(null);
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
    { label: "Código", field: "code" },
    { label: "Nome", field: "name" },
    {
      label: "Categoria",
      field: "category",
      render: (value) => {
        const labels = {
          protocol: "Protocolo",
          service: "Serviço / Capacidade",
          integration: "Integração",
          strategy: "Estratégia de Coleta",
          utility: "Utilitário",
          none: "Sem Driver",
        };
        return (
          <span className="badge bg-light text-dark">
            {labels[value] || value || "—"}
          </span>
        );
      },
    },
    {
      label: "IMPLANTADO NO AGENT",
      field: "agent_status",
      sortable: false,
      render: (value) => {
        const labels = {
          implemented: "Sim",
          partial: "Parcial",
          not_implemented: "Não",
          unavailable: "Indisponível",
        };
        const classes = {
          implemented: "bg-success",
          partial: "bg-warning text-dark",
          not_implemented: "bg-secondary",
          unavailable: "bg-secondary",
        };
        return (
          <span className={`badge ${classes[value] || "bg-secondary"}`}>
            {labels[value] || "Indisponível"}
          </span>
        );
      },
    },
    {
      label: "Descrição",
      field: "description",
      render: (value) => value || "—",
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
                  disabled={changingId === row.id}
                >
                  <Icon path={mdiPencilOutline} size={0.75} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  title={row.enabled ? "Desativar" : "Ativar"}
                  onClick={() => changeStatus(row)}
                  disabled={changingId === row.id}
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
            <h2 className="mb-1">Drivers de Coleta</h2>
            <div className="text-muted">
              Drivers disponíveis para comunicação e coleta dos IEDs
            </div>
          </div>
          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => open()}
            >
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo Driver
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Drivers cadastrados"
          ajax="/api/v1/collection-drivers"
          columns={columns}
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((current) => ({ ...current, [key]: value }))
          }
          filterOptions={{
            enabled: [
              { value: "true", label: "Ativos" },
              { value: "false", label: "Inativos" },
            ],
          }}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <CollectionDriverOffcanvas
          show={show}
          driver={driver}
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
