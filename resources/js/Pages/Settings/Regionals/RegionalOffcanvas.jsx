import React from "react";
import { Offcanvas } from "react-bootstrap";
import RegionalForm from "./RegionalForm";

export default function RegionalOffcanvas({
  show,
  regional = null,
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
          {regional ? "Editar Regional" : "Nova Regional"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <RegionalForm
          regional={regional}
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
