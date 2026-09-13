import { useEffect, useState } from "react";
import axios from "axios";

export default function Origem_SelectApi({
    url,
    params = {},
    value = "",
    valueField = "id",
    labelField = "nome",
    placeholder = "Selecione...",
    className = "form-select",
    disabled = false,
    onChange,
}) {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        carregar();

    }, [JSON.stringify(params)]);

    async function carregar() {

        if (!url) {
            console.error("url não informado");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.get(url, {
                params,
            });

            setLista(response.data.data ?? []);

        } catch (e) {

            console.error(e);

        } finally {

            setLoading(false);

        }

    }

    return (

        <select
            className={className}
            disabled={disabled || loading}
            value={value}
            onChange={(e) => {
                const registro = lista.find(
                    item => String(item[valueField]) === e.target.value
                );

                onChange?.({
                    value: e.target.value,
                    text: registro?.[labelField] || "",
                    registro
                });

            }}
        >

            <option value="">
                {loading ? "Carregando..." : placeholder}
            </option>

            {lista.map(item => (

                <option
                    key={item[valueField]}
                    value={item[valueField]}
                >
                    {item[labelField]}
                </option>

            ))}

        </select>

    );

}