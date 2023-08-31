import React, { useState, useEffect } from 'react';
import DataTable from './components/Instituto/DataTable';
import AddResearcherForm from './components/Instituto/AddResearcherForm';
import axios from 'axios';
import Modal from 'react-modal';
import './TelaPrincipal.css';


function TelaPrincipal() {
  const [mostrarDataTable, setMostrarDataTable] = useState(false);
  const [pesquisadores, setPesquisadores] = useState([]);
  const [selectedPesquisador, setSelectedPesquisador] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

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
    setSelectedRowId(pesquisador.id);
  };

  const handleRowClick = (pesquisador) => {
    setSelectedPesquisador(pesquisador);
    onSelectPesquisador(pesquisador); // Chame a função para lidar com a seleção do pesquisador
  };
  

  return (
      <div>
        <AddResearcherForm onClose={() => setMostrarDataTable(false)} updateTable={fetchPesquisadores} />
        <button
          className="delete-button"
          disabled={!selectedPesquisador}
          onClick={() => setShowConfirmationPopup(true)}
        >
          Excluir
        </button>
  
        <div className="container">
          <h2 className="titulo">Pesquisadores Cadastrados</h2>
          <table className="data-table-pesquisadores">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Instituto</th>
          <th>Sigla</th>

        </tr>
      </thead>
      <tbody>
  {pesquisadores.map((pesquisador) => (
    <tr
      key={pesquisador.id}
      onClick={() => handleRowClick(pesquisador)}
      className={selectedPesquisador === pesquisador ? 'selected-row' : ''}
    >
      <td>{pesquisador.nome}</td>
      {/* Exibir as informações do instituto relacionado */}
      <td>{pesquisador.instituto.nome}</td>
      <td>{pesquisador.instituto.acronimo}</td>
    </tr>
  ))}
</tbody>
    </table>
        </div>
  
        <Modal
          isOpen={showConfirmationPopup}
          onRequestClose={() => setShowConfirmationPopup(false)}
          contentLabel="Confirmar Exclusão"
          className="modal-popup"
          overlayClassName="modal-overlay"
        >
          <h2 className="modal-header">Confirmar Exclusão</h2>
          {selectedPesquisador && (
            <p>
              Deseja realmente excluir o pesquisador com ID:{' '}
              {selectedPesquisador.id}?
            </p>
          )}
          <div className="add-modal-button-container">
            <button
              className="delete-button"
              onClick={() => {
                if (selectedPesquisador) {
                  handleDeleteClick(selectedPesquisador.id);
                  setShowConfirmationPopup(false);
                }
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="add-button"
            >
              Cancelar
            </button>
          </div>
        </Modal>
        
      </div>
  );
}

export default TelaPrincipal;
