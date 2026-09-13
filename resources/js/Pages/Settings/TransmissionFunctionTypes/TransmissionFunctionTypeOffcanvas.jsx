import React from "react";
import { Offcanvas } from "react-bootstrap";
import TransmissionFunctionTypeForm from "./TransmissionFunctionTypeForm";

export default function TransmissionFunctionTypeOffcanvas({
  show,
  type = null,
  onHide,
  onSaved,
}) {
  return (
    <Offcanvas
      show={Boolean(show)}
      onHide={onHide}
      placement="end"
      style={{ width: "720px", maxWidth: "100vw" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {type
            ? "Editar Tipo de Função de Transmissão"
            : "Novo Tipo de Função de Transmissão"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <TransmissionFunctionTypeForm
          type={type}
          onCancel={onHide}
          onSuccess={() => {
            onSaved?.();
            onHide?.();
          }}
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
