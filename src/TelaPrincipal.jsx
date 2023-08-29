import React, { useState, useEffect } from 'react';
import DataTable from './components/Instituto/DataTable';
import AddResearcherForm from './components/Instituto/AddResearcherForm'; // Importe o formulário de adição de pesquisador aqui
import axios from 'axios';


function TelaPrincipal() {
  const [mostrarDataTable, setMostrarDataTable] = useState(false);
  const [pesquisadores, setPesquisadores] = useState([]);

  const toggleDataTable = () => {
    setMostrarDataTable(!mostrarDataTable);
  };
  useEffect(() => {
    fetchPesquisadores(); // Busca a lista de pesquisadores ao carregar o componente
  }, []);

  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pesquisador');
      setPesquisadores(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de pesquisadores:', error);
    }
  };

  return (
    <div>
      <button onClick={toggleDataTable}>Instituto</button>

      {mostrarDataTable && <DataTable />} {/* Renderiza o DataTable se o estado for verdadeiro */}

      {/* Renderiza o formulário de adição de pesquisador */}
      <AddResearcherForm onClose={() => setMostrarDataTable(false)} />
        <div className="container" style={{ width: '100%', height: '70vh', overflow: 'auto' }}>
          <h2 className="titulo">Pesquisadores Cadastrados</h2>
        <table className="data-table-pesquisadores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Instituto</th>
              {/* Mais colunas aqui, exceto e-mail */}
            </tr>
          </thead>
          <tbody>
            {pesquisadores.map(pesquisador => (
              <tr key={pesquisador.id}>
                <td>{pesquisador.id}</td>
                <td>{pesquisador.nome}</td>
                <td>{pesquisador.instituto.nome}</td>
                {/* Mais colunas aqui, exceto e-mail */}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>  
  );
}

export default TelaPrincipal;
