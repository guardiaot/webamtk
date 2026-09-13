import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useForm, router } from "@inertiajs/react";
import Alert from 'react-bootstrap/Alert';

import GuestLAyout from '@/Layouts/GuestLAyout.jsx';
import { Button, ButtonGroup } from 'react-bootstrap';


const Login = ({ config }) => {
    const [Msg, setMsg] = useState('');
    const [aviso, setAviso] = useState(false);
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        email: '',
        password: '',
    });

    const containerStyle = {
        backgroundImage: "url('/img/578.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
       // filter: 'brightness(0.4)',
        transition: 'filter 0.3s ease',
        width: '100vw',
        height: '100vh',
    };

    const loginPage = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post('/api/Auth/logar', data);
            const response = resp.data.data;

            if (!response || response.error) {
                setMsg(response?.error || 'Erro ao realizar login');
                return;
            }
            if (response.token) {
                localStorage.setItem('token', response.token);
            }

            window.location.href = '/home';

        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
        }
    }

    return (
        <>
            <link rel="stylesheet" href="/painel/assets/vendor/css/pages/page-auth.css" />
            <Toaster />
            <div style={containerStyle} className="d-flex align-items-center justify-content-center">
                <GuestLAyout >
                    {Msg &&
                        <Alert variant="danger">
                            {Msg}
                        </Alert>
                    }

                    <div className="container-xxl  px-6 py-4" style={{ background: 'none', boxShadow: '0px 0px 20px 6px #202020' }}>
                        <div className="authentication-wrapper authentication-basic container-p-y">
                            <div className="authentication-inner">

                                <div className="card px-sm-6 px-0" style={{ boxShadow: 'none' }}>
                                    <div className="card-body">
                                        <div className="app-brand justify-content-center">

                                            <a href="login" className="app-brand-link gap-2" style={{ alignItems: 'center', padding: '2px', borderRadius: '5px' }}>
                                                <span className="app-brand-logo demo">
                                                    <span className="text-primary text-center d-flex flex-column align-items-center justify-content-center mb-5" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        <h3 style={{ color: '#5acad8', fontSize: '5rem', padding: '0', margin: '0' }}>AMTK</h3>
                                                        <span className="text-body" style={{ fontSize: '15px', fontWeight: 'normal' }}>Sistema de Gestão de Energia</span>
                                                    </span>
                                                </span>
                                                <span className="app-brand-text demo text-heading fw-bold"></span>
                                            </a>
                                        </div>

                                        <form onSubmit={loginPage} id="formAuthentication" className="mb-6">
                                            <div className='row'>
                                                <div className='col-sm-12'>
                                                    <h3>Login</h3>
                                                </div>
                                                <div className='col-sm-12'>
                                                    <label htmlFor="email" className="form-label">E-mail </label>
                                                    <input type="email"
                                                        className="form-control"
                                                        name="email"
                                                        id="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        required={true}
                                                    />
                                                </div>
                                                <div className='col-sm-12'>
                                                    <label htmlFor="password" className="form-label">Senha </label>
                                                    <input type="password"
                                                        className="form-control"
                                                        name="password"
                                                        id="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required={true}
                                                    />
                                                </div>
                                                <div className='col-sm-12 mt-5'>
                                                    <Button type='submit' className='btn btn-outline-primary d-grid w-100' > Entrar </Button>
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </GuestLAyout>
            </div>
        </>
    );
}



export default Login;