import React from "react";
import { Offcanvas } from "react-bootstrap";
import InstallationForm from "./InstallationForm";

export default function InstallationOffcanvas({
  show,
  installation = null,
  onHide,
  onSaved,
}) {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "720px", maxWidth: "100vw" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {installation ? "Editar Instalação" : "Nova Instalação"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <InstallationForm
          installation={installation}
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
