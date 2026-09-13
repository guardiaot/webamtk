import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiEyeOutline, mdiPlus, mdiPencilOutline } from "@mdi/js";
import { usePage } from "@inertiajs/react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import DataTable from "@/Components/DataTable";
import IEDOffcanvas from "./IEDOffcanvas";

export default function IEDs() {
  const { user = {} } = usePage().props;
  const table = useRef(null);
  const [show, setShow] = useState(false);
  const [ied, setIed] = useState(null);
  const [owners, setOwners] = useState([]);
  const [regionals, setRegionals] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [filters, setFilters] = useState({
    owner_id: "",
    regional_id: "",
    installation_id: "",
    transmission_function_id: "",
    status: "",
    manufacturer: "",
  });
  const canManage = (user.permissions || []).includes("ieds.manage");
  const load = (url, setter) =>
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((j) => setter(j.data || j || []))
      .catch(() => setter([]));
  useEffect(() => {
    load("/api/v1/owners/simples", setOwners);
    load("/api/v1/transmission-functions/simples", setFunctions);
  }, []);
  useEffect(
    () =>
      load(
        filters.owner_id
          ? `/api/v1/regionals/simples?owner_id=${filters.owner_id}`
          : "/api/v1/regionals/simples",
        setRegionals,
      ),
    [filters.owner_id],
  );
  useEffect(
    () =>
      load(
        filters.regional_id
          ? `/api/v1/installations/simples?regional_id=${filters.regional_id}`
          : "/api/v1/installations/simples",
        setInstallations,
      ),
    [filters.regional_id],
  );
  const updateFilter = (key, value) =>
    setFilters((current) =>
      key === "owner_id"
        ? {
            ...current,
            owner_id: value,
            regional_id: "",
            installation_id: "",
            transmission_function_id: "",
          }
        : key === "regional_id"
          ? {
              ...current,
              regional_id: value,
              installation_id: "",
              transmission_function_id: "",
            }
          : key === "installation_id"
            ? {
                ...current,
                installation_id: value,
                transmission_function_id: "",
              }
            : { ...current, [key]: value },
    );
  const columns = [
    {
      label: "IED",
      field: "name",
      render: (_, row) => (
        <>
          <div className="fw-semibold">{row.name}</div>
          <small className="text-muted">{row.code || row.id}</small>
        </>
      ),
    },
    {
      label: "Fabricante / Modelo",
      field: "manufacturer",
      render: (_, row) => (
        <>
          {row.manufacturer || "—"}
          <small className="d-block text-muted">{row.model || "—"}</small>
        </>
      ),
    },
    {
      label: "Função / Instalação",
      field: "transmission_function_name",
      render: (_, row) => (
        <>
          {row.transmission_function_name || "—"}
          <small className="d-block text-muted">
            {row.installation_name || "—"}
          </small>
        </>
      ),
    },
    {
      label: "DRIVER DE COLETA",
      field: "effective_driver_name",
      render: (_, row) => (
        <div>
          <div>{row.effective_driver_name || "\u2014"}</div>
          {row.effective_driver_source === "override" && (
            <small className="d-block text-muted">override</small>
          )}
        </div>
      ),
    },
    {
      label: "Host",
      field: "host",
      render: (_, row) => (
        <>
          {row.host}
          <small className="d-block text-muted">TCP {row.port}</small>
        </>
      ),
    },
    {
      label: "Status",
      field: "status",
      render: (value) => (
        <span
          className={`badge ${value === "online" ? "bg-success" : value === "offline" ? "bg-secondary" : "bg-warning text-dark"}`}
        >
          {value || "unknown"}
        </span>
      ),
    },
    {
      label: "Última comunicação",
      field: "last_seen",
      render: (value) =>
        value ? new Date(value).toLocaleString("pt-BR") : "—",
    },
    ...(canManage
      ? [
          {
            label: "Ação",
            field: "id",
            sortable: false,
            render: (_, row) => (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                title="Editar"
                onClick={() => {
                  setIed(row);
                  setShow(true);
                }}
              >
                <Icon path={mdiPencilOutline} size={0.75} />
              </button>
            ),
          },
        ]
      : [
          {
            label: "Ação",
            field: "id",
            sortable: false,
            render: (_, row) => (
              <a
                href={`/ieds/${row.id}`}
                className="btn btn-sm btn-outline-secondary"
                title="Visualizar"
              >
                <Icon path={mdiEyeOutline} size={0.75} />
              </a>
            ),
          },
        ]),
  ];
  return (
    <LayoutAdmin>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">IEDs</h2>
            <div className="text-muted">
              Cadastro e acompanhamento dos Intelligent Electronic Devices
            </div>
          </div>
          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIed(null);
                setShow(true);
              }}
            >
              <Icon path={mdiPlus} size={0.8} className="me-1" />
              Novo IED
            </button>
          )}
        </div>
        <div className="mb-4">
          <label className="form-label small text-muted">
            Filtrar fabricante
          </label>
          <input
            className="form-control"
            value={filters.manufacturer}
            onChange={(e) => updateFilter("manufacturer", e.target.value)}
            placeholder="Digite o fabricante"
          />
        </div>
        <DataTable
          ref={table}
          title="IEDs cadastrados"
          ajax="/api/v1/ieds"
          columns={columns}
          filters={filters}
          onFilterChange={updateFilter}
          filterOptions={{
            owner_id: owners.map((x) => ({ value: x.id, label: x.name })),
            regional_id: regionals.map((x) => ({ value: x.id, label: x.name })),
            installation_id: installations.map((x) => ({
              value: x.id,
              label: x.name,
            })),
            transmission_function_id: functions.map((x) => ({
              value: x.id,
              label: x.name,
            })),
            status: [
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
              { value: "unknown", label: "Desconhecido" },
            ],
          }}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
        />

        <IEDOffcanvas
          show={show}
          ied={ied}
          onHide={() => {
            setShow(false);
            setIed(null);
          }}
          onSaved={() => {
            setShow(false);
            setIed(null);
            table.current?.refresh();
          }}
        />
      </div>
    </LayoutAdmin>
  );
}
