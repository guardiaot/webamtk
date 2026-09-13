
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

    const width = 1200;
    const height = 420;

    const padding = {
        top: 30,
        right: 30,
        bottom: 55,
        left: 65,
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    /*
     * Tempo
     *
     * O timestamp do COMTRADE está em microssegundos.
     * Convertendo para milissegundos:
     */
    const times = samples.map(
        (sample) => Number(sample.timestamp || 0) / 1000
    );

    const maxTime = Math.max(...times, 1);

    /*
     * Descobre o maior valor absoluto entre
     * todos os canais analógicos.
     */
    let maxValue = 1;

    samples.forEach((sample) => {
        (sample.analog_values || []).forEach((value) => {
            const numericValue = Math.abs(Number(value) || 0);

            if (numericValue > maxValue) {
                maxValue = numericValue;
            }
        });
    });

    /*
     * Adiciona uma margem de 10% na escala vertical.
     */
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

    /*
     * Cria a linha SVG de cada canal.
     */
    const createPath = (channelIndex) => {
        return samples
            .map((sample, index) => {
                const time =
                    Number(sample.timestamp || 0) / 1000;

                const value =
                    Number(
                        sample.analog_values?.[channelIndex] || 0
                    );

                const px = x(time);
                const py = y(value);

                return `${index === 0 ? 'M' : 'L'} ${px} ${py}`;
            })
            .join(' ');
    };

    /*
     * Gera divisões do eixo Y.
     */
    const yTicks = 6;

    /*
     * Gera divisões do eixo X.
     */
    const xTicks = 6;

    return (
        <div className="w-100">

            {/* Legenda */}
            <div className="d-flex flex-wrap gap-3 mb-3">

                {analogChannels.map((channel, index) => (
                    <div
                        key={channel.channel_number}
                        className="d-flex align-items-center gap-2"
                    >
                        <span
                            style={{
                                width: '24px',
                                height: '3px',
                                display: 'inline-block',
                                background:
                                    index === 0
                                        ? '#dc3545'
                                        : index === 1
                                            ? '#198754'
                                            : '#0d6efd',
                            }}
                        />

                        <span className="small">
                            {channel.name}

                            {channel.unit
                                ? ` (${channel.unit})`
                                : ''}
                        </span>
                    </div>
                ))}

            </div>

            <div
                style={{
                    width: '100%',
                    overflowX: 'auto',
                }}
            >
                <svg
                    viewBox={`0 0 ${width} ${height}`}
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

                    {/* Grade horizontal */}
                    {Array.from({
                        length: yTicks,
                    }).map((_, index) => {

                        const value =
                            maxValue -
                            ((maxValue - minValue) /
                                (yTicks - 1)) *
                                index;

                        const py = y(value);

                        return (
                            <g key={`y-${index}`}>

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

                    {/* Grade vertical */}
                    {Array.from({
                        length: xTicks,
                    }).map((_, index) => {

                        const time =
                            (maxTime /
                                (xTicks - 1)) *
                            index;

                        const px = x(time);

                        return (
                            <g key={`x-${index}`}>

                                <line
                                    x1={px}
                                    y1={padding.top}
                                    x2={px}
                                    y2={
                                        height -
                                        padding.bottom
                                    }
                                    stroke="#e9ecef"
                                    strokeWidth="1"
                                />

                                <text
                                    x={px}
                                    y={
                                        height -
                                        padding.bottom +
                                        25
                                    }
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#6c757d"
                                >
                                    {formatNumber(time)}
                                </text>

                            </g>
                        );
                    })}

                    {/* Linha zero */}
                    <line
                        x1={padding.left}
                        y1={y(0)}
                        x2={width - padding.right}
                        y2={y(0)}
                        stroke="#adb5bd"
                        strokeWidth="1.5"
                    />

                    {/* Formas de onda */}
                    {analogChannels.map(
                        (channel, index) => {

                            if (
                                !samples.some(
                                    (sample) =>
                                        sample.analog_values?.[
                                            index
                                        ] !== undefined
                                )
                            ) {
                                return null;
                            }

                            return (
                                <path
                                    key={
                                        channel.channel_number
                                    }
                                    d={createPath(index)}
                                    fill="none"
                                    stroke={
                                        index === 0
                                            ? '#dc3545'
                                            : index === 1
                                                ? '#198754'
                                                : '#0d6efd'
                                    }
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        }
                    )}

                    {/* Pontos das amostras */}
                    {samples.map(
                        (sample, sampleIndex) => {

                            const time =
                                Number(
                                    sample.timestamp || 0
                                ) / 1000;

                            return (
                                <g
                                    key={
                                        sample.sample_number
                                    }
                                >
                                    {analogChannels.map(
                                        (
                                            channel,
                                            channelIndex
                                        ) => {

                                            const value =
                                                Number(
                                                    sample
                                                        .analog_values?.[
                                                        channelIndex
                                                    ] || 0
                                                );

                                            return (
                                                <circle
                                                    key={`${sampleIndex}-${channelIndex}`}
                                                    cx={x(time)}
                                                    cy={y(value)}
                                                    r="3"
                                                    fill={
                                                        channelIndex ===
                                                        0
                                                            ? '#dc3545'
                                                            : channelIndex ===
                                                                1
                                                                ? '#198754'
                                                                : '#0d6efd'
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </g>
                            );
                        }
                    )}

                    {/* Eventos digitais */}
                    {samples.map((sample) => {

                        const time =
                            Number(
                                sample.timestamp || 0
                            ) / 1000;

                        const digitalValues =
                            sample.digital_values || [];

                        return digitalValues.map(
                            (state, index) => {

                                if (!state) {
                                    return null;
                                }

                                const px = x(time);

                                return (
                                    <line
                                        key={`digital-${sample.sample_number}-${index}`}
                                        x1={px}
                                        y1={
                                            padding.top
                                        }
                                        x2={px}
                                        y2={
                                            height -
                                            padding.bottom
                                        }
                                        stroke="#6f42c1"
                                        strokeWidth="1"
                                        strokeDasharray="5 4"
                                        opacity="0.7"
                                    />
                                );
                            }
                        );
                    })}

                    {/* Eixo X */}
                    <line
                        x1={padding.left}
                        y1={
                            height -
                            padding.bottom
                        }
                        x2={
                            width -
                            padding.right
                        }
                        y2={
                            height -
                            padding.bottom
                        }
                        stroke="#495057"
                    />

                    {/* Eixo Y */}
                    <line
                        x1={padding.left}
                        y1={padding.top}
                        x2={padding.left}
                        y2={
                            height -
                            padding.bottom
                        }
                        stroke="#495057"
                    />

                    {/* Label X */}
                    <text
                        x={width / 2}
                        y={height - 8}
                        textAnchor="middle"
                        fontSize="13"
                        fill="#495057"
                    >
                        Tempo (ms)
                    </text>

                    {/* Label Y */}
                    <text
                        x="15"
                        y={height / 2}
                        textAnchor="middle"
                        fontSize="13"
                        fill="#495057"
                        transform={`rotate(-90 15 ${
                            height / 2
                        })`}
                    >
                        Amplitude
                    </text>

                </svg>
            </div>

            {/* Informações */}
            <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">
                    {samples.length} amostras
                </small>

                <small className="text-muted">
                    Janela: 0 até {formatNumber(maxTime)} ms
                </small>
            </div>

        </div>
    );
}

