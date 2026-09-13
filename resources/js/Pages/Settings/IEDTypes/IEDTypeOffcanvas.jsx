import React from "react";
import { Offcanvas } from "react-bootstrap";
import IEDTypeForm from "./IEDTypeForm";

export default function IEDTypeOffcanvas({
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
          {type ? "Editar Tipo de IED" : "Novo Tipo de IED"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <IEDTypeForm
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
