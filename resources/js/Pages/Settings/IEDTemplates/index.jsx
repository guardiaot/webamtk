import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiPlus, mdiToggleSwitchOutline } from "@mdi/js";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import IEDTemplateOffcanvas from "./IEDTemplateOffcanvas";

export default function IEDTemplates() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const confirmation = useRef(null);
  const [template, setTemplate] = useState(null);
  const [show, setShow] = useState(false);
  const [changingId, setChangingId] = useState(null);
  const [types, setTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [filters, setFilters] = useState({
    ied_type_id: "",
    manufacturer: "",
    enabled: "",
  });
  const canManage = (user.permissions || []).includes("ieds.manage");
  useEffect(() => {
    fetch("/api/v1/ied-types/simples", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((j) => setTypes(j.data || j || []))
      .catch(() => setTypes([]));
    fetch("/api/v1/ied-templates?per_page=100", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((j) => {
        const rows = j.data?.data || [];
        setManufacturers(
          [...new Set(rows.map((x) => x.manufacturer).filter(Boolean))].sort(),
        );
      })
      .catch(() => setManufacturers([]));
  }, []);
  const open = (item = null) => {
    setTemplate(item);
    setShow(true);
  };
  const close = () => {
    setShow(false);
    setTemplate(null);
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
          <div className="fw-semibold mb-1">{action} Template de IED?</div>
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
                    `/api/v1/ied-templates/${row.id}/status`,
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
    { label: "Template", field: "name" },
    { label: "Tipo de IED", field: "ied_type_name" },
    {
      label: "Driver padrão",
      field: "default_driver_name",
      render: (value) => value || "-",
    },
    { label: "Fabricante", field: "manufacturer" },
    { label: "Modelo", field: "model" },
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
            <h2 className="mb-1">Templates de IEDs</h2>
            <div className="text-muted">
              Modelos reutilizáveis de equipamentos
            </div>
          </div>
          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => open()}
            >
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo Template
            </button>
          )}
        </div>
        <DataTable
          ref={table}
          title="Templates cadastrados"
          ajax="/api/v1/ied-templates"
          columns={columns}
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((current) => ({ ...current, [key]: value }))
          }
          filterOptions={{
            ied_type_id: types.map((x) => ({ value: x.id, label: x.name })),
            manufacturer: manufacturers.map((x) => ({ value: x, label: x })),
            enabled: [
              { value: "true", label: "Ativos" },
              { value: "false", label: "Inativos" },
            ],
          }}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <IEDTemplateOffcanvas
          show={show}
          template={template}
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
