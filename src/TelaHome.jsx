import React, { useState } from 'react';
import './TelaHome.css'; // Importe seu arquivo de estilos

import TelaPrincipal from './TelaPrincipal';
import DataTable from './components/Instituto/DataTable';

function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={() => handleNavigate('home')}>Home</li>
          <li onClick={() => handleNavigate('pesquisador')}>Tela de Pesquisador</li>
          <li onClick={() => handleNavigate('instituto')}>Tela de Instituto</li>
        </ul>
      </div>
      <div className="content">
        {currentScreen === 'home' && (
          <div className="home-content">
            <h1 className="home-title">Tela Principal (Home)</h1>
            <div className="home-buttons">
              <button className="home-button" onClick={() => handleNavigate('pesquisador')}>
                Ir para a Tela de Pesquisador
              </button>
              <button className="home-button" onClick={() => handleNavigate('instituto')}>
                Ir para a Tela de Instituto
              </button>
            </div>
          </div>
        )}
        {currentScreen === 'pesquisador' && <TelaPrincipal />}
        {currentScreen === 'instituto' && <DataTable />}
      </div>
    </div>
  );
}

export default Home;
