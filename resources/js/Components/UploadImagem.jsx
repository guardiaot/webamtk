import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { MdAddPhotoAlternate } from "react-icons/md";



export default function UploadImagem({ selected, width, st, name, onChange, id_cliente, handleclick, display }) {
    const [dados, setDados] = useState([]);
    const [registro, setRegistro] = useState();

    const [myPicture, setPicture] = useState(null);
    const [imgData, setImgData] = useState('http://painel-ksi-novo.test/img/foto_cli.png');

    useEffect(() => {
        axios.get(`/imagem-pessoa/${id_cliente}`)
            .then(function (response) {
                const db = response.data.data;
                if (db) {
                    setImgData(`./${db.path}`);
                } else {
                    setImgData('http://painel-ksi-novo.test/img/foto_cli.png');
                }
                setDados(db);
            })
            .catch((error) => console.log(error));
    }, [st, id_cliente]);

    function addImagem() {
        document.getElementById('profilePic').click();
    }

    const onChangePicture = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
            setImgData(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (myPicture) {
            uploadFile(); // Chama o uploadFile somente após myPicture estar definido
        }
    }, [myPicture]);

    const uploadFile = () => {
        if (!myPicture) {
            alert("Por favor, selecione uma imagem");
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', myPicture);
        formData.append('id', id_cliente);

        axios.post('/upload-imagem', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data);
            setPicture(null);
        }).catch(error => {
            console.error('Erro ao fazer upload do arquivo!', error);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ marginBottom: '5px' }} >
                <img
                    className="playerProfilePic_home_tile"
                    style={{ width: '260px', height: '145px' }}
                    src={imgData}
                    alt="Preview"
                />
            </div>
            <input
                name='profilePic'
                id="profilePic"
                style={{ display: 'none' }}
                type="file"
                value=""  
                onChange={onChangePicture}
                accept="image/*" // Aceitar somente arquivos de imagem
            />
            <MdAddPhotoAlternate
                size={35}
                onClick={addImagem}
                style={{ display: `${display}` }}
            />
        </div>
    );
}
