import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';



export default function ProdutoListaNome({ selected, width, value, name, onChange }) {

        const [dados, setDados] = useState([]);
        const [registro, setRegistro] = useState({})

        useEffect(() => {

                selected ? selected : 0;
                axios.get(`/listar-produtos/${selected}`)
                        .then(function (response) {
                                const db = response.data.data
                                setDados(db)
                        })
                        .catch((error) => console.log(error));

        }, [selected]);




        return (
                <select
                        name={name}
                        title={name}
                        className='form-select  form-select-sm'
                        style={{ width: `${width}px` }}
                        value={value}
                        onChange={onChange}
                        sendValue={value}
                >
                        <option value="">selecione...</option>
                        {dados && dados.map((produto, index) => (
                                <option value={produto.nome} key={index}>{produto.nome}</option>
                        ))}

                </select>
        );
}