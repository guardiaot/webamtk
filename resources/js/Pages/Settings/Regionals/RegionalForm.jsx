import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const empty = { owner_id: "", name: "", abbreviation: "", enabled: true };

export default function RegionalForm({ regional = null, onCancel, onSuccess }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        regional
          ? {
              owner_id: String(regional.owner_id || ""),
              name: regional.name || "",
              abbreviation: regional.abbreviation || "",
              enabled: Boolean(regional.enabled),
            }
          : { ...empty },
      ),
    [regional],
  );
  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!form.owner_id || !form.name.trim())
      return toast.error(
        "Selecione o proprietário e informe o nome da regional.",
      );
    setSaving(true);
    try {
      const response = await fetch(
        regional
          ? `/api/v1/regionals/${regional.id}/update`
          : "/api/v1/regionals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            ...form,
            owner_id: form.owner_id,
            name: form.name.trim(),
            abbreviation: form.abbreviation.trim(),
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(
          result.mensagem || "Não foi possível salvar a regional.",
        );
      toast.success(result.mensagem || "Regional salva com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar regional.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3">
          <label className="form-label">Proprietário *</label>
          <AjaxSumoSelect
            url="/api/v1/owners/simples"
            params={regional?.owner_id ? { include_id: regional.owner_id } : {}}
            value={form.owner_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                owner_id: event.value || "",
              }))
            }
            valueField="id"
            labelField="name"
            placeholder="Selecione o proprietário"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome da Regional *</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={change}
            required
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Abreviação</label>
          <input
            className="form-control"
            name="abbreviation"
            value={form.abbreviation}
            onChange={change}
            maxLength={50}
          />
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="regional-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label className="form-check-label" htmlFor="regional-enabled">
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
