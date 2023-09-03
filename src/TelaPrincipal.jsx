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

  const [pesquisadorXmlId, setPesquisadorXmlId] = useState(null); // Defina o estado para o ID do pesquisador do XML
  const [pesquisadorAdicionadoId, setPesquisadorAdicionadoId] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Valor padrão: 3
  const [totalElements, setTotalElements] = useState(0); // Inicialize com 0

  useEffect(() => {
    fetchPesquisadores();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/pesquisador?page=${currentPage}&size=${itemsPerPage}`);
      setPesquisadores(response.data.content);
      setTotalElements(response.data.totalElements);
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
    setSelectedRowId(pesquisador.idXML);
  };

  const handleRowClick = (pesquisador) => {
    setSelectedPesquisador(pesquisador);
    setPesquisadorAdicionadoId(pesquisador.idXML); // Atualizar o estado com o ID do pesquisador
  };

  return (
    <div>
      <AddResearcherForm


        onClose={() => setMostrarDataTable(false)}
        updateTable={fetchPesquisadores}

        onAddPesquisador={(idDigitado) => setPesquisadorAdicionadoId(idDigitado)}
      />
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
              <th>NOME</th>
              <th>INSTITUTO</th>
              <th>ACRÔNIMO</th>
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
        <div className="modal-content">
          <h2 className="modal-header">Confirmar Exclusão</h2>
          {selectedPesquisador && pesquisadorAdicionadoId !== null && (
            <p>
              Deseja realmente excluir o pesquisador com ID:  <span className="highlighted-id">{pesquisadorAdicionadoId}</span>?
            </p>
          )}
          <div className="add-modal-button-container">
            <button
              className="delete-button"
              onClick={() => {
                if (selectedPesquisador && pesquisadorAdicionadoId !== null) {
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
        </div>
      </Modal>
     


      <div className="pagination">
        {Array.from(Array(Math.ceil(totalElements / itemsPerPage)), (item, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={currentPage === index ? 'active-page' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="items-per-page">
        <label>Quantidade de itens por página:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(0); // Reinicie a página para a primeira página ao alterar os itens por página
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

    </div>
  );
}

export default TelaPrincipal;
