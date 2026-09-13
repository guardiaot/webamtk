import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import  Select  from 'react-select'



export default function MultSelectUsuarios({ selected, width, st, name, onChange  }) {

        const [dados, setDados] = useState([]);
        const [registro, setRegistro] = useState()

        useEffect(() => {
                axios.get('/lista-usuario')
                .then(function (response) {
                          const db = response.data.data
                          setDados(db)
                  })
                  .catch((error) => console.log(error));
        }, [st]);
      
      

        return (
                <Select name={name} title={name}
                                className='form-select form-select-sm'   
                                isMult
                                options={registro} 
                                isClearable={true}
                                isSearchable={true}
                                isDisabled={false}
                                isLoading={false}
                                isRtl={false}
                                style={{ width: `${width}px` }}
                                onChange={onChange}
                                >
                </Select>
              );
}