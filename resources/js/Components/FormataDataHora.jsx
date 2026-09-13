import React from "react";

const FormataDataHora = ({ data }) => {
  if (!data) return <span>Data inválida</span>;

  // Converter a string para um objeto Date
  const dataObj = new Date(data);

  // Verificar se a data é válida
  if (isNaN(dataObj.getTime())) {
    return <span>Data inválida</span>;
  }

  // Formatador para o formato pt-BR
  const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <span>
      {dataFormatada} {horaFormatada}
    </span>
  );
};

export default FormataDataHora;