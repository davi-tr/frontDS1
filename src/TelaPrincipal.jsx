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

   // Estado para controlar a página atual da tabela
   const [currentPage, setCurrentPage] = useState(0);

   // Estado para armazenar o número total de elementos na tabela
   const [totalElements, setTotalElements] = useState(false);
 
   // Estado para controlar a quantidade de itens por página
   const [itensPerPage, setItensPerPage] = useState(3);// Inicialize com 0

   const startIndex = currentPage * itensPerPage;
   const endIndex = startIndex + itensPerPage;
   const currentItens = pesquisadores.slice(startIndex, endIndex);

   const [searchText, setSearchText] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const [filter, setFilter] = useState('all');

   const pages = Math.ceil(totalElements / itensPerPage);

  useEffect(() => {
    fetchPesquisadores();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchPesquisadores();
  }, [itensPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/pesquisador?page=${currentPage}&size=${itensPerPage}`);
      setPesquisadores(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de pesquisadores:', error);
    }
  };

  const handleDeleteClick = async (pesquisadorId) => {
    try {
      await axios.delete(`http://localhost:8083/pesquisador/${pesquisadorId}`);
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

  const searchPesquisadores = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/pesquisador?search=${searchText}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };
  const searchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/instituto?search=${searchText}&filter=${filter}`
      );
      setData(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
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

      <div className="search-input">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="nome">Nome</option>
          <option value="idXML">ID</option>
        </select>
        <input
          type="text"
          placeholder="Pesquisar por nome ou acrônimo"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="container">
        <h2 className="titulo">Pesquisadores Cadastrados</h2>
        <table className="data-table-pesquisadores">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>INSTITUTO</th>
              <th>ACRÔNIMO</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((pesquisador) => (
                <tr
                  key={pesquisador.id}
                  onClick={() => handleRowClick(pesquisador)}
                  className={selectedPesquisador === pesquisador ? 'selected-row' : ''}
                >
                  <td>{pesquisador.idXML}</td>
                  <td>{pesquisador.nome}</td>
                  <td>{pesquisador.instituto.nome}</td>
                  <td>{pesquisador.instituto.acronimo}</td>
                </tr>
              ))
            ) : (
              pesquisadores.map((pesquisador) => (
                <tr
                  key={pesquisador.id}
                  onClick={() => handleRowClick(pesquisador)}
                  className={selectedPesquisador === pesquisador ? 'selected-row' : ''}
                >
                  <td>{pesquisador.idXML}</td>
                  <td>{pesquisador.nome}</td>
                  <td>{pesquisador.instituto.nome}</td>
                  <td>{pesquisador.instituto.acronimo}</td>
                </tr>
              ))
            )}
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
     


      <div className='pagination'>
        {Array.from(Array(pages), (item, index) => {
          return <button className="botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))} key={index}>{index + 1}</button>
        })}
      </div>
      <div className='seletor'>
        <p className='informe'>Quantidade de itens por página</p>
        <select className='qtdItens' value={itensPerPage} onChange={(e) => setItensPerPage(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>

    </div>
  );
}

export default TelaPrincipal;