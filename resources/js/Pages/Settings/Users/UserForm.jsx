import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import toast from "react-hot-toast";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

const empty = {
  name: "",
  email: "",
  enabled: true,
  password: "",
  password_confirmation: "",
  role_ids: [],
};

export default function UserForm({ user, onCancel, onSuccess }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(user);

  useEffect(
    () =>
      setForm(
        user
          ? {
              name: user.name || "",
              email: user.email || "",
              enabled: Boolean(user.enabled),
              password: "",
              password_confirmation: "",
              role_ids: (user.roles || []).map((role) => String(role.id)),
            }
          : { ...empty },
      ),
    [user],
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
      !form.name.trim() ||
      !form.email.trim() ||
      !form.role_ids.length ||
      (!editing && !form.password)
    )
      return toast.error(
        "Preencha nome, e-mail, senha (na criação) e pelo menos um perfil.",
      );
    if (form.password !== form.password_confirmation)
      return toast.error("A confirmação da senha não confere.");
    setSaving(true);
    try {
      const response = await fetch(
        editing ? `/api/v1/users/${user.id}/update` : "/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
          }),
        },
      );
      const result = await response.json();
      const payload = result?.data || result;
      if (!response.ok || payload.erro === 1)
        throw new Error(
          payload.mensagem || "Não foi possível salvar o usuário.",
        );
      toast.success(payload.mensagem || "Usuário salvo com sucesso.");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar usuário.");
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
        <div className="mb-3">
          <label className="form-label">E-mail *</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Perfis *</label>
          <AjaxSumoSelect
            url="/api/v1/roles/simples"
            value={form.role_ids}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role_ids: (event.values || []).map(String),
              }))
            }
            valueField="id"
            labelField="name"
            multiple
            placeholder="Selecione os perfis"
          />
        </div>
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={change}
            id="user-enabled"
          />
          <label className="form-check-label" htmlFor="user-enabled">
            Ativo
          </label>
        </div>
        <div className="border-top pt-3">
          <div className="fw-semibold mb-3">
            {editing ? "Alterar senha (opcional)" : "Senha"}
          </div>
          <div className="mb-3">
            <label className="form-label">Senha {!editing && "*"}</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              required={!editing}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Confirmar senha {!editing && "*"}
            </label>
            <input
              className="form-control"
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={change}
              required={!editing}
            />
          </div>
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
