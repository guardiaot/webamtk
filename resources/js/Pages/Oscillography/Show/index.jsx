import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Icon from "@mdi/react";

import {
    mdiArrowLeft,
    mdiCalendarRange,
    mdiClockOutline,
    mdiServerNetwork,
    mdiFlashOutline,
    mdiWaveform,
    mdiInformationOutline,
    mdiFileDocumentOutline,
    mdiDownloadOutline,
    mdiChartLine,
    mdiGauge,
    mdiDatabaseOutline,
    mdiPulse,
    mdiLoading,
    mdiAlertCircleOutline,
} from "@mdi/js";

import LayoutAdmin from "@/Layouts/LayoutAdmin";
/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDateTime = (value) => {

    if (!value) {
        return {
            date: "—",
            time: "—",
        };
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return {
            date: "—",
            time: "—",
        };
    }

    return {
        date: date.toLocaleDateString("pt-BR"),
        time: date.toLocaleTimeString("pt-BR"),
    };
};


const formatNumber = (value, decimals = 2) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "—";
    }

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};


const getStatus = (status) => {

    switch (status) {

        case "available":
            return {
                label: "Disponível",
                className: "bg-success-subtle text-success",
            };

        case "processing":
            return {
                label: "Processando",
                className: "bg-warning-subtle text-warning",
            };

        case "error":
            return {
                label: "Erro",
                className: "bg-danger-subtle text-danger",
            };

        case "incomplete":
            return {
                label: "Incompleto",
                className: "bg-warning-subtle text-warning",
            };

        default:
            return {
                label: status || "Desconhecido",
                className: "bg-secondary-subtle text-secondary",
            };
    }
};


/*
|--------------------------------------------------------------------------
| Componente
|--------------------------------------------------------------------------
*/


