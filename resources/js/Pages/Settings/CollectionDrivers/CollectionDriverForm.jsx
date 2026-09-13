import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";

export default function CollectionDriverForm({
  driver = null,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    category: "protocol",
    description: "",
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        driver
          ? {
              code: driver.code || "",
              name: driver.name || "",
              category: driver.category || "protocol",
              description: driver.description || "",
              enabled: Boolean(driver.enabled),
            }
          : { code: "", name: "", category: "protocol", description: "", enabled: true },
      ),
    [driver],
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
    if (!form.code.trim() || !form.name.trim())
      return toast.error("Preencha o código técnico e o nome do Driver.");
    if (!/^[a-z0-9_-]+$/.test(form.code.trim()))
      return toast.error(
        "O código deve conter apenas letras minúsculas, números, hífen ou sublinhado.",
      );
    setSaving(true);
    try {
      const response = await fetch(
        driver
          ? `/api/v1/collection-drivers/${driver.id}/update`
          : "/api/v1/collection-drivers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            code: form.code.trim(),
            name: form.name.trim(),
            category: form.category,
            description: form.description.trim(),
            enabled: form.enabled,
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(
          result.mensagem || "Não foi possível salvar o Driver de Coleta.",
        );
      toast.success(result.mensagem || "Driver de Coleta salvo com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar o Driver de Coleta.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3">
          <label className="form-label">Código técnico *</label>
          <input
            className="form-control"
            name="code"
            value={form.code}
            onChange={change}
            placeholder="ex.: iec61850"
            required
          />
          <div className="form-text">
            Identificador utilizado internamente pelo Agent.
          </div>
        </div>
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
        <div className="mb-3">
          <label className="form-label">Categoria *</label>
          <select
            className="form-select"
            name="category"
            value={form.category}
            onChange={change}
            required
          >
            <option value="protocol">Protocolo</option>
            <option value="service">Serviço / Capacidade</option>
            <option value="integration">Integração</option>
            <option value="strategy">Estratégia de Coleta</option>
            <option value="utility">Utilitário</option>
            <option value="none">Sem Driver</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={form.description}
            onChange={change}
          />
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="collection-driver-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label
            className="form-check-label"
            htmlFor="collection-driver-enabled"
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
