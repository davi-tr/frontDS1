import React from 'react';
import './App.css';
import TelaPrincipal from './TelaPrincipal';
import DataTable from './components/Instituto/DataTable';
import TelaHome from './TelaHome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaHome />} />
        <Route path="/datatable" element={<DataTable />} />
        <Route path="/telaprincipal" element={<TelaPrincipal />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
