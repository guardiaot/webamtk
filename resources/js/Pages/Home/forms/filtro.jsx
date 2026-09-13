import React from 'react';
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

import { useForm } from "@inertiajs/react";

import axios from 'axios';


import Origem_popup from '@/Components/ksi/Origem_popup';
import Origem_popup_conteudo from '@/Components/ksi/Origem_popup_conteudo';
import Origem_popup_rodape from '@/Components/ksi/Origem_popup_rodape';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Padding } from '@mui/icons-material';
import SelectApi from '@/Components/SelectApi';
import AjaxSumoSelect from '@/Components/AjaxSumoSelect';




export default function Filtro({ onApply, close }) {
    const [show, setShow] = useState(false);
    const { data, setData, reset } = useForm({
        id_imobiliaria: "",
        id_externo: "",
        id_seguradora: "",
        id_produto: "",
        ...onApply
    });
    useEffect(() => {
        Object.entries(onApply).forEach(([campo, valor]) => {
            setData(campo, valor);
        });
    }, [onApply]);
    function handleSubmit(e) {
        e.preventDefault();
        onApply?.(data);
        close?.();
    }
    function limpar() {
        reset();
    }
    return (
        <form onSubmit={handleSubmit} >
            <Origem_popup>
                <Origem_popup_conteudo >
                    <div style={{ padding: '14px' }}>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label">
                                    Imobiliária
                                </label>
                                <br />
                                <AjaxSumoSelect
                                    url="/api/imobiliarias"
                                    search
                                    loadingText="Carregando..."
                                    emptyText="Carregando..."
                                    dependencies={[data.id_imobiliaria]}
                                    placeholder="Selecione"
                                    value={data.id_imobiliaria}
                                    onChange={({ value, text, registro }) => {
                                        setData({
                                            ...data,
                                            id_imobiliaria: value,
                                            imobiliaria: text,
                                        });
                                    }}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">
                                    Consultor
                                </label>
                                <SelectApi
                                    url="/api/corretores"
                                    params={{
                                        id_imobiliaria: data.id_imobiliaria
                                    }}
                                    value={data.id_externo}
                                    valueField="id_externo"
                                    labelField="nome"
                                    disabled={!data.id_imobiliaria}
                                    onChange={({ value, text }) => {
                                        setData({
                                            ...data,
                                            id_externo: value,
                                            consultor: text
                                        });
                                    }}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">
                                    Seguradora
                                </label>
                                <SelectApi
                                    url="/api/seguradoras"
                                    value={data.id_seguradora}
                                    valueField="id"
                                    labelField="nome_popular"
                                    onChange={({ value, text, registro }) => {
                                        setData({
                                            ...data,
                                            id_seguradora: value,
                                            seguradora: text,
                                        });
                                    }}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">
                                    Produto
                                </label>
                                <SelectApi
                                    url="/api/produtos"
                                    params={{
                                        id_seguradora: data.id_seguradora
                                    }}
                                    value={data.id_produto}
                                    valueField="id_produto"
                                    labelField="nome"
                                    disabled={!data.id_seguradora}
                                    onChange={({ value, text }) => {
                                        setData({
                                            ...data,
                                            id_produto: value,
                                            produto: text
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Origem_popup_conteudo>
                <Origem_popup_rodape>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={limpar}
                    >
                        Limpar
                    </Button>
                    <Button
                        type="submit"
                        className="ms-2"
                    >
                        Aplicar filtros
                    </Button>
                </Origem_popup_rodape>
            </Origem_popup>
        </form>
    );
}