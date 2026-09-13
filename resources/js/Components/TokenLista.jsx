import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';



export default function TokenLista({ selected, width, st, name, onChange  }) {

        const [dados, setDados] = useState([]);
        const [registro, setRegistro] = useState()

        useEffect(() => {
                axios.get('/get-token')
                .then(function (response) {
                          const db = response.data.data
                          setDados(db)
                  })
                  .catch((error) => console.log(error));
        }, [st]);
      
      

        return (
                <select name={name} title={name}
                                className='form-select'    
                                style={{ width: `${width}px` }}
                                value={registro} 
                                onChange={onChange}
                                sendValue={registro}
                                >
                        <option value="">selecione...</option>
                        {dados && dados.map((tokens, index) => (
                                <option value={tokens.id} key={index}>{tokens.token}</option>
                        ))}
                        
                </select>
              );
}