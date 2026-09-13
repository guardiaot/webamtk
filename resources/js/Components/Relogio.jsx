import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';



export default function Relogio({ selected }) {
        const [time, setTime] = useState(new Date());

        // Atualiza o estado do tempo a cada segundo
        useEffect(() => {
          const timerId = setInterval(() => {
            setTime(new Date());
          }, 1000);
      
          // Limpa o intervalo quando o componente é desmontado
          return () => clearInterval(timerId);
        }, []);
      
        // Formata a hora atual em HH:MM:SS
        const formatTime = (date) => {
          return date.toLocaleTimeString();
        };

          // Formata a data no formato: Dia da semana, Mês Dia, Ano
          const formatDate = (date) => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
          };

        return (
                <div style={{display: 'flex',  flexDirection: 'column',  alignContent: 'center',  justifyContent: 'center',   alignItems: 'center'}}>
                  <span style={{ fontSize: '41px',   fontWeight: 'bold',  color: '#7f7f7f' }}>{formatTime(time)}</span>
                  <span>{formatDate(time)}</span>
                </div>
              );
}