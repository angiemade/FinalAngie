import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Menu from './componentes/Menu/Menu';
import Login from './componentes/LoginReg/Login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </Router>
    );
};

export default App;
