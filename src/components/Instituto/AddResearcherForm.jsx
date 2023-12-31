import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css';

const AddResearcherForm = ({ onClose, updateTable }) => {
  const [researcherId, setResearcherId] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [pesquisadores, setPesquisadores] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [responseControl, setResponseControl] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    const filtered = institutes.filter((institute) =>
      institute.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredInstitutes(filtered);
  }, [searchText, institutes]);
  

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get('http://localhost:8083/instituto');
      setInstitutes(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de institutos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedInstitute = institutes.find(
      (institute) => institute.id === parseInt(instituteId)
    );
    if (!selectedInstitute) {
      toast.error('ID do instituto inválido.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8083/pesquisador', {
        idPesquisador: researcherId,
        idinstituto: parseInt(instituteId),
      });
      
      console.log(response);
      
      onClose();

      // Exibe o alerta de sucesso apenas se o cadastro for bem-sucedido
      toast.success('Pesquisador cadastrado com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


      // Atualize a tabela apenas se o cadastro for bem-sucedido
      
      fetchPesquisadores();
      updateTable();

    } catch (error) {
      console.error('Erro ao cadastrar pesquisador:', error.response.data.mensagem);

      // Exibe o alerta de erro apenas se ocorrer um erro no cadastro
      toast.error(`Erro ao cadastrar pesquisador. Por favor, tente novamente. ERRO:${error.response.data.mensagem}`,{
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get('http://localhost:8083/pesquisador');
      setPesquisadores(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de pesquisadores:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setModalIsOpen(true)} className="add-button">
        Cadastrar Pesquisador
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Cadastrar Pesquisador"
        className="modal-popup"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">  {/* Adicione uma div para envolver o conteúdo do modal */}
          <h2 className="modal-header"> Cadastrar Pesquisador </h2>
          <form onSubmit={handleSubmit}>
            <label className="add-modal-label">
              <input
                type="text"
                value={researcherId}
                onChange={(e) => setResearcherId(e.target.value)}
                className="add-modal-input"
                placeholder="ID pesquisador"
              />
            </label>

            <label className="add-modal-label">
              <input
                type="text"
                placeholder="Pesquisar instituto"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="add-modal-input"
              />
              <select
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                className="add-modal-input"
              >
                <option value="">Selecione um instituto</option>
                {filteredInstitutes.map((institute) => (
                  <option key={institute.id} value={institute.id}>
                    {institute.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="add-modal-button-container">
              <button onClick={() => setModalIsOpen(false)} className="mr-2 delete-button">
                Fechar
              </button>
              <button type="submit" className="add-button">
                Cadastrar
              </button>
              
            </div>
          </form>
        </div>
        <h2 className="modal-header"></h2>
        <form onSubmit={handleSubmit}  >
          <label className="add-modal-label">
            <input
              type="text"
              value={researcherId}
              onChange={(e) => setResearcherId(e.target.value)}
              className="add-modal-input"
              placeholder="ID pesquisador"
            />
          </label>

          

        
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AddResearcherForm;
