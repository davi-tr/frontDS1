import React, { useState, useEffect } from 'react';
import DataTable from './components/Instituto/DataTable';
import AddResearcherForm from './components/Instituto/AddResearcherForm';
import axios from 'axios';

function TelaPrincipal() {
  const [mostrarDataTable, setMostrarDataTable] = useState(false);
  const [pesquisadores, setPesquisadores] = useState([]);
  const [selectedPesquisador, setSelectedPesquisador] = useState(null);

  useEffect(() => {
    fetchPesquisadores();
  }, []);

  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pesquisador');
      setPesquisadores(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de pesquisadores:', error);
    }
  };

  const handleVoltarParaTelaPrincipal = () => {
    window.location.href = "/";
  };

  const handleDeleteClick = async (pesquisadorId) => {
    try {
      await axios.delete(`http://localhost:8081/pesquisador/${pesquisadorId}`);
      // Atualizar a lista de pesquisadores após a exclusão
      fetchPesquisadores();
      setSelectedPesquisador(null); // Limpar a seleção
    } catch (error) {
      console.error('Erro ao excluir o pesquisador:', error);
    }
  };

  const handlePesquisadorSelect = (pesquisador) => {
    setSelectedPesquisador(pesquisador);
  };

  return (
    <div>
      <button onClick={handleVoltarParaTelaPrincipal}>Voltar para a Tela Principal</button>

      <AddResearcherForm onClose={() => setMostrarDataTable(false)} />
      <div className="container" style={{ width: '100%', height: '70vh', overflow: 'auto' }}>
        <h2 className="titulo">Pesquisadores Cadastrados</h2>
        <table className="data-table-pesquisadores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Instituto</th>
            </tr>
          </thead>
          <tbody>
            {pesquisadores.map((pesquisador) => (
              <tr key={pesquisador.id} onClick={() => handlePesquisadorSelect(pesquisador)}>
                <td>{pesquisador.id}</td>
                <td>{pesquisador.nome}</td>
                <td>{pesquisador.instituto.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="edit-delete-buttons">  <button
        className="delete-button-2"
        disabled={!selectedPesquisador}
        onClick={() => handleDeleteClick(selectedPesquisador.id)}
      >  Excluir
      </button>
      </div>
    </div>
  );
}

export default TelaPrincipal;
