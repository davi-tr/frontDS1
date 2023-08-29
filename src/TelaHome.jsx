import React, { useState } from 'react';

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
      <div>
        <h1>Tela Principal (Home)</h1>
        <button onClick={() => handleNavigate('pesquisador')}>Ir para a Tela de Pesquisador</button>
        <button onClick={() => handleNavigate('instituto')}>Ir para a Tela de Instituto</button>
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
