import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiCloudUploadOutline } from "@mdi/js";
import { Link } from "@inertiajs/react";
import toast from "react-hot-toast";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import AjaxSumoSelect from "@/Components/AjaxSumoSelect";

export default function Upload() {
    const [iedId, setIedId] = useState("");
    const [cfgFile, setCfgFile] = useState(null);
    const [datFile, setDatFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [comtradeRecordId, setComtradeRecordId] = useState(null);

    const validarArquivo = (file, extensao, tamanhoMaximo) => {
        if (!file || file.size <= 0 || file.size > tamanhoMaximo) {
            return false;
        }

        return file.name.toLowerCase().endsWith(extensao);
    };

    const basename = (file) => {
        const nome = file.name;
        return nome.slice(0, nome.lastIndexOf(".")).toLowerCase();
    };

    const enviarArquivos = async () => {
        if (!iedId || !cfgFile || !datFile || sending) {
            return;
        }

        if (!validarArquivo(cfgFile, ".cfg", 1024 * 1024)) {
            toast.error("Selecione um arquivo CFG válido de até 1 MiB.");
            return;
        }

        if (!validarArquivo(datFile, ".dat", 32 * 1024 * 1024)) {
            toast.error("Selecione um arquivo DAT válido de até 32 MiB.");
            return;
        }

        if (basename(cfgFile) !== basename(datFile)) {
            toast.error("Os arquivos CFG e DAT devem possuir o mesmo nome base.");
            return;
        }

        const formData = new FormData();
        formData.append("ied_id", iedId);
        formData.append("cfg", cfgFile);
        formData.append("dat", datFile);

        try {
            setSending(true);
            const response = await fetch("/api/v1/maintenance/upload", {
                method: "POST",
                body: formData,
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                },
            });

            let result = null;
            try {
                result = await response.json();
            } catch (error) {
                result = null;
            }

            if (typeof result === "string") {
                try {
                    result = JSON.parse(result);
                } catch (error) {
                    result = null;
                }
            }

            if (!response.ok) {
                toast.error(result?.error || "Não foi possível importar os arquivos COMTRADE.");
                return;
            }

            if (response.status !== 201 || result?.status !== "created" ||
                !Number.isInteger(result?.comtrade_record_id) || result.comtrade_record_id <= 0) {
                toast.error("Não foi possível importar os arquivos COMTRADE.");
                return;
            }

            setComtradeRecordId(result.comtrade_record_id);
            toast.success("Arquivos COMTRADE importados com sucesso.");
        } catch (error) {
            toast.error("Não foi possível importar os arquivos COMTRADE.");
        } finally {
            setSending(false);
        }
    };

    const podeEnviar = Boolean(iedId && cfgFile && datFile && !sending);

    return (
        <LayoutAdmin>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Upload de Arquivos</h2>
                        <div className="text-muted">
                            Importação manual de arquivos COMTRADE para processamento e análise.
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex align-items-center">
                            <Icon path={mdiCloudUploadOutline} size={1} className="text-primary me-2" />
                            <div className="fw-semibold">Arquivos COMTRADE</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">IED</label>
                                <AjaxSumoSelect
                                    url="/api/v1/ieds/simples"
                                    value={iedId}
                                    onChange={(event) => setIedId(event.value)}
                                    labelField="name"
                                    valueField="id"
                                    placeholder="Selecione um IED"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Arquivo CFG</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".cfg"
                                    onChange={(event) => setCfgFile(event.target.files[0] || null)}
                                />
                                {cfgFile && (
                                    <div className="small text-muted mt-1">{cfgFile.name}</div>
                                )}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Arquivo DAT</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".dat"
                                    onChange={(event) => setDatFile(event.target.files[0] || null)}
                                />
                                {datFile && (
                                    <div className="small text-muted mt-1">{datFile.name}</div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button type="button" className="btn btn-primary" disabled={!podeEnviar} onClick={enviarArquivos}>
                                <Icon path={mdiCloudUploadOutline} size={0.8} className="me-1" />
                                {sending ? "Enviando..." : "Enviar arquivos"}
                            </button>
                        </div>

                        {comtradeRecordId && (
                            <div className="d-flex justify-content-end mt-2">
                                <Link
                                    href={`/oscillography/${comtradeRecordId}`}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    Visualizar oscilografia
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
