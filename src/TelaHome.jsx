import React, { useState } from 'react';
import './TelaHome.css'; // Importe seu arquivo de estilos
import TelaPrincipal from './TelaPrincipal';
import DataTable from './components/Instituto/DataTable';
import fotofemass from './fotofemass.png';
import TelaProducoes from './TelaProducoes';
import TelaGrafo from './TelaGrafo';
import GraphComponent from './Grafos';
import './TelaHome.css'; // Importe o arquivo de estilos atualizado
import TelaPesquisador from './TelaPesquisador';

function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2 className='menu'>Menu</h2>
        <ul>
          <li className={currentScreen === 'home' ? 'active' : ''} onClick={() => handleNavigate('home')}>
            <p className='tabs'>Home</p>
          </li>
          <li className={currentScreen === 'pesquisador' ? 'active' : ''} onClick={() => handleNavigate('pesquisador')}>
            <p className='tabs'>Pesquisador</p>
          </li>

          <li className={currentScreen === 'instituto' ? 'active' : ''} onClick={() => handleNavigate('instituto')}>
            <p className='tabs'>Institutos</p>
          </li>
          <li className={currentScreen === 'producoes' ? 'active' : ''} onClick={() => handleNavigate('producoes')}>
            <p className='tabs'>Produções</p>
          </li>
          <li className={currentScreen === 'grafo' ? 'active' : ''} onClick={() => handleNavigate('grafo')}>
            <p className='tabs'>Gerador de grafo</p>
          </li>
          <li className={currentScreen === 'GraphComponent' ? 'active' : ''} onClick={() => handleNavigate('GraphComponent')}>
            <p className='tabs'>Grafos</p>
          </li>
          <li className={currentScreen === 'novoPesquisador' ? 'active' : ''} onClick={() => handleNavigate('novoPesquisador')}>
          </li>
        </ul>
      </div>
      <div className="content">
        {currentScreen === 'pesquisador' && <TelaPesquisador />}
        {currentScreen === 'grafo' && <TelaGrafo />}
        {/*currentScreen === 'novoPesquisador' && <TelaPesquisador />*/}
        {currentScreen === 'instituto' && <DataTable />}
        {currentScreen === 'GraphComponent' && <GraphComponent/>}
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
