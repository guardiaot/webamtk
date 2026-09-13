import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import axios from "axios";

import "sumoselect/sumoselect.css";
import "./Util/AjaxSumoSelect.css";
import "sumoselect/jquery.sumoselect";

export default function AjaxSumoSelect({
    url,
    value,
    onChange,
    params = {},
    name = "",
    labelField = "nome",
    valueField = "id",
    multiple = false,
    search = true,
    method = "GET",
    headers = {},
    body = {},
    dependencies = [],
    disabled = false,
    clearOnReload = true,
    emptyText = "Nenhum registro encontrado",
    onLoaded,
    beforeLoad,
    afterLoad,
    onError,
    loadingText = "Carregando...",
    searchText = "Pesquisar...",
    placeholder = "Selecione",
    selectAll = true,
    captionFormat = "{0} selecionados",
    captionFormatAllSelected = "Todos selecionados",
    csvDispCount = 3,
}) {
    const selectRef = useRef(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    //---------------------------------------
    // Carrega opções
    //---------------------------------------
    const load = async () => {
        try {
            setLoading(true);
            beforeLoad?.();
            let response;
            if (method.toUpperCase() === "POST") {
                response = await axios.post(url, body, {
                    params,
                    headers
                });
            } else {
                response = await axios.get(url, {
                    params,
                    headers
                });
            }
            let lista = [];
            const data = response.data;
            if (Array.isArray(data))
                lista = data;
            else if (Array.isArray(data.data))
                lista = data.data;
            else if (Array.isArray(data.dados))
                lista = data.dados;
            setOptions(lista);
            setLoaded(true);
            onLoaded?.(lista);
        }
        catch (e) {
            console.error(e);
            setOptions([]);
            onError?.(e);
        }
        finally {
            setLoading(false);
            afterLoad?.();
        }
    };
    useEffect(() => {
        load();
    }, [url, JSON.stringify(params), ...dependencies]);
    //---------------------------------------
    // Inicializa plugin
    //---------------------------------------
    useEffect(() => {
        const select = $(selectRef.current);
        if (select[0]?.sumo) {
            select[0].sumo.unload();
        }
        select.SumoSelect({
            placeholder,
            search,
            searchText,
            selectAll,
            csvDispCount,
            captionFormat,
            captionFormatAllSelected,
            okCancelInMulti: true,
            triggerChangeCombined: true,
        });
        select.off("change");

        select.on("change", function () {
            const valores = $(this).val();
            const selecionados = $(this).find("option:selected");


            if (multiple) {
                const registros = [];
                const textos = [];
                selecionados.each(function () {
                    const registro = options.find(
                        item => String(item[valueField]) === String(this.value)
                    );
                    if (registro) {
                        registros.push(registro);
                        textos.push($(this).text());
                    }
                });
                onChange?.({
                    value: valores ?? [],
                    values: valores ?? [],
                    text: textos,
                    texts: textos,
                    registro: registros[0] ?? null,
                    registros,
                });
            } else {
                const option = selecionados.first();
                const registro = options.find(
                    item => String(item[valueField]) === String(option.val())
                );
                onChange?.({
                    value: valores ?? "",
                    values: valores ? [valores] : [],
                    text: option.text() ?? "",
                    texts: option.text() ? [option.text()] : [],
                    registro: registro ?? null,
                    registros: registro ? [registro] : [],

                });
            }
        });
        return () => {
            select.off("change");
            if (select[0]?.sumo) {
                select[0].sumo.unload();
            }
        };
    }, [options, loading]);
    //---------------------------------------
    // Atualiza valor
    //---------------------------------------
    useEffect(() => {
        if (loading) return;
        const select = $(selectRef.current);
        if (!select.length) return;
        if (multiple) {
            select.val(Array.isArray(value) ? value.map(String) : []);
        } else {
            select.val(value === null || value === undefined ? "" : String(value));
        }
        if (select[0]?.sumo) {
            select[0].sumo.reload();
        }
    }, [value, multiple, options, loading]);
    return (
        <select
            ref={selectRef}
            name={name}
            multiple={multiple}
            disabled={disabled || loading}
            defaultValue={multiple ? [] : ""}
        >
            {
                loading ?
                    (
                        <option value="">
                            {loadingText}
                        </option>
                    )
                    :
                    options.length === 0 ?
                        (
                            <option value="">
                                {emptyText}
                            </option>
                        )
                        :
                        <>
                            {!multiple && <option value="">{placeholder}</option>}
                            {options.map(item => (
                                <option
                                    key={item[valueField]}
                                    value={item[valueField]}
                                >
                                    {item[labelField]}
                                </option>
                            ))}
                        </>
            }
        </select>
    );
}
