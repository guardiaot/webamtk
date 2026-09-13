import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

export default function IEDTemplateForm({
  template = null,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({
    ied_type_id: "",
    default_driver_id: "",
    name: "",
    manufacturer: "",
    model: "",
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        template
          ? {
              ied_type_id: String(template.ied_type_id || ""),
              default_driver_id: String(template.default_driver_id || ""),
              name: template.name || "",
              manufacturer: template.manufacturer || "",
              model: template.model || "",
              enabled: Boolean(template.enabled),
            }
          : {
              ied_type_id: "",
              default_driver_id: "",
              name: "",
              manufacturer: "",
              model: "",
              enabled: true,
            },
      ),
    [template],
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
      !form.ied_type_id ||
      !form.name.trim() ||
      !form.manufacturer.trim() ||
      !form.model.trim()
    )
      return toast.error("Preencha tipo de IED, nome, fabricante e modelo.");
    setSaving(true);
    try {
      const response = await fetch(
        template
          ? `/api/v1/ied-templates/${template.id}/update`
          : "/api/v1/ied-templates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            ied_type_id: form.ied_type_id,
            default_driver_id: form.default_driver_id || null,
            name: form.name.trim(),
            manufacturer: form.manufacturer.trim(),
            model: form.model.trim(),
            enabled: form.enabled,
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(
          result.mensagem || "Não foi possível salvar o Template de IED.",
        );
      toast.success(result.mensagem || "Template de IED salvo com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar o Template de IED.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3">
          <label className="form-label">Tipo de IED *</label>
          <AjaxSumoSelect
            url="/api/v1/ied-types/simples"
            params={
              template?.ied_type_id ? { include_id: template.ied_type_id } : {}
            }
            value={form.ied_type_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                ied_type_id: event.value || "",
              }))
            }
            valueField="id"
            labelField="name"
            placeholder="Selecione o tipo de IED"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Driver de Coleta padrão</label>
          <AjaxSumoSelect
            url="/api/v1/collection-drivers/simples"
            params={
              template?.default_driver_id
                ? { include_id: template.default_driver_id }
                : {}
            }
            value={form.default_driver_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                default_driver_id: event.value || "",
              }))
            }
            valueField="id"
            labelField="name"
            placeholder="Selecione o Driver de Coleta"
          />
          <div className="form-text">
            Opcional. Será usado como Driver padrão para os IEDs deste
            Template.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Nome do Template *</label>
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
          <label className="form-label">Fabricante *</label>
          <input
            className="form-control"
            name="manufacturer"
            value={form.manufacturer}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Modelo *</label>
          <input
            className="form-control"
            name="model"
            value={form.model}
            onChange={change}
            required
          />
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="ied-template-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label className="form-check-label" htmlFor="ied-template-enabled">
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
