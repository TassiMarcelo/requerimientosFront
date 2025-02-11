import React from 'react'
import { TablaRequerimientos } from './components/TablaRequerimientos'
import Login from './components/pages/login/Login'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TablaRequerimientos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;