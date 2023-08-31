import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css';

const AddResearcherForm = ({ onClose, updateTable }) => {
  const [researcherId, setResearcherId] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/instituto');
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
      await axios.post('http://localhost:8081/pesquisador', {
        idPesquisador: researcherId,
        idinstituto: parseInt(instituteId),
      });
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
      console.error('Erro ao cadastrar pesquisador:', error);

      // Exibe o alerta de erro apenas se ocorrer um erro no cadastro
      toast.error('Erro ao cadastrar pesquisador. Por favor, tente novamente.', {
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
      const response = await axios.get('http://localhost:8081/pesquisador');
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

          <label className="add-modal-label">
            <select
              value={instituteId}
              onChange={(e) => setInstituteId(e.target.value)}
              className="add-modal-input"
            >
              <option value="">Selecione um instituto</option>
              {institutes.map((institute) => (
                <option key={institute.id} value={institute.id}>
                  {institute.nome}
                </option>
              ))}
            </select>
          </label>
          <div className="add-modal-button-container">
            <button type="submit" className="add-button">
              Cadastrar
            </button>
            <button onClick={() => setModalIsOpen(false)} className="delete-button">
              Fechar
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AddResearcherForm;
