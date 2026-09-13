import React from "react";
import { Offcanvas } from "react-bootstrap";
import IEDTemplateForm from "./IEDTemplateForm";

export default function IEDTemplateOffcanvas({
  show,
  template = null,
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
          {template ? "Editar Template de IED" : "Novo Template de IED"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <IEDTemplateForm
          template={template}
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
