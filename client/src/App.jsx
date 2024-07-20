import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Menu from './componentes/Menu/Menu';
import Login from './componentes/LoginReg/Login';
import Lista from './componentes/Lista/Lista'; // Importa el componente Lista
import Home from './componentes/Home/Home';
import Notas from './componentes/Notas/Notas';
import HomeU from './componentes/HomeU/HomeU';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/home" element={<Home />} />
                <Route path="/lista" element={<Lista />} />
                <Route path="/notas" element={<Notas />} />
                <Route path="/homeu" element={<HomeU />} />
            </Routes>
        </Router>
    );
};

export default App;
