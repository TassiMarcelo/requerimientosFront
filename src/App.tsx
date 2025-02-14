import React from 'react'
import { TablaRequerimientos } from './components/TablaRequerimientos'
import Login from './components/pages/login/Login'
import { UserTable } from './components/user-table'
import { ThemeProvider } from "./components/theme-provider"
import UserMenu from './components/ui/UserMenu';
import Usuarios from './components/pages/gestionarUsuarios/Usuarios'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/gestionarUsuarios' element={<Usuarios/>} />
      </Routes>
    </Router>
  );
}

export default App;