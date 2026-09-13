import React from "react";
import Icon from "@mdi/react";
import {
    mdiMagnify,
    mdiPencilOutline,
    mdiEyeOutline,
    mdiRobotOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiFolderEditOutline
} from "@mdi/js";

export function getIEDColumns({ openEdit }) {
    return [
        {
            field: "name",
            label: "IED",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="fw-semibold">{row.name}</div>
                    <div className="small text-muted">{row.id}</div>
                </div>
            )
        },
        {
            field: "manufacturer",
            label: "Fabricante",
            sortable: true
        },
        {
            field: "model",
            label: "Modelo",
            sortable: true
        },
        {
            field: "host",
            label: "Endereço",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div>{row.host}</div>
                    <div className="small text-muted">TCP {row.port}</div>
                </div>
            )
        },
        {
            field: "source",
            label: "Origem",
            sortable: true,
            render: (value, row) => (
                row.source === "discovery" || !row.source ? (
                    <span className="badge bg-info text-dark d-flex align-items-center" style={{ width: "fit-content" }}>
                        <Icon path={mdiMagnify} size={0.65} className="me-1" />
                        Discovery
                    </span>
                ) : (
                    <span className="badge bg-secondary d-flex align-items-center" style={{ width: "fit-content" }}>
                        <Icon path={mdiFolderEditOutline} size={0.65} className="me-1" />
                        Manual
                    </span>
                )
            )
        },
        {
            field: "status",
            label: "Status",
            sortable: true,
            render: (value, row) => {
                if (row.status === "online" || row.status === "active") {
                    return (
                        <span className="badge bg-success d-flex align-items-center" style={{ width: "fit-content" }}>
                            <Icon path={mdiCheckCircleOutline} size={0.65} className="me-1" />
                            Online
                        </span>
                    );
                }
                if (row.status === "offline") {
                    return (
                        <span className="badge bg-secondary d-flex align-items-center" style={{ width: "fit-content" }}>
                            <Icon path={mdiCloseCircleOutline} size={0.65} className="me-1" />
                            Offline
                        </span>
                    );
                }
                if (row.status === "error") {
                    return (
                        <span className="badge bg-danger d-flex align-items-center" style={{ width: "fit-content" }}>
                            <Icon path={mdiAlertCircleOutline} size={0.65} className="me-1" />
                            Erro
                        </span>
                    );
                }
                return (
                    <span className="badge bg-secondary" style={{ width: "fit-content" }}>
                        Desconhecido
                    </span>
                );
            }
        },
        {
            field: "agent_id",
            label: "Agent",
            sortable: true,
            render: (value, row) => (
                <div className="small d-flex align-items-center">
                    <Icon path={mdiRobotOutline} size={0.7} className="me-1 text-muted" />
                    {row.agent_name || row.agent_id || "—"}
                </div>
            )
        },
        {
            field: "last_seen",
            label: "Última leitura",
            sortable: true,
            render: (value) => {
                if (!value) return "—";
                try {
                    const d = new Date(value);
                    if (Number.isNaN(d.getTime())) return value;
                    return d.toLocaleString("pt-BR");
                } catch { return value; }
            }
        },
        {
            field: "id",
            label: "Ações",
            sortable: false,
            render: (value, row) => (
                <div className="btn-group">
                    <a
                        href={`/ieds/${row.id}`}
                        className="btn btn-sm btn-outline-secondary"
                        title="Detalhes"
                    >
                        <Icon path={mdiEyeOutline} size={0.75} />
                    </a>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        title="Editar"
                        onClick={() => openEdit(row)}
                    >
                        <Icon path={mdiPencilOutline} size={0.75} />
                    </button>
                </div>
            )
        }
    ];
}
