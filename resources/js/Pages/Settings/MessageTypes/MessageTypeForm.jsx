import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";

export default function MessageTypeForm({ type = null, onCancel, onSuccess }) {
  const [form, setForm] = useState({ code: "", name: "", enabled: true });
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(type ? { code: type.code || "", name: type.name || "", enabled: Boolean(type.enabled) } : { code: "", name: "", enabled: true }), [type]);
  const change = (event) => {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({ ...current, [name]: inputType === "checkbox" ? checked : value }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return toast.error("Preencha o código e o nome do Tipo de Mensagem.");
    if (!/^[a-z0-9_-]+$/.test(form.code.trim())) return toast.error("O código deve conter apenas letras minúsculas, números, hífen ou sublinhado.");
    setSaving(true);
    try {
      const response = await fetch(type ? `/api/v1/message-types/${type.id}/update` : "/api/v1/message-types", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" }, body: JSON.stringify({ code: form.code.trim(), name: form.name.trim(), enabled: form.enabled }) });
      const json = await response.json(); const result = json.data || json;
      if (!response.ok || result.erro === 1) throw new Error(result.mensagem || "Não foi possível salvar o Tipo de Mensagem.");
      toast.success(result.mensagem || "Tipo de Mensagem salvo com sucesso."); onSuccess?.();
    } catch (error) { toast.error(error.message || "Erro ao salvar o Tipo de Mensagem."); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3"><label className="form-label">Código *</label><input className="form-control" name="code" value={form.code} onChange={change} placeholder="ex.: critical" required /></div>
        <div className="mb-3"><label className="form-label">Nome *</label><input className="form-control" name="name" value={form.name} onChange={change} required autoFocus /></div>
        <div className="form-check form-switch"><input className="form-check-input" type="checkbox" id="message-type-enabled" name="enabled" checked={form.enabled} onChange={change} /><label className="form-check-label" htmlFor="message-type-enabled">Ativo</label></div>
      </div>
      <div className="d-flex justify-content-end gap-2 pt-4 mt-4 border-top"><button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving && <Icon path={mdiLoading} size={0.75} spin className="me-1" />}{saving ? "Salvando..." : "Salvar"}</button></div>
    </form>
  );
}
