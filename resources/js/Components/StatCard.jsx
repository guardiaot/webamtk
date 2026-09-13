import React from "react";
import Icon from "@mdi/react";

/**
 * StatCard - componente genérico para cards de indicadores (dashboard).
 *
 * Exemplo de uso:
 *
 * import { mdiInformationSlabCircleOutline } from "@mdi/js";
 *
 * <StatCard
 *   id="cardOpt3"
 *   icon={mdiInformationSlabCircleOutline}
 *   iconColor="#4CAF50"
 *   title="Cotações realizadas"
 *   value={dashData?.data?.data?.geral?.total ?? 0}
 *   trend={{ value: 72.8, direction: "up" }}
 *   dropdownItems={[
 *     { label: "View More", onClick: () => console.log("view more") },
 *     { label: "Delete", onClick: () => console.log("delete") },
 *   ]}
 * />
 */
export default function StatCard({
    id = "cardOpt",
    icon,
    iconColor = "#4CAF50",
    iconSize = 2,
    title,
    height,
    value,
    trend, // { value: number, direction: 'up' | 'down' }
    dropdownItems = [],
    valueColor = "#a9a8a8",
}) {
    const hasDropdown = dropdownItems.length > 0;

    return (
        <div className="card">
            <div className="card-body" style={{ height: height ?? "auto" }}>
                <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                        {icon && <Icon path={icon} size={iconSize} color={iconColor} />}
                    </div>

                    {hasDropdown && (
                        <div className="dropdown">
                            <button
                                aria-label="Click me"
                                className="btn p-0"
                                type="button"
                                id={id}
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="bx bx-dots-vertical-rounded" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby={id}>
                                {dropdownItems.map((item, index) => (
                                    <a
                                        key={index}
                                        aria-label={item.label}
                                        className="dropdown-item"
                                        href={item.href ?? "#"}
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                e.preventDefault();
                                                item.onClick(e);
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {title && <span className="fw-medium d-block mb-1">{title}</span>}

                <h3
                    className="card-title text-center mb-2"
                    style={{ fontSize: 40, fontWeight: 800, color: valueColor }}
                >
                    {value ?? 0}
                </h3>

                {trend && (
                    <small
                        className={`fw-medium ${
                            trend.direction === "up" ? "text-success" : "text-danger"
                        }`}
                    >
                        <i
                            className={`bx ${
                                trend.direction === "up"
                                    ? "bx-up-arrow-alt"
                                    : "bx-down-arrow-alt"
                            }`}
                        ></i>{" "}
                        {trend.direction === "up" ? "+" : "-"}
                        {Math.abs(trend.value)}%
                    </small>
                )}
            </div>
        </div>
    );
}
