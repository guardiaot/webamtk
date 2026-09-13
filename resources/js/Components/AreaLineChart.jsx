import React, { useEffect, useRef } from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
    Legend
);

/**
 * AreaLineChart
 *
 * Gráfico de linha com área preenchida (gradiente), no estilo de dashboard
 * (cartão branco, cantos arredondados, sombra suave).
 *
 * Props:
 *   labels     -> array de labels do eixo X (ex: ['Jan', 'Fev', 'Mar', ...])
 *   data       -> array de valores numéricos (mesmo tamanho de labels)
 *   label      -> nome da série (aparece no tooltip/legend)
 *   color      -> cor principal da linha/área (default: verde, igual ao StatCard)
 *   height     -> altura do canvas em px (default: 280)
 */
export default function AreaLineChart({
    labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    data = [40, 65, 52, 90, 78, 110, 235],
    label = "Cotações",
    color = "#4CAF50",
    height = 280,
}) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        // Gradiente vertical para a área preenchida
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, hexToRgba(color, 0.35));
        gradient.addColorStop(1, hexToRgba(color, 0));

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label,
                        data,
                        borderColor: color,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2.5,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: color,
                        pointHoverBorderColor: "#ffffff",
                        pointHoverBorderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#1f2937",
                        titleColor: "#f9fafb",
                        bodyColor: "#f9fafb",
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: "#9ca3af", font: { size: 12 } },
                    },
                    y: {
                        grid: { color: "#f0f0f0" },
                        border: { display: false },
                        ticks: { color: "#9ca3af", font: { size: 12 } },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [labels, data, label, color, height]);

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                width: "100%",
            }}
        >
            <div style={{ marginBottom: "12px", color: "#374151", fontWeight: 600, fontSize: "15px" }}>
                {label}
            </div>
            <div style={{ height: `${height}px`, position: "relative" }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}

function hexToRgba(hex, alpha) {
    const parsed = hex.replace("#", "");
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
