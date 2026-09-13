import React, { useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiPlus, mdiToggleSwitchOutline } from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import TransmissionFunctionTypeOffcanvas from "./TransmissionFunctionTypeOffcanvas";

export default function TransmissionFunctionTypes() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [type, setType] = useState(null);
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({ enabled: "" });
  const canManage = (user.permissions || []).includes(
    "transmission_functions.manage",
  );

  const open = (item = null) => {
    setType(item);
    setShow(true);
  };
  const close = () => {
    setShow(false);
    setType(null);
  };
  const refresh = () => table.current?.refresh();

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
          <div className="fw-semibold mb-1">{action} Tipo de Função?</div>
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
                try {
                  const response = await fetch(
                    `/api/v1/transmission-function-types/${row.id}/status`,
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
    { label: "Tipo de Função de Transmissão", field: "name" },
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
            <h2 className="mb-1">Tipos de Função de Transmissão</h2>
            <div className="text-muted">
              Categorias utilizadas nas funções de transmissão
            </div>
          </div>
          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => open()}
            >
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo Tipo
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Tipos cadastrados"
          ajax="/api/v1/transmission-function-types"
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
        <TransmissionFunctionTypeOffcanvas
          show={show}
          type={type}
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
