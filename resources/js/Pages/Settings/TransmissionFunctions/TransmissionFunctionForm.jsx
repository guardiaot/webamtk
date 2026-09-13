import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const empty = {
  owner_id: "",
  regional_id: "",
  installation_id: "",
  type_id: "",
  name: "",
  enabled: true,
  line_parameters: {
    voltage_level: "",
    nominal_current: "",
    line_length_km: "",
    infeed: false,
    r1: "",
    r0: "",
    x1: "",
    x0: "",
  },
  risk_sections: [],
};

export default function TransmissionFunctionForm({
  transmissionFunction = null,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        transmissionFunction
          ? {
              owner_id: String(transmissionFunction.owner_id || ""),
              regional_id: String(transmissionFunction.regional_id || ""),
              installation_id: String(
                transmissionFunction.installation_id || "",
              ),
              type_id: String(transmissionFunction.type_id || ""),
              name: transmissionFunction.name || "",
              enabled: Boolean(transmissionFunction.enabled),
              line_parameters: transmissionFunction.line_parameters
                ? {
                    ...empty.line_parameters,
                    ...transmissionFunction.line_parameters,
                  }
                : { ...empty.line_parameters },
              risk_sections: Array.isArray(transmissionFunction.risk_sections)
                ? transmissionFunction.risk_sections.map((section) => ({
                    id: section.id,
                    km_start: section.km_start ?? "",
                    km_end: section.km_end ?? "",
                  }))
                : [],
            }
          : { ...empty },
      ),
    [transmissionFunction],
  );

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const changeLineParameter = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      line_parameters: {
        ...current.line_parameters,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };
  const changeRiskSection = (index, field, value) =>
    setForm((current) => ({
      ...current,
      risk_sections: current.risk_sections.map((section, currentIndex) =>
        currentIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  const addRiskSection = () =>
    setForm((current) => ({
      ...current,
      risk_sections: [...current.risk_sections, { km_start: "", km_end: "" }],
    }));
  const removeRiskSection = (index) =>
    setForm((current) => ({
      ...current,
      risk_sections: current.risk_sections.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  const submit = async (event) => {
    event.preventDefault();
    if (
      form.risk_sections.some(
        (section) =>
          !String(section.km_start ?? "").trim() ||
          !String(section.km_end ?? "").trim(),
      )
    )
      return toast.error(
        "Preencha o km inicial e final de todos os trechos de alto risco.",
      );
    const hasLineParameters = Object.entries(form.line_parameters).some(
      ([key, value]) =>
        key === "infeed" ? value : String(value ?? "").trim() !== "",
    );
    if (
      !form.owner_id ||
      !form.regional_id ||
      !form.installation_id ||
      !form.type_id ||
      !form.name.trim()
    )
      return toast.error(
        "Preencha proprietário, regional, instalação, tipo e nome da função.",
      );
    setSaving(true);
    try {
      const response = await fetch(
        transmissionFunction
          ? `/api/v1/transmission-functions/${transmissionFunction.id}/update`
          : "/api/v1/transmission-functions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            installation_id: form.installation_id,
            type_id: form.type_id,
            name: form.name.trim(),
            enabled: form.enabled,
            line_parameters: hasLineParameters ? form.line_parameters : null,
            risk_sections: form.risk_sections.map((section) => ({
              km_start: section.km_start,
              km_end: section.km_end,
            })),
          }),
        },
      );
      const json = await response.json();
      const result = json.data || json;
      if (!response.ok || result.erro === 1)
        throw new Error(
          result.mensagem || "Não foi possível salvar a Função de Transmissão.",
        );

      toast.success(
        result.mensagem || "Função de Transmissão salva com sucesso.",
      );
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar a Função de Transmissão.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <h6 className="border-bottom pb-2">Dados da Função</h6>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Proprietário *</label>
            <AjaxSumoSelect
              url="/api/v1/owners/simples"
              params={
                transmissionFunction?.owner_id
                  ? { include_id: transmissionFunction.owner_id }
                  : {}
              }
              value={form.owner_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  owner_id: event.value || "",
                  regional_id: "",
                  installation_id: "",
                }))
              }
              valueField="id"
              labelField="name"
              placeholder="Selecione o proprietário"
            />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Regional *</label>
            <AjaxSumoSelect
              url="/api/v1/regionals/simples"
              params={
                form.owner_id
                  ? {
                      owner_id: form.owner_id,
                      ...(transmissionFunction?.regional_id
                        ? {
                            include_id: transmissionFunction.regional_id,
                          }
                        : {}),
                    }
                  : {}
              }
              dependencies={[form.owner_id]}
              value={form.regional_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  regional_id: event.value || "",
                  installation_id: "",
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
        </div>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Instalação *</label>
            <AjaxSumoSelect
              url="/api/v1/installations/simples"
              params={
                form.regional_id
                  ? {
                      regional_id: form.regional_id,
                      ...(transmissionFunction?.installation_id
                        ? {
                            include_id: transmissionFunction.installation_id,
                          }
                        : {}),
                    }
                  : {}
              }
              dependencies={[form.regional_id]}
              value={form.installation_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  installation_id: event.value || "",
                }))
              }
              valueField="id"
              labelField="name"
              placeholder={
                form.regional_id
                  ? "Selecione a instalação"
                  : "Selecione primeiro a regional"
              }
              disabled={!form.regional_id}
            />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Tipo de Função *</label>
            <AjaxSumoSelect
              url="/api/v1/transmission-function-types/simples"
              params={
                transmissionFunction?.type_id
                  ? {
                      include_id: transmissionFunction.type_id,
                    }
                  : {}
              }
              value={form.type_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  type_id: event.value || "",
                }))
              }
              valueField="id"
              labelField="name"
              placeholder="Selecione o tipo"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Nome da Função *</label>
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
            id="transmission-function-enabled"
            name="enabled"
            checked={form.enabled}
            onChange={change}
          />
          <label
            className="form-check-label"
            htmlFor="transmission-function-enabled"
          >
            Ativo
          </label>
        </div>
        <h6 className="border-bottom pb-2 mt-4">
          Parâmetros da Linha de Transmissão
        </h6>
        <div className="text-muted small mb-3">
          Preencha os parâmetros técnicos quando aplicáveis à função cadastrada.
        </div>
        <div className="row g-3">
          {[
            ["voltage_level", "Nível de Tensão"],
            ["nominal_current", "Corrente Nominal"],
            ["line_length_km", "Comprimento da LT (km)"],
            ["r1", "R1 - Sequência Positiva"],
            ["r0", "R0 - Sequência Zero"],
            ["x1", "X1 - Sequência Positiva"],
            ["x0", "X0 - Sequência Zero"],
          ].map(([name, label]) => (
            <div className="col-md-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-control"
                name={name}
                value={form.line_parameters[name]}
                onChange={changeLineParameter}
                inputMode="decimal"
              />
            </div>
          ))}
          <div className="col-12">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="transmission-function-infeed"
                name="infeed"
                checked={form.line_parameters.infeed}
                onChange={changeLineParameter}
              />
              <label
                className="form-check-label"
                htmlFor="transmission-function-infeed"
              >
                INFEED
              </label>
            </div>
          </div>
        </div>
        <h6 className="border-bottom pb-2 mt-4">Trechos de Alto Risco</h6>
        {form.risk_sections.length === 0 ? (
          <div className="text-muted small mb-3">
            Nenhum trecho de alto risco cadastrado.
          </div>
        ) : (
          form.risk_sections.map((section, index) => (
            <div
              className="row g-2 align-items-end mb-2"
              key={section.id || index}
            >
              <div className="col">
                <label className="form-label">Km inicial</label>
                <input
                  className="form-control"
                  value={section.km_start}
                  onChange={(event) =>
                    changeRiskSection(index, "km_start", event.target.value)
                  }
                  inputMode="decimal"
                />
              </div>
              <div className="col">
                <label className="form-label">Km final</label>
                <input
                  className="form-control"
                  value={section.km_end}
                  onChange={(event) =>
                    changeRiskSection(index, "km_end", event.target.value)
                  }
                  inputMode="decimal"
                />
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeRiskSection(index)}
                  disabled={saving}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={addRiskSection}
          disabled={saving}
        >
          Adicionar trecho
        </button>
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
