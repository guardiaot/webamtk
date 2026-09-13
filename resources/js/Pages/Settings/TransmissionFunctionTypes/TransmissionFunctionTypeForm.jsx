import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";

export default function TransmissionFunctionTypeForm({
  type = null,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({ name: "", enabled: true });
  const [saving, setSaving] = useState(false);

  useEffect(
    () =>
      setForm(
        type
          ? { name: type.name || "", enabled: Boolean(type.enabled) }
          : { name: "", enabled: true },
      ),
    [type],
  );

  const change = (event) => {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim())
      return toast.error("Informe o nome do Tipo de Função de Transmissão.");
    setSaving(true);
    try {
      const response = await fetch(
        type
          ? `/api/v1/transmission-function-types/${type.id}/update`
          : "/api/v1/transmission-function-types",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            enabled: form.enabled,
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(result.mensagem || "Não foi possível salvar o tipo.");
      toast.success(result.mensagem || "Tipo salvo com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar o tipo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3">
          <label className="form-label">Nome *</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={change}
            required
            autoFocus
          />
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="transmission-function-type-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label
            className="form-check-label"
            htmlFor="transmission-function-type-enabled"
          >
            Ativo
          </label>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 pt-4 mt-4 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving && (
            <Icon path={mdiLoading} size={0.75} spin className="me-1" />
          )}
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
