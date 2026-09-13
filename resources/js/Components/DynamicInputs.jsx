import React, { useState } from "react";
import ProdutoLista from "./ProdutoLista";

import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";

const DynamicInputs = ({ id_seguradora, formData, setFormData }) => {

   const [contaLinha, setContaLinha] = useState("");

    // Adicionar nova linha
    const addRow = () => {
        const newRow = { produto: "", plano: "", status: "" };
        setFormData({
            ...formData,
            rows: [...(formData.rows || []), newRow],
        });
    };

    // Remover uma linha
    const removeRow = (index) => {
        const updatedRows = (formData.rows || []).filter((_, i) => i !== index);
        setFormData({
            ...formData,
            rows: updatedRows,
        });
    };

    // Atualizar os valores dos inputs
    const handleInputChange = (index, field, value) => {
        const updatedRows = (formData.rows || []).map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setFormData({
            ...formData,
            rows: updatedRows,
        });
    };

    const totalRows = formData?.rows?.length;

    return (
        <div>
             {(formData.rows || []).map((row, index) => (
                <div key={index} className="row">
                    <div className="col-sm-5">
                        <label for="produtos" className="form-label">Produtos</label>
                        <ProdutoLista
                            name='id_produto'
                            selected={id_seguradora}
                            value={row.produto}
                            onChange={(e) => handleInputChange(index, "produto", e.target.value)}
                            required={true}
                        />
                    </div>
                    <div className="col-sm-3">
                        <label for="plano" className="form-label">Plano</label>
                        <select
                            value={row.plano}
                            className='form-select  form-select-sm'
                            onChange={(e) => handleInputChange(index, "plano", e.target.value)}
                            required
                        >
                            <option value="">Plano</option>
                            <option value="0">Básico</option>
                            <option value="1">Avançado</option>
                        </select>
                    </div>
                    <div className="col-sm-3">
                        <label for="status_interacao" className="form-label">Status</label>
                        <select
                            value={row.status}
                            className='form-select  form-select-sm'
                            onChange={(e) => handleInputChange(index, "status", e.target.value)}
                            required
                        >
                            <option value="">Status</option>
                            <option value="3">Aguardando</option>
                            <option value="2">Pre-aprovado</option>
                            <option value="1">Recusado</option>
                        </select>

                    </div>
                    <div className="col-sm-1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '23px' }}>
                        <div className="d-flex">
                           
                           {totalRows > 1 &&
                                <IoRemoveCircleOutline size={30} color="#dc3545a6" style={{ cursor: 'pointer' }} onClick={() => removeRow(index)} />
                           }
                            
                                <IoMdAddCircleOutline size={30} color="#1266f1" style={{ cursor: 'pointer' }} onClick={addRow} />

                           
                        </div>
                    </div>
                </div>
            ))}


        </div>
    );
};

export default DynamicInputs;
