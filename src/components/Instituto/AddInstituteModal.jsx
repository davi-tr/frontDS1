import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css';


const AddInstituteModal = ({ show, onClose, onAdd }) => {
  const [newInstitute, setNewInstitute] = useState({ nome: '', acronimo: '' });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewInstitute({ ...newInstitute, [name]: value });
  };

  const handleAddSubmit = event => {
    event.preventDefault();
    onAdd(newInstitute);
    setNewInstitute({ nome: '', acronimo: '' });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} className="modal-popup">
      <div>
        <h2 className="modal-header">Adicionar Instituto</h2>
        <form onSubmit={handleAddSubmit}>
          <div className="field">
            <label className="add-modal-label">Nome:</label>
            <input
              type="text"
              name="nome"
              value={newInstitute.nome}
              onChange={handleInputChange}
              className="add-modal-input"
            />
          </div>
          <div className="field">
            <label className="add-modal-label">Acrônimo:</label>
            <input
              type="text"
              name="acronimo"
              value={newInstitute.acronimo}
              onChange={handleInputChange}
              className="add-modal-input"
            />
          </div>
          <div className="add-modal-button-container">
            <Button variant="secondary" onClick={onClose} className="mr-2 delete-button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="add-button">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddInstituteModal;