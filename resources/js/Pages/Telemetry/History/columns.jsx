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

export function getIEDColumns() {
    return [
        {
            field: "record",
            label: "data",
            sortable: true,
            render: (value, row) => (
                getDate(row.record)
            )

        },
        {
            field: "record",
            label: "Fabricante",
            sortable: true,
            render: (value, row) => (
                getTime(row.record)
            )
        },
        {
            field: "ied_id",
            label: "ieds",
            sortable: true,
            render: (value, row) => (
                <div className="d-flex align-items-center">
                    <Icon
                        path={mdiServerNetwork}
                        size={0.9}
                        className="text-primary me-2"
                    />
                    <div>
                        <div className="fw-semibold">
                            {row.name ||
                                selectedIed?.name ||
                                selectedIed?.nome ||
                                record.ied_id ||
                                ied}
                        </div>
                        <div className="small text-muted">
                            {row.ied_id ||
                                ied}
                        </div>
                    </div>
                </div>
            )
        },
        {
            field: "ia",
            label: "ia",
            sortable: true,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.ia,
                        1
                    )} A
                </div>
            )
        },
        {
            field: "ib",
            label: "ib",
            sortable: true,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.ia,
                        1
                    )} A
                </div>
            )
        },
        {
            field: "status",
            label: "Status",
            sortable: true,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.ic,
                        1
                    )} A
                </div>
            )
        },
        {
            field: "va",
            label: "va",
            sortable: true,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.va,
                        1
                    )} V
                </div>
            )
        },
        {
            field: "vb",
            label: "vb",
            sortable: true,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.vb,
                        1
                    )} V
                </div>
            )
        },
        {
            field: "vc",
            label: "vc",
            sortable: false,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.vc,
                        1
                    )} V
                </div>
            )
        },
        {
            field: "frequency",
            label: "frequency",
            sortable: false,
            render: (value, row) => (
                <div>
                    {formatNumber(
                        row.frequency,
                        2
                    )} 
                </div>
            )
        }
    ];
}
