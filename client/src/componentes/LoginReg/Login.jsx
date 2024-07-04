import React, { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleAuth = () => {
        if (isRegister) {
            Axios.post('http://localhost:3001/register', {
                username,
                password,
                role
            }).then(response => {
                Swal.fire('Registro Exitoso', 'Usuario registrado correctamente', 'success');
                setIsRegister(false);
            }).catch(error => {
                Swal.fire('Error', error.response.data.msg, 'error');
            });
        } else {
            Axios.post('http://localhost:3001/login', {
                username,
                password
            }).then(response => {
                localStorage.setItem('token', response.data.token);
                Swal.fire('Login Exitoso', 'Has iniciado sesión correctamente', 'success');
            }).catch(error => {
                Swal.fire('Error', error.response.data.msg, 'error');
            });
        }
    };

    return (
        <div className="container">
            <h2>{isRegister ? 'Registro' : 'Login'}</h2>
            <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {isRegister && (
                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <input type="text" className="form-control" value={role} onChange={e => setRole(e.target.value)} />
                </div>
            )}
            <button className="btn btn-primary" onClick={handleAuth}>{isRegister ? 'Registrar' : 'Iniciar Sesión'}</button>
            <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
            </button>
        </div>
    );
};

export default Login;
