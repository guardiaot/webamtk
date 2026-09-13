import React, { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const defaultData = {
    labels: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
    ],

    datasets: [
        {
            label: "Receitas",

            data: [
                18500,
                22000,
                19800,
                24500,
                28000,
                26500,
                31000,
                33500,
            ],

            borderWidth: 1,
            tension: 0.4,
            fill: false,

            // cor da linha
            borderColor: "#198754",

            // pontos
            pointRadius: 3,
            pointHoverRadius: 6,
        },

        {
            label: "Despesas",

            data: [
                12500,
                14500,
                15200,
                16800,
                17500,
                19000,
                18200,
                20500,
            ],

            borderWidth: 1,
            tension: 0.4,
            fill: false,

            borderColor: "#dc3545",

            pointRadius: 3,
            pointHoverRadius: 6,
        },
    ],
};

export default function LineChart({
    url = null,
    params = {},
    title = "Receitas x Despesas",
    height = 250,
    data: externalData = null,
}) {
    const [chartData, setChartData] = useState(
        externalData || defaultData
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const query = new URLSearchParams(params).toString();

                const response = await fetch(
                    `${url}${query ? `?${query}` : ""}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Erro HTTP: ${response.status}`
                    );
                }

                const result = await response.json();

                setChartData(result);

            } catch (err) {
                console.error(err);

                setError(err.message);

                // mantém os dados de teste
                setChartData(defaultData);

            } finally {
                setLoading(false);
            }
        };

        loadData();

    }, [url, JSON.stringify(params)]);

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index",
        },

        plugins: {
            legend: {
                display: true,
                position: "top",
            },

            title: {
                display: true,
                text: title,
                style: {
                    font: {
                        size: 16,
                        textAlign: "left",
                    },
                },
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw ?? 0;

                        return `${context.dataset.label}: ${value.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                            }
                        )}`;
                    },
                },
            },
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: function (value) {
                        return value.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0,
                            }
                        );
                    },
                },
            },
        },
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: `${height}px`,
            }}
        >

            {loading && (
                <div className="text-center mb-2">
                    Carregando...
                </div>
            )}

            {error && (
                <div className="alert alert-warning">
                    Não foi possível carregar os dados.
                </div>
            )}

            <Line
                data={chartData}
                options={options}
            />

        </div>
    );
}