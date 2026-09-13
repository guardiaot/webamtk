import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import Icon from "@mdi/react";

export default function Origem_Offcanvas({
    children,

    // Controle externo
    show: externalShow,
    onHide,

    // Aparência
    title = "",
    icon = null,
    iconClassName = "",
    iconSize = 0.8,

    width = "500px",
    placement = "end",
    className = "",
    style = {},

    // Header
    header = true,
    closeButton = true,

    // Footer
    footer = null,

    // Trigger
    trigger = null,
    btnTitle = "",

    // Z-index
    zIndex = 1085,
    backdropZIndex = 1040,
}) {
    const [internalShow, setInternalShow] = useState(false);

    const show = externalShow ?? internalShow;

    /*
    |--------------------------------------------------------------------------
    | OPEN
    |--------------------------------------------------------------------------
    */
    const handleShow = () => {
        if (externalShow === undefined) {
            setInternalShow(true);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | CLOSE
    |--------------------------------------------------------------------------
    */
    const handleClose = () => {
        if (externalShow === undefined) {
            setInternalShow(false);
        }

        onHide?.();
    };

    /*
    |--------------------------------------------------------------------------
    | BACKDROP Z-INDEX
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            const backdrops = document.querySelectorAll(
                ".offcanvas-backdrop"
            );

            if (backdrops.length) {
                backdrops[
                    backdrops.length - 1
                ].style.zIndex = backdropZIndex;
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [show, backdropZIndex]);

    /*
    |--------------------------------------------------------------------------
    | TRIGGER
    |--------------------------------------------------------------------------
    */
    const renderTrigger = () => {
        // Trigger personalizado
        if (trigger) {
            return (
                <span
                    onClick={handleShow}
                    style={{
                        cursor: "pointer",
                        display: "inline-flex",
                    }}
                >
                    {trigger}
                </span>
            );
        }

        // Trigger padrão
        return (
            <span
                onClick={handleShow}
                className={`d-inline-flex align-items-center ${className}`}
                style={{
                    cursor: "pointer",
                    border: "none",
                    ...style,
                }}
            >
                {icon && (
                    <Icon
                        path={icon}
                        size={iconSize}
                        className={iconClassName}
                    />
                )}

                {btnTitle && (
                    <span className={icon ? "ms-1" : ""}>
                        {btnTitle}
                    </span>
                )}
            </span>
        );
    };

    return (
        <>
            {renderTrigger()}

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement={placement}
                style={{
                    width,
                    zIndex,
                }}
            >
                {header && (
                    <Offcanvas.Header closeButton={closeButton}>
                        <Offcanvas.Title>
                            {title}
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                )}

                <Offcanvas.Body>
                    {typeof children === "function"
                        ? children({
                            close: handleClose,
                            open: handleShow,
                            show,
                        })
                        : children}
                </Offcanvas.Body>

                {footer}
            </Offcanvas>
        </>
    );
}