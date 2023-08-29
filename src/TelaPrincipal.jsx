import React, { useState } from 'react';
import DataTable from './components/Instituto/DataTable';

function TelaPrincipal() {
  const [mostrarDataTable, setMostrarDataTable] = useState(false);

  const toggleDataTable = () => {
    setMostrarDataTable(!mostrarDataTable);
  };

  return (
    <div>
      <button onClick={toggleDataTable}>Instituto</button>

      {mostrarDataTable && <DataTable />} {/* Renderiza o DataTable se o estado for verdadeiro */}
    </div>
  );
}

export default TelaPrincipal;
