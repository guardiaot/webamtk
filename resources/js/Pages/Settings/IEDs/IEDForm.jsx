import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const empty = {
  code: "",
  name: "",
  manufacturer: "",
  model: "",
  owner_id: "",
  regional_id: "",
  installation_id: "",
  transmission_function_id: "",
  ied_template_id: "",
  driver_override_id: "",
  host: "",
  port: "102",
};

export default function IEDForm({ ied = null, onCancel, onSuccess }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        ied
          ? {
              ...empty,
              code: ied.code || "",
              name: ied.name || "",
              manufacturer: ied.manufacturer || "",
              model: ied.model || "",
              owner_id: String(ied.owner_id || ""),
              regional_id: String(ied.regional_id || ""),
              installation_id: String(ied.installation_id || ""),
              transmission_function_id: String(
                ied.transmission_function_id || "",
              ),
              ied_template_id: String(ied.ied_template_id || ""),
              driver_override_id: String(ied.driver_override_id || ""),
              host: ied.host || "",
              port: String(ied.port || ""),
            }
          : { ...empty },
      ),
    [ied],
  );
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const select = (name, value, clear = {}) =>
    setForm((current) => ({ ...current, [name]: value || "", ...clear }));
  const include = (key) => (ied?.[key] ? { include_id: ied[key] } : {});
  const submit = async (event) => {
    event.preventDefault();
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.host.trim() ||
      !form.port
    )
      return toast.error("Preencha código, nome, host e porta.");
    setSaving(true);
    try {
      const response = await fetch(
        ied ? `/api/v1/ieds/${ied.id}/update` : "/api/v1/ieds",
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
            manufacturer: form.manufacturer.trim(),
            model: form.model.trim(),
            host: form.host.trim(),
            port: Number(form.port),
            transmission_function_id: form.transmission_function_id || null,
            ied_template_id: form.ied_template_id || null,
            driver_override_id: form.driver_override_id || null,
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(result.mensagem || "Não foi possível salvar o IED.");
      toast.success(result.mensagem || "IED salvo com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar IED.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <h6 className="border-bottom pb-2">Identificação</h6>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Código *</label>
            <input
              className="form-control"
              name="code"
              value={form.code}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nome *</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fabricante</label>
            <input
              className="form-control"
              name="manufacturer"
              value={form.manufacturer}
              onChange={change}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Modelo</label>
            <input
              className="form-control"
              name="model"
              value={form.model}
              onChange={change}
            />
          </div>
        </div>
        <h6 className="border-bottom pb-2">Hierarquia</h6>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Template de IED</label>
            <AjaxSumoSelect
              url="/api/v1/ied-templates/simples"
              params={include("ied_template_id")}
              value={form.ied_template_id}
              onChange={(e) => select("ied_template_id", e.value)}
              valueField="id"
              labelField="name"
              placeholder="Selecione o Template de IED"
            />
            <div className="form-text">
              Opcional. Define o perfil padrão do equipamento.
            </div>
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Proprietário</label>
            <AjaxSumoSelect
              url="/api/v1/owners/simples"
              params={include("owner_id")}
              value={form.owner_id}
              onChange={(e) =>
                select("owner_id", e.value, {
                  regional_id: "",
                  installation_id: "",
                  transmission_function_id: "",
                })
              }
              valueField="id"
              labelField="name"
              placeholder="Selecione o proprietário"
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">Regional</label>
            <AjaxSumoSelect
              url="/api/v1/regionals/simples"
              params={
                form.owner_id
                  ? { owner_id: form.owner_id, ...include("regional_id") }
                  : {}
              }
              dependencies={[form.owner_id]}
              value={form.regional_id}
              onChange={(e) =>
                select("regional_id", e.value, {
                  installation_id: "",
                  transmission_function_id: "",
                })
              }
              valueField="id"
              labelField="name"
              placeholder="Selecione a regional"
              disabled={!form.owner_id}
            />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label">Instalação</label>
            <AjaxSumoSelect
              url="/api/v1/installations/simples"
              params={
                form.regional_id
                  ? {
                      regional_id: form.regional_id,
                      ...include("installation_id"),
                    }
                  : {}
              }
              dependencies={[form.regional_id]}
              value={form.installation_id}
              onChange={(e) =>
                select("installation_id", e.value, {
                  transmission_function_id: "",
                })
              }
              valueField="id"
              labelField="name"
              placeholder="Selecione a instalação"
              disabled={!form.regional_id}
            />
          </div>
          <div className="mb-4 col-md-4">
            <label className="form-label">Função de Transmissão</label>
            <AjaxSumoSelect
              url="/api/v1/transmission-functions/simples"
              params={
                form.installation_id
                  ? {
                      installation_id: form.installation_id,
                      ...include("transmission_function_id"),
                    }
                  : {}
              }
              dependencies={[form.installation_id]}
              value={form.transmission_function_id}
              onChange={(e) => select("transmission_function_id", e.value)}
              valueField="id"
              labelField="name"
              placeholder="Selecione a função"
              disabled={!form.installation_id}
            />
          </div>
        </div>
        <h6 className="border-bottom pb-2">Comunicação</h6>
        <div className="mb-3">
          <label className="form-label">Driver de Coleta (override)</label>
          <AjaxSumoSelect
            url="/api/v1/collection-drivers/simples"
            params={include("driver_override_id")}
            value={form.driver_override_id}
            onChange={(e) => select("driver_override_id", e.value)}
            valueField="id"
            labelField="name"
            placeholder="Usar Driver padrão do Template"
          />
          <div className="form-text">
            Opcional. Se não informado, será utilizado o Driver padrão definido
            no Template de IED.
          </div>
          {ied && (
            <div className="small text-muted mt-2">
              Driver efetivo: {ied.effective_driver_name || "não definido"}
            </div>
          )}
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <label className="form-label">Host / IP *</label>
            <input
              className="form-control"
              name="host"
              value={form.host}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Porta *</label>
            <input
              className="form-control"
              type="number"
              name="port"
              min="1"
              max="65535"
              value={form.port}
              onChange={change}
              required
            />
          </div>
        </div>
        {ied && (
          <>
            <h6 className="border-bottom pb-2">Estado operacional</h6>
            <div className="small text-muted mb-3">
              Status, comunicação, latência e contadores são atualizados pelo
              Agent e não podem ser editados aqui.
            </div>
          </>
        )}
      </div>
      <div className="d-flex justify-content-end gap-2 pt-4 mt-3 border-top">
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
