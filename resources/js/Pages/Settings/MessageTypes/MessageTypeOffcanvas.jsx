import React from "react";
import { Offcanvas } from "react-bootstrap";
import MessageTypeForm from "./MessageTypeForm";

export default function MessageTypeOffcanvas({ show, type = null, onHide, onSaved }) {
  return (
    <Offcanvas show={Boolean(show)} onHide={onHide} placement="end" style={{ width: "720px", maxWidth: "100vw" }}>
      <Offcanvas.Header closeButton><Offcanvas.Title>{type ? "Editar Tipo de Mensagem" : "Novo Tipo de Mensagem"}</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body><MessageTypeForm type={type} onCancel={onHide} onSuccess={() => { onSaved?.(); onHide?.(); }} /></Offcanvas.Body>
    </Offcanvas>
  );
}
