import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';



export default function SeguradoraLista({ selected, width, name, onChange, value, required  }) {

        const [dados, setDados] = useState([]);
        const [registro, setRegistro] = useState(selected)

        useEffect(() => {
                axios.get('/listar-seguradoras')
                .then(function (response) {
                          const db = response.data.data
                          setDados(db)
                  })
                  .catch((error) => console.log(error));
        }, [onChange]);
      

        return (
                <select name={name} title={name}
                                className='form-select form-select-sm'    
                                style={{ width: `${width}px` }}
                                value={value} 
                                onChange={onChange}
                                required={required}
                        >
                        <option value="">selecione...</option>
                        {dados && dados.map((pessoas, index) => (
                                <option value={pessoas.id_seg} key={index}>{pessoas.nome_popular}</option>
                        ))}
                        
                </select>
              );
}