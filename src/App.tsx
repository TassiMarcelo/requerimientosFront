import React from 'react'
import { TablaRequerimientos } from './components/TablaRequerimientos'
import Login from './components/pages/login/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tablarequerimientos" element={<TablaRequerimientos />} />
      </Routes>
    </Router>
  );
}

export default App;