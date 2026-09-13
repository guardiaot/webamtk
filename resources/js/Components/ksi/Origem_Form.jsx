import React from "react";

export default function Origem_Form({
    fields = [],
    data = {},
    setData,
    errors = {},
}) {
    const inputTypes = {
        telefone: "text",
        celular: "text",
        cep: "text",
        cpf: "text",
        cnpj: "text",
        cpfcnpj: "text",
        moeda: "text",
        decimal: "number",
        percentual: "number",
    };
    const handleChange = (field, e) => {
        let value = e.target.value;
        if (field.upper)
            value = value.toUpperCase();
        if (field.lower)
            value = value.toLowerCase();
        if (field.trim)
            value = value.trimStart();
        setData(field.name, value);
        field.onChange?.(value, data, setData);
    };
    return (
        <div className="row">
            {fields.map((field) => {
                if (field.hidden)
                    return null;
                const col = field.col ?? 12;
                return (
                    <div
                        key={field.name}
                        className={`col-md-${col} ${field.colClass ?? ""} mb-3`}
                    >
                        {field.label && (
                            <label className="form-label">
                                {field.label}
                                {field.required &&
                                    <span className="text-danger ms-1">*</span>
                                }
                            </label>
                        )}
                        {field.type === "textarea" && (
                            <textarea
                                rows={field.rows ?? 3}
                                className={`form-control ${field.className ?? ""}`}
                                value={data[field.name] ?? ""}
                                placeholder={field.placeholder}
                                disabled={field.disabled}
                                readOnly={field.readOnly}
                                required={field.required}
                                autoFocus={field.autoFocus}
                                onBlur={(e) =>
                                    field.onBlur?.(e, data, setData)
                                }
                                onChange={(e) =>
                                    handleChange(field, e)
                                }
                            />
                        )}
                        {field.type === "select" && (
                            <select
                                className={`form-select ${field.className ?? ""}`}
                                value={data[field.name] ?? ""}
                                disabled={field.disabled}
                                required={field.required}
                                onBlur={(e) =>
                                    field.onBlur?.(e, data, setData)
                                }
                                onChange={(e) =>
                                    handleChange(field, e)
                                }
                            >
                                {(field.options ?? []).map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {field.type !== "textarea" &&
                            field.type !== "select" && (
                                <input
                                    type={
                                        inputTypes[field.type] ??
                                        field.type ??
                                        "text"
                                    }
                                    className={`form-control ${field.className ?? ""}`}
                                    value={data[field.name] ?? ""}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled}
                                    readOnly={field.readOnly}
                                    required={field.required}
                                    autoFocus={field.autoFocus}
                                    maxLength={field.maxLength}
                                    minLength={field.minLength}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                    onBlur={(e) =>
                                        field.onBlur?.(e, data, setData)
                                    }
                                    onChange={(e) =>
                                        handleChange(field, e)
                                    }
                                />
                            )}
                        {field.help && (
                            <small className="text-muted">
                                {field.help}
                            </small>
                        )}
                        {errors[field.name] && (
                            <div className="text-danger small mt-1">
                                {errors[field.name]}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}