import React from "react";
import { Offcanvas } from "react-bootstrap";
import TransmissionFunctionForm from "./TransmissionFunctionForm";

export default function TransmissionFunctionOffcanvas({ show, transmissionFunction = null, onHide, onSaved }) {
    return <Offcanvas
        show={Boolean(show)}
        onHide={onHide}
        placement="end"
        style={{ width: "820px", maxWidth: "100vw" }}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>
                {transmissionFunction ? "Editar Função de Transmissão" : "Nova Função de Transmissão"}
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {show && (
                <TransmissionFunctionForm
                    transmissionFunction={transmissionFunction}
                    onCancel={onHide}
                    onSuccess={() => {
                        onSaved?.();
                        onHide?.();
                    }} />
            )}
        </Offcanvas.Body></Offcanvas>;
}
