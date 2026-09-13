import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import UserForm from "./UserForm";

export default function UserOffcanvas({ show, user, onHide, onSaved }) {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "720px", maxWidth: "100vw" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {user ? "Editar usuário" : "Novo usuário"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <UserForm user={user} onCancel={onHide} onSuccess={onSaved} />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
