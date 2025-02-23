import React from 'react'
import { TablaRequerimientos } from './components/pages/tablaRequerimientos/TablaRequerimientos'
import Login from './components/pages/login/Login'
import Usuarios from './components/pages/gestionarUsuarios/Usuarios'
import ChangePassword from './components/ChangePassword'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/gestionarUsuarios' element={<Usuarios/>} />
        <Route path='/tablaRequerimientos' element={<TablaRequerimientos/>} />
        <Route path='/changePassword' element={<ChangePassword/>} />
      </Routes>
    </Router>
  );
}

export default App;