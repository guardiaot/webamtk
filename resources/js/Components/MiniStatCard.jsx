import React from "react";
import Icon from "@mdi/react";
import {
    mdiTrendingUp,
    mdiTrendingDown,
} from "@mdi/js";

const colors = {
    primary: "bg-label-primary",
    secondary: "bg-label-secondary",
    success: "bg-label-success",
    danger: "bg-label-danger",
    warning: "bg-label-warning",
    info: "bg-label-info",
    dark: "bg-label-dark",
};

const formatValue = (value, format = "integer") => {
    const number = Number(value) || 0;

    switch (format) {
        case "currency":
            return number.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

        case "percent":
            return `${number.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            })}%`;

        case "integer":
        default:
            return number.toLocaleString("pt-BR", {
                maximumFractionDigits: 0,
            });
    }
};

export default function MiniStatCard({
    value = 0,
    label = "",
    comparison = null,
    comparisonLabel = "este mês",
    icon = null,
    color = "primary",
    onClick = null,
    className = "",
    format = "integer",
    comparisonFormat = "integer",
}) {
    const colorClass = colors[color] || colors.primary;

    const comparisonValue = Number(comparison);

    const isPositive = comparisonValue > 0;
    const isNegative = comparisonValue < 0;

    return (
        <div
            className={`card ${className}`}
            onClick={onClick}
            style={{
                cursor: onClick ? "pointer" : "default",
            }}
        >
            <div className="card-body">

                {/* Título + ícone */}
                <div className="d-flex align-items-center justify-content-between mb-2">

                    <span className="text-muted">
                        {label}
                    </span>

                    {icon && (
                        <span
                            className={`badge ${colorClass} rounded-circle p-2 d-flex align-items-center justify-content-center`}
                            style={{
                                width: "40px",
                                height: "40px",
                            }}
                        >
                            <Icon
                                path={icon}
                                size={1}
                            />
                        </span>
                    )}

                </div>

                {/* Valor */}
                <h3 className="mb-0 fw-bold">
                    {value}
                </h3>

                {/* Comparação */}
                {comparison !== null && (
                    <div className="mt-3">

                        <div className="d-flex align-items-center gap-1">
                            {comparisonLabel}{": "}
                            {isPositive && (
                                <Icon
                                    path={mdiTrendingUp}
                                    size={0.7}
                                    className="text-success"
                                />
                            )}

                            {isNegative && (
                                <Icon
                                    path={mdiTrendingDown}
                                    size={0.7}
                                    className="text-danger"
                                />
                            )}

                            <small
                                className={
                                    isPositive
                                        ? "text-success"
                                        : isNegative
                                            ? "text-danger"
                                            : "text-muted"
                                }
                            >
                                {formatValue(
                                    Math.abs(comparisonValue),
                                    comparisonFormat
                                )} {" "}

                            </small>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}