import React from "react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

const DataAmigavel = ({ data }) => {
  if (!data) return <span>Data inválida</span>;

  // Converter a string para um objeto Date
  const dataObj = new Date(data);

  // Verificar se a data é válida
  if (isNaN(dataObj.getTime())) {
    return <span>Data inválida</span>;
  }

  // Lógica para determinar o texto amigável
  let textoAmigavel;
  if (isToday(dataObj)) {
    textoAmigavel = "Hoje";
  } else if (isYesterday(dataObj)) {
    textoAmigavel = "Ontem";
  } else {
    textoAmigavel = formatDistanceToNow(dataObj, { locale: ptBR, addSuffix: true });
  }

  // Formatar a data completa (opcional)
  const dataCompleta = format(dataObj, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });

  return (
    <span title={dataCompleta}>
      {textoAmigavel}
    </span>
  );
};

export default DataAmigavel;