function OscillographyChart({ data }) {
    if (!data || !data.samples || data.samples.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                Nenhuma amostra disponível para este registro.
            </div>
        );
    }

    const samples = data.samples;
    const analogChannels = data.channels?.analog || [];
    const digitalChannels = data.channels?.digital || [];
    const times = samples.map(
        (sample) => Number(sample.timestamp || 0) / 1000
    );
    const maxTime = Math.max(...times, 1);

    const currentIndices = [];
    const voltageIndices = [];
    const otherIndices = [];

    analogChannels.forEach((channel, index) => {
        const name = String(channel.name || '').trim();

        if (/^i[abc](?:$|[^a-z0-9])/i.test(name)) {
            currentIndices.push(index);
        } else if (/^v[abc](?:$|[^a-z0-9])/i.test(name)) {
            voltageIndices.push(index);
        } else {
            otherIndices.push(index);
        }
    });

    const hasIdentifiedGroups =
        currentIndices.length > 0 ||
        voltageIndices.length > 0;

    const renderChart = (
        title,
        channelIndices,
        yLabel,
        chartKey
    ) => {
        if (channelIndices.length === 0) {
            return null;
        }

        const width = 1200;
        const height = 420;
        const padding = {
            top: 30,
            right: 30,
            bottom: 55,
            left: 75,
        };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        let maxValue = 1;

        samples.forEach((sample) => {
            channelIndices.forEach((channelIndex) => {
                const numericValue = Math.abs(
                    Number(sample.analog_values?.[channelIndex] || 0)
                );

                if (numericValue > maxValue) {
                    maxValue = numericValue;
                }
            });
        });

        maxValue *= 1.1;

        const minValue = -maxValue;

        const x = (time) =>
            padding.left +
            (time / maxTime) * chartWidth;

        const y = (value) =>
            padding.top +
            ((maxValue - value) /
                (maxValue - minValue)) *
            chartHeight;

        const colors = ['#dc3545', '#198754', '#0d6efd'];

        const createPath = (channelIndex) =>
            samples
                .map((sample, sampleIndex) => {
                    const time =
                        Number(sample.timestamp || 0) / 1000;
                    const value = Number(
                        sample.analog_values?.[channelIndex] || 0
                    );

                    return (sampleIndex === 0 ? 'M' : 'L') +
                        ' ' + x(time) + ' ' + y(value);
                })
                .join(' ');

        return (
            <div className="card border-0 shadow-sm mb-4" key={chartKey}>
                <div className="card-header bg-white">
                    <div className="fw-semibold">
                        {title}
                    </div>
                </div>

                <div className="card-body">
                    <div className="d-flex flex-wrap gap-3 mb-3">
                        {channelIndices.map((channelIndex, index) => {
                            const channel = analogChannels[channelIndex];

                            return (
                                <div
                                    key={channel.channel_number}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '3px',
                                            display: 'inline-block',
                                            background: colors[index % colors.length],
                                        }}
                                    />

                                    <span className="small">
                                        {channel.name}

                                        {channel.unit
                                            ? ' (' + channel.unit + ')'
                                            : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        style={{
                            width: '100%',
                            overflowX: 'auto',
                        }}
                    >
                        <svg
                            viewBox={'0 0 ' + width + ' ' + height}
                            width="100%"
                            height="420"
                            preserveAspectRatio="none"
                            style={{
                                minWidth: '800px',
                                background: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '6px',
                            }}
                        >
                            {Array.from({
                                length: 6,
                            }).map((_, index) => {
                                const value =
                                    maxValue -
                                    ((maxValue - minValue) /
                                        5) *
                                    index;
                                const py = y(value);

                                return (
                                    <g key={chartKey + '-y-' + index}>
                                        <line
                                            x1={padding.left}
                                            y1={py}
                                            x2={width - padding.right}
                                            y2={py}
                                            stroke="#e9ecef"
                                            strokeWidth="1"
                                        />

                                        <text
                                            x={padding.left - 10}
                                            y={py + 4}
                                            textAnchor="end"
                                            fontSize="12"
                                            fill="#6c757d"
                                        >
                                            {formatNumber(value)}
                                        </text>
                                    </g>
                                );
                            })}

                            {Array.from({
                                length: 6,
                            }).map((_, index) => {
                                const time =
                                    (maxTime / 5) *
                                    index;
                                const px = x(time);

                                return (
                                    <g key={chartKey + '-x-' + index}>
                                        <line
                                            x1={px}
                                            y1={padding.top}
                                            x2={px}
                                            y2={height - padding.bottom}
                                            stroke="#e9ecef"
                                            strokeWidth="1"
                                        />

                                        <text
                                            x={px}
                                            y={height - padding.bottom + 25}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="#6c757d"
                                        >
                                            {formatNumber(time)}
                                        </text>
                                    </g>
                                );
                            })}

                            <line
                                x1={padding.left}
                                y1={y(0)}
                                x2={width - padding.right}
                                y2={y(0)}
                                stroke="#adb5bd"
                                strokeWidth="1.5"
                            />

                            {channelIndices.map((channelIndex, index) => (
                                <path
                                    key={chartKey + '-path-' + channelIndex}
                                    d={createPath(channelIndex)}
                                    fill="none"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}

                            {samples.map((sample, sampleIndex) => {
                                const time =
                                    Number(sample.timestamp || 0) / 1000;

                                return (
                                    <g key={chartKey + '-sample-' + sampleIndex}>
                                        {channelIndices.map(
                                            (channelIndex, channelIndexInGroup) => {
                                                const value = Number(
                                                    sample.analog_values?.[channelIndex] || 0
                                                );

                                                return (
                                                    <circle
                                                        key={chartKey + '-' + sampleIndex + '-' + channelIndex}
                                                        cx={x(time)}
                                                        cy={y(value)}
                                                        r="3"
                                                        fill={colors[channelIndexInGroup % colors.length]}
                                                    />
                                                );
                                            }
                                        )}
                                    </g>
                                );
                            })}

                            <line
                                x1={padding.left}
                                y1={height - padding.bottom}
                                x2={width - padding.right}
                                y2={height - padding.bottom}
                                stroke="#495057"
                            />

                            <line
                                x1={padding.left}
                                y1={padding.top}
                                x2={padding.left}
                                y2={height - padding.bottom}
                                stroke="#495057"
                            />

                            <text
                                x={width / 2}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize="13"
                                fill="#495057"
                            >
                                Tempo (ms)
                            </text>

                            <text
                                x="15"
                                y={height / 2}
                                textAnchor="middle"
                                fontSize="13"
                                fill="#495057"
                                transform={'rotate(-90 15 ' + height / 2 + ')'}
                            >
                                {yLabel}
                            </text>
                        </svg>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                        <small className="text-muted">
                            {samples.length} amostras
                        </small>

                        <small className="text-muted">
                            Janela: 0 até {formatNumber(maxTime)} ms
                        </small>
                    </div>
                </div>
            </div>
        );
    };

    const renderDigitalChart = () => {
        if (digitalChannels.length === 0) {
            return null;
        }

        const width = 1200;
        const rowHeight = 55;
        const height =
            80 + digitalChannels.length * rowHeight;
        const padding = {
            top: 25,
            right: 30,
            bottom: 55,
            left: 100,
        };
        const chartWidth = width - padding.left - padding.right;
        const colors = [
            '#6f42c1',
            '#fd7e14',
            '#20c997',
            '#d63384',
        ];

        const x = (time) =>
            padding.left +
            (time / maxTime) * chartWidth;

        const isHigh = (value) =>
            value === true ||
            value === 1 ||
            value === '1';

        const level = (row, state) =>
            padding.top +
            row * rowHeight +
            (state ? 10 : 35);

        const createDigitalPath = (channelIndex, row) => {
            const firstState = isHigh(
                samples[0]?.digital_values?.[channelIndex]
            );
            let lastState = firstState;
            let path =
                'M ' + x(times[0]) + ' ' + level(row, firstState);

            samples.slice(1).forEach((sample, index) => {
                const sampleIndex = index + 1;
                const previousState = isHigh(
                    samples[sampleIndex - 1]
                        ?.digital_values?.[channelIndex]
                );
                const currentState = isHigh(
                    sample.digital_values?.[channelIndex]
                );
                const time = times[sampleIndex];

                path +=
                    ' L ' + x(time) + ' ' +
                    level(row, previousState);

                if (currentState !== previousState) {
                    path +=
                        ' L ' + x(time) + ' ' +
                        level(row, currentState);
                }

                lastState = currentState;
            });

            path +=
                ' L ' + x(maxTime) + ' ' +
                level(row, lastState);

            return path;
        };

        return (
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                    <div className="fw-semibold">
                        Eventos digitais
                    </div>

                    <div className="small text-muted">
                        Estados digitais registrados no COMTRADE
                    </div>
                </div>

                <div className="card-body">
                    <div
                        style={{
                            width: '100%',
                            overflowX: 'auto',
                        }}
                    >
                        <svg
                            viewBox={'0 0 ' + width + ' ' + height}
                            width="100%"
                            height={height}
                            preserveAspectRatio="none"
                            style={{
                                minWidth: '800px',
                                background: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '6px',
                            }}
                        >
                            {Array.from({
                                length: 6,
                            }).map((_, index) => {
                                const time =
                                    (maxTime / 5) *
                                    index;
                                const px = x(time);

                                return (
                                    <g key={'digital-x-' + index}>
                                        <line
                                            x1={px}
                                            y1={padding.top}
                                            x2={px}
                                            y2={height - padding.bottom}
                                            stroke="#e9ecef"
                                            strokeWidth="1"
                                        />

                                        <text
                                            x={px}
                                            y={height - padding.bottom + 25}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="#6c757d"
                                        >
                                            {formatNumber(time)}
                                        </text>
                                    </g>
                                );
                            })}

                            {digitalChannels.map((channel, row) => (
                                <g key={channel.channel_number}>
                                    <text
                                        x={padding.left - 10}
                                        y={level(row, false) + 4}
                                        textAnchor="end"
                                        fontSize="12"
                                        fill="#495057"
                                    >
                                        {channel.name || 'Canal ' + channel.channel_number}
                                    </text>

                                    <text
                                        x={padding.left - 78}
                                        y={level(row, false) + 4}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#6c757d"
                                    >
                                        0
                                    </text>

                                    <text
                                        x={padding.left - 78}
                                        y={level(row, true) + 4}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#6c757d"
                                    >
                                        1
                                    </text>

                                    <text
                                        x={padding.left - 10}
                                        y={level(row, false) + 19}
                                        textAnchor="end"
                                        fontSize="10"
                                        fill="#6c757d"
                                    >
                                        Normal: {isHigh(channel.normal_state) ? 1 : 0}
                                    </text>

                                    <line
                                        x1={padding.left}
                                        y1={level(row, false)}
                                        x2={width - padding.right}
                                        y2={level(row, false)}
                                        stroke="#e9ecef"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d={createDigitalPath(
                                            row,
                                            row
                                        )}
                                        fill="none"
                                        stroke={colors[row % colors.length]}
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </g>
                            ))}

                            <line
                                x1={padding.left}
                                y1={height - padding.bottom}
                                x2={width - padding.right}
                                y2={height - padding.bottom}
                                stroke="#495057"
                            />

                            <text
                                x={width / 2}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize="13"
                                fill="#495057"
                            >
                                Tempo (ms)
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    const fallbackIndices = hasIdentifiedGroups
        ? otherIndices
        : analogChannels.map((_, index) => index);

    return (
        <div className="w-100">
            {renderChart(
                'Correntes',
                currentIndices,
                'Corrente (A)',
                'current'
            )}

            {renderChart(
                'Tensões',
                voltageIndices,
                'Tensão (V)',
                'voltage'
            )}

            {fallbackIndices.length > 0 && renderChart(
                'Canais analógicos',
                fallbackIndices,
                'Amplitude',
                'other'
            )}

            {renderDigitalChart()}
        </div>
    );
}


export default function Show({ record: initialRecord = null, id = null }) {


    const [record, setRecord] = useState(initialRecord);
    const [loading, setLoading] = useState(
        !initialRecord
    );

    const [error, setError] = useState(null);



    const [samplesData, setSamplesData] = useState(null);
    const [samplesLoading, setSamplesLoading] = useState(false);
    const [samplesError, setSamplesError] = useState(null);





    /*
    |--------------------------------------------------------------------------
    | ID do registro
    |--------------------------------------------------------------------------
    */

    const recordId =
        initialRecord?.id ||
        id ||
        window.location.pathname.split("/").filter(Boolean).pop();



    /*
    |--------------------------------------------------------------------------
    | Carregamento do registro
    |--------------------------------------------------------------------------
    |
    | Caso a página seja aberta sem o registro via Inertia,
    | busca diretamente na API.
    |
    */

    useEffect(() => {

        if (initialRecord || !recordId) {
            return;
        }

        const loadRecord = async () => {

            try {

                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/v1/visualizar/${recordId}/comtrade`
                );

                if (!response.ok) {
                    throw new Error(
                        "Não foi possível carregar a oscilografia."
                    );
                }

                const json = await response.json();

                if (json?.data) {
                    setRecord(json.data);
                } else {
                    setRecord(json);
                }

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Erro ao carregar a oscilografia."
                );

            } finally {

                setLoading(false);

            }
        };

        loadRecord();
        loadSamples(recordId);

    }, [initialRecord, recordId]);

    /**
     * grafico
     */

    const loadSamples = async (recordId) => {
        if (!recordId) {
            return;
        }

        setSamplesLoading(true);
        setSamplesError(null);

        try {
            const response = await fetch(
                `/api/v1/samples/${recordId}/comtrade`
            );

            const result = await response.json();

            if (result.status !== 'OK') {
                throw new Error(
                    result.message || 'Erro ao carregar amostras.'
                );
            }

            const data = result.data;

            const samples = (data.samples || []).map((sample) => ({
                ...sample,

                // O PostgreSQL está retornando o JSON como string.
                analog_values:
                    typeof sample.analog_values === 'string'
                        ? JSON.parse(sample.analog_values)
                        : sample.analog_values || [],

                digital_values:
                    typeof sample.digital_values === 'string'
                        ? JSON.parse(sample.digital_values)
                        : sample.digital_values || [],
            }));

            setSamplesData({
                ...data,
                samples,
            });

        } catch (error) {
            console.error('Erro ao carregar amostras:', error);
            setSamplesError(
                error.message || 'Não foi possível carregar as amostras.'
            );
        } finally {
            setSamplesLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Data principal
    |--------------------------------------------------------------------------
    */

    const eventDate = useMemo(() => {

        if (!record) {
            return {
                date: "—",
                time: "—",
            };
        }

        return formatDateTime(
            record.start_time ||
            record.created_at
        );

    }, [record]);


    /*
    |--------------------------------------------------------------------------
    | Data do disparo
    |--------------------------------------------------------------------------
    */

    const triggerDate = useMemo(() => {

        if (!record?.trigger_time) {
            return null;
        }

        return formatDateTime(
            record.trigger_time
        );

    }, [record]);


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const status = getStatus(
        record?.status
    );


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <LayoutAdmin>
                <Head title="Visualizar Oscilografia" />

                <div className="container-fluid py-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <Icon
                                path={mdiLoading}
                                size={1.5}
                                spin
                            />

                            <div className="mt-3 text-muted">
                                Carregando oscilografia...
                            </div>

                        </div>

                    </div>

                </div>
            </LayoutAdmin>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Erro
    |--------------------------------------------------------------------------
    */

    if (error || !record) {

        return (
            <LayoutAdmin>
                <Head title="Oscilografia" />

                <div className="container-fluid py-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <Icon
                                path={mdiAlertCircleOutline}
                                size={2}
                                className="text-danger"
                            />

                            <h5 className="mt-3">
                                Não foi possível carregar a oscilografia
                            </h5>

                            <div className="text-muted mb-4">
                                {error || "Registro não encontrado."}
                            </div>

                            <a
                                href="/oscillography"
                                className="btn btn-outline-primary"
                            >
                                <Icon
                                    path={mdiArrowLeft}
                                    size={0.8}
                                    className="me-1"
                                />

                                Voltar
                            </a>

                        </div>

                    </div>

                </div>
            </LayoutAdmin>
        );
    }


    return (

        <LayoutAdmin>
            <Head
                title={`Oscilografia #${record.id}`}
            />


            <div className="container-fluid py-4">


                {/* ============================================================
                    CABEÇALHO
                   ============================================================ */}

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                    <div>

                        <div className="d-flex align-items-center gap-2 mb-1">

                            <a
                                href="/oscillography"
                                className="btn btn-sm btn-outline-secondary"
                            >
                                <Icon
                                    path={mdiArrowLeft}
                                    size={0.8}
                                />
                            </a>

                            <h4 className="mb-0">
                                Visualizar Oscilografia
                            </h4>

                        </div>

                        <div className="text-muted small">
                            Registro COMTRADE #{record.id}
                        </div>

                    </div>


                    <div className="d-flex align-items-center gap-2">

                        <span
                            className={`badge ${status.className} px-3 py-2`}
                        >
                            {status.label}
                        </span>

                    </div>

                </div>


                {/* ============================================================
                    IDENTIFICAÇÃO
                   ============================================================ */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white border-0 py-3">

                        <div className="d-flex align-items-center">

                            <Icon
                                path={mdiServerNetwork}
                                size={1}
                                className="text-primary me-2"
                            />

                            <div>

                                <div className="fw-semibold">
                                    Identificação do IED
                                </div>

                                <div className="small text-muted">
                                    Equipamento associado ao registro
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="row g-4">

                            {/* IED */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    IED
                                </div>

                                <div className="fw-semibold fs-5">
                                    {record.ied_name || "—"}
                                </div>

                                <div className="small text-muted">
                                    ID: {record.ied_id ?? "—"}
                                </div>

                            </div>


                            {/* Fabricante */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Fabricante
                                </div>

                                <div className="fw-semibold">
                                    {record.manufacturer || "—"}
                                </div>

                            </div>


                            {/* Modelo */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Modelo
                                </div>

                                <div className="fw-semibold">
                                    {record.model || "—"}
                                </div>

                            </div>


                            {/* Estação */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Estação
                                </div>

                                <div className="fw-semibold">
                                    {record.station_name || "—"}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ============================================================
                    RESUMO DO EVENTO
                   ============================================================ */}

                <div className="row g-3 mb-4">


                    {/* DATA */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex align-items-center mb-2">

                                    <Icon
                                        path={mdiCalendarRange}
                                        size={0.9}
                                        className="text-primary me-2"
                                    />

                                    <span className="text-muted small">
                                        Data do evento
                                    </span>

                                </div>

                                <div className="fw-semibold">
                                    {eventDate.date}
                                </div>

                                <div className="small text-muted">
                                    {eventDate.time}
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* DISPARO */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex align-items-center mb-2">

                                    <Icon
                                        path={mdiFlashOutline}
                                        size={0.9}
                                        className="text-warning me-2"
                                    />

                                    <span className="text-muted small">
                                        Disparo
                                    </span>

                                </div>

                                {triggerDate ? (

                                    <>
                                        <div className="fw-semibold">
                                            {triggerDate.date}
                                        </div>

                                        <div className="small text-muted">
                                            {triggerDate.time}
                                        </div>
                                    </>

                                ) : (

                                    <div className="text-muted">
                                        Não informado
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* DURAÇÃO */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex align-items-center mb-2">

                                    <Icon
                                        path={mdiGauge}
                                        size={0.9}
                                        className="text-primary me-2"
                                    />

                                    <span className="text-muted small">
                                        Duração estimada
                                    </span>

                                </div>

                                <div className="fw-semibold fs-5">

                                    {formatNumber(
                                        record.duration,
                                        3
                                    )}

                                    <span className="fs-6 ms-1">
                                        s
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* FREQUÊNCIA */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex align-items-center mb-2">

                                    <Icon
                                        path={mdiPulse}
                                        size={0.9}
                                        className="text-primary me-2"
                                    />

                                    <span className="text-muted small">
                                        Frequência nominal
                                    </span>

                                </div>

                                <div className="fw-semibold fs-5">

                                    {formatNumber(
                                        record.nominal_frequency,
                                        0
                                    )}

                                    <span className="fs-6 ms-1">
                                        Hz
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ============================================================
                    GRÁFICO
                   ============================================================ */}


                <div className="card shadow-sm mb-4">

                    <div className="card-header bg-white">
                        <div className="d-flex align-items-center justify-content-between">

                            <div>
                                <h5 className="mb-1">
                                    <Icon
                                        path={mdiWaveform}
                                        size={0.9}
                                        className="me-2"
                                    />

                                    Formas de onda
                                </h5>

                                <small className="text-muted">
                                    Valores analógicos e eventos digitais
                                </small>
                            </div>

                            {samplesData && (
                                <span className="badge bg-light text-dark">
                                    {samplesData.sample_count} amostras
                                </span>
                            )}

                        </div>
                    </div>

                    <div className="card-body">

                        {samplesLoading && (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <div className="mt-2 text-muted">
                                    Carregando amostras...
                                </div>
                            </div>
                        )}

                        {!samplesLoading && samplesError && (
                            <div className="alert alert-danger">
                                <strong>
                                    Erro ao carregar os dados:
                                </strong>

                                <div className="mt-1">
                                    {samplesError}
                                </div>
                            </div>
                        )}

                        {!samplesLoading &&
                            !samplesError &&
                            samplesData && (
                                <OscillographyChart
                                    data={samplesData}
                                />
                            )}

                    </div>
                </div>




                {/* ============================================================
                    INFORMAÇÕES DA AQUISIÇÃO
                   ============================================================ */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white border-0 py-3">

                        <div className="d-flex align-items-center">

                            <Icon
                                path={mdiDatabaseOutline}
                                size={1}
                                className="text-primary me-2"
                            />

                            <div>

                                <div className="fw-semibold">
                                    Informações da aquisição
                                </div>

                                <div className="small text-muted">
                                    Parâmetros registrados no COMTRADE
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="row g-4">


                            {/* Taxa */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Taxa de amostragem
                                </div>

                                <div className="fw-semibold">

                                    {formatNumber(
                                        record.sample_rate,
                                        0
                                    )}

                                    <span className="ms-1">
                                        Hz
                                    </span>

                                </div>

                            </div>


                            {/* Amostras */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Quantidade de amostras
                                </div>

                                <div className="fw-semibold">
                                    {formatNumber(
                                        record.sample_count,
                                        0
                                    )}
                                </div>

                            </div>


                            {/* Analógicos */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Canais analógicos
                                </div>

                                <div className="fw-semibold">

                                    {formatNumber(
                                        record.analog_channels,
                                        0
                                    )}

                                </div>

                            </div>


                            {/* Digitais */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Canais digitais
                                </div>

                                <div className="fw-semibold">

                                    {formatNumber(
                                        record.digital_channels,
                                        0
                                    )}

                                </div>

                            </div>


                            {/* Device ID */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Device ID
                                </div>

                                <div className="fw-semibold">
                                    {record.device_id || "—"}
                                </div>

                            </div>


                            {/* Time multiplier */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Time multiplier
                                </div>

                                <div className="fw-semibold">

                                    {record.time_multiplier ?? "—"}

                                </div>

                            </div>


                            {/* CFG */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Arquivo CFG
                                </div>

                                <div className="fw-semibold">

                                    {record.cfg_filename || "—"}

                                </div>

                            </div>


                            {/* DAT */}

                            <div className="col-md-3">

                                <div className="text-muted small">
                                    Arquivo DAT
                                </div>

                                <div className="fw-semibold">

                                    {record.dat_filename || "—"}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ============================================================
                    ARQUIVOS COMTRADE
                   ============================================================ */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white border-0 py-3">

                        <div className="d-flex align-items-center">

                            <Icon
                                path={mdiFileDocumentOutline}
                                size={1}
                                className="text-primary me-2"
                            />

                            <div>

                                <div className="fw-semibold">
                                    Arquivos COMTRADE
                                </div>

                                <div className="small text-muted">
                                    Arquivos utilizados no registro
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="row g-3">


                            {/* CFG */}

                            <div className="col-md-6">

                                <div className="border rounded p-3">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="d-flex align-items-center">

                                            <Icon
                                                path={mdiFileDocumentOutline}
                                                size={1}
                                                className="text-primary me-2"
                                            />

                                            <div>

                                                <div className="fw-semibold">
                                                    {record.cfg_filename || "Arquivo CFG"}
                                                </div>

                                                <div className="small text-muted">
                                                    Configuração COMTRADE
                                                </div>

                                            </div>

                                        </div>

                                        <a
                                            href={`/api/v1/comtrade/${record.id}/files/cfg`}
                                            className="btn btn-sm btn-outline-primary"
                                            title="Download"
                                        >
                                            <Icon
                                                path={mdiDownloadOutline}
                                                size={0.8}
                                            />
                                        </a>

                                    </div>

                                </div>

                            </div>


                            {/* DAT */}

                            <div className="col-md-6">

                                <div className="border rounded p-3">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="d-flex align-items-center">

                                            <Icon
                                                path={mdiDatabaseOutline}
                                                size={1}
                                                className="text-primary me-2"
                                            />

                                            <div>

                                                <div className="fw-semibold">
                                                    {record.dat_filename || "Arquivo DAT"}
                                                </div>

                                                <div className="small text-muted">
                                                    Dados das amostras
                                                </div>

                                            </div>

                                        </div>

                                        <a
                                            href={`/api/v1/comtrade/${record.id}/files/dat`}
                                            className="btn btn-sm btn-outline-primary"
                                            title="Download"
                                        >
                                            <Icon
                                                path={mdiDownloadOutline}
                                                size={0.8}
                                            />
                                        </a>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ============================================================
                    RODAPÉ
                   ============================================================ */}

                <div className="d-flex justify-content-between align-items-center">

                    <div className="small text-muted">

                        Registro #{record.id}

                    </div>

                    <a
                        href="/oscillography"
                        className="btn btn-outline-secondary"
                    >

                        <Icon
                            path={mdiArrowLeft}
                            size={0.8}
                            className="me-1"
                        />

                        Voltar para Oscilografias

                    </a>

                </div>


            </div>

        </LayoutAdmin>

    );
}

