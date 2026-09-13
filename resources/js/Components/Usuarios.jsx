import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';



export default function Usuarios({ selected, width, st, name, onChange  }) {

        const [dados, setDados] = useState([]);
        const [registro, setRegistro] = useState({})

        useEffect(() => {
                axios.get('/lista-usuario')
                .then(function (response) {
                          const db = response.data.data
                          setDados(db)
                  })
                  .catch((error) => console.log(error));
        }, [st]);
      
      

        return (
                <select name={name} title={name}
                                className='form-select form-select-sm'    
                                style={{ width: `${width}px` }}
                                value={registro} 
                                onChange={onChange}
                                sendValue={registro}
                                >
                        <option value="">selecione...</option>
                        {dados && dados.map((user, index) => (
                                <option value={user.value} key={index}>{user.label}</option>
                        ))}
                        
                </select>
              );
}