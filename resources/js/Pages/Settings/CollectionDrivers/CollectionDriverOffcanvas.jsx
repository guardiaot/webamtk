import React from "react";
import { Offcanvas } from "react-bootstrap";
import CollectionDriverForm from "./CollectionDriverForm";

export default function CollectionDriverOffcanvas({
  show,
  driver = null,
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
          {driver ? "Editar Driver de Coleta" : "Novo Driver de Coleta"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <CollectionDriverForm
          driver={driver}
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
