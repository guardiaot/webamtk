import React from "react";
import { Offcanvas } from "react-bootstrap";
import IEDForm from "./IEDForm";

export default function IEDOffcanvas({ show, ied = null, onHide, onSaved }) {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "820px", maxWidth: "100vw" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{ied ? "Editar IED" : "Novo IED"}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <IEDForm ied={ied} onCancel={onHide} onSuccess={onSaved} />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
