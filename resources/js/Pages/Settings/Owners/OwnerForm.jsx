import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import toast from "react-hot-toast";
import { mdiLoading } from "@mdi/js";

const emptyForm = {
  name: "",
  ons_name: "",
  ons_ftp_folder: "",
  enabled: true,
};

export default function OwnerForm({ owner = null, onCancel, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      owner
        ? {
            name: owner.name || "",
            ons_name: owner.ons_name || "",
            ons_ftp_folder: owner.ons_ftp_folder || "",
            enabled: Boolean(owner.enabled),
          }
        : { ...emptyForm },
    );
  }, [owner]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      toast.error("Informe o nome do proprietário.");
      return;
    }

    try {
      setSaving(true);
      const url = owner
        ? `/api/v1/owners/${owner.id}/update`
        : "/api/v1/owners";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          ...form,
          name,
          ons_name: form.ons_name.trim(),
          ons_ftp_folder: form.ons_ftp_folder.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status} ao salvar proprietário.`);
      }

      const result = await response.json();
      if (result.erro === 1) {
        throw new Error(
          result.mensagem || "Não foi possível salvar o proprietário.",
        );
      }

      toast.success(result.mensagem || "Proprietário salvo com sucesso.");
      onSuccess?.(result);
    } catch (error) {
      toast.error(error.message || "Erro inesperado ao salvar proprietário.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <div className="mb-3">
          <label className="form-label" htmlFor="owner-name">
            Nome *
          </label>
          <input
            id="owner-name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            autoFocus
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="owner-ons-name">
            Nome ONS
          </label>
          <input
            id="owner-ons-name"
            name="ons_name"
            className="form-control"
            value={form.ons_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="owner-ons-folder">
            Pasta FTP ONS
          </label>
          <input
            id="owner-ons-folder"
            name="ons_ftp_folder"
            className="form-control"
            value={form.ons_ftp_folder}
            onChange={handleChange}
          />
        </div>
        <div className="form-check form-switch">
          <input
            id="owner-enabled"
            name="enabled"
            className="form-check-input"
            type="checkbox"
            checked={form.enabled}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="owner-enabled">
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
