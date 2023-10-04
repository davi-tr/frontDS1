import React, { useState } from 'react';
import './TelaHome.css'; // Importe seu arquivo de estilos
import TelaPrincipal from './TelaPrincipal';
import DataTable from './components/Instituto/DataTable';
import fotofemass from './fotofemass.png';
import TelaProducoes from './TelaProducoes';


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
          <li onClick={() => handleNavigate('pesquisador')}>Pesquisadores</li>
          <li onClick={() => handleNavigate('instituto')}>Institutos</li>
          <li onClick={() => handleNavigate('producoes')}>Produções</li>
        </ul>
      </div>
      <div className="content">
      
        {currentScreen === 'pesquisador' && <TelaPrincipal />}
        {currentScreen === 'instituto' && <DataTable />}
        {currentScreen === 'home' && (
          <div>
            <h1 className="home-title">Controle de Trabalho de Pesquisadores</h1>
            <img
              src={fotofemass}
              alt="Imagem de exemplo"
              className="logohome"
              style={{ width: '600px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
        )}
        {currentScreen === 'producoes' && <TelaProducoes />}

      </div>
    </div>
  );
}

export default Home;
