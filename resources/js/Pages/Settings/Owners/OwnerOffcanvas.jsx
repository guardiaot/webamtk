import React from "react";
import { Offcanvas } from "react-bootstrap";
import OwnerForm from "./OwnerForm";

export default function OwnerOffcanvas({
  show,
  owner = null,
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
          {owner ? "Editar Proprietário" : "Novo Proprietário"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <OwnerForm
          owner={owner}
          onCancel={onHide}
          onSuccess={(result) => {
            onSaved?.(result);
            onHide?.();
          }}
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
