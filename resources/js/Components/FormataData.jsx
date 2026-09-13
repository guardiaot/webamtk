import React from "react";

const FormataData = ({ data }) => {
  
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



  return (
    <span>
      {dataFormatada}
    </span>
  );
};

export default FormataData;