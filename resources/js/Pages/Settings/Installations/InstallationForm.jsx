import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const empty = {
  owner_id: "",
  regional_id: "",
  state_id: "",
  name: "",
  enabled: true,
};

export default function InstallationForm({
  installation = null,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        installation
          ? {
              owner_id: String(installation.owner_id || ""),
              regional_id: String(installation.regional_id || ""),
              state_id: String(installation.state_id || ""),
              name: installation.name || "",
              enabled: Boolean(installation.enabled),
            }
          : { ...empty },
      ),
    [installation],
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
    if (
      !form.owner_id ||
      !form.regional_id ||
      !form.state_id ||
      !form.name.trim()
    )
      return toast.error(
        "Preencha proprietário, regional, UF e nome da instalação.",
      );
    setSaving(true);
    try {
      const response = await fetch(
        installation
          ? `/api/v1/installations/${installation.id}/update`
          : "/api/v1/installations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            regional_id: form.regional_id,
            state_id: form.state_id,
            name: form.name.trim(),
            enabled: form.enabled,
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(
          result.mensagem || "Não foi possível salvar a instalação.",
        );
      toast.success(result.mensagem || "Instalação salva com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar instalação.");
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
            params={
              installation?.owner_id
                ? { include_id: installation.owner_id }
                : {}
            }
            value={form.owner_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                owner_id: event.value || "",
                regional_id: "",
              }))
            }
            valueField="id"
            labelField="name"
            placeholder="Selecione o proprietário"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Regional *</label>
          <AjaxSumoSelect
            url="/api/v1/regionals/simples"
            params={{
              ...(form.owner_id ? { owner_id: form.owner_id } : {}),
              ...(installation?.regional_id
                ? { include_id: installation.regional_id }
                : {}),
            }}
            dependencies={[form.owner_id]}
            value={form.regional_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                regional_id: event.value || "",
              }))
            }
            valueField="id"
            labelField="name"
            placeholder={
              form.owner_id
                ? "Selecione a regional"
                : "Selecione primeiro o proprietário"
            }
            disabled={!form.owner_id}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">UF *</label>
          <AjaxSumoSelect
            url="/api/v1/states/simples"
            value={form.state_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                state_id: event.value || "",
              }))
            }
            valueField="id"
            labelField="label"
            placeholder="Selecione a UF"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome da Instalação *</label>
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
            id="installation-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label className="form-check-label" htmlFor="installation-enabled">
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
