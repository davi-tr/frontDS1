import React, { useState } from 'react';
import './TelaHome.css'; // Importe seu arquivo de estilos

import TelaPrincipal from './TelaPrincipal';
import DataTable from './components/Instituto/DataTable';

function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  let content;

  if (currentScreen === 'home') {
    content = (
      <div className="home-container">
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
    );
  } else if (currentScreen === 'pesquisador') {
    content = <TelaPrincipal />;
  } else if (currentScreen === 'instituto') {
    content = <DataTable />;
  }

  return content;
}

export default Home;
