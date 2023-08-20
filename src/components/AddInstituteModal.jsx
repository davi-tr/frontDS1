// AddInstituteModal.jsx

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
    <Modal show={show} onHide={onClose} className="add-modal-overlay">
      <div className="add-modal-container">
        <h3>Adicionar Instituto</h3>
        <form onSubmit={handleAddSubmit}>
          <label className="add-modal-label">Nome:</label>
          <input
            type="text"
            name="nome"
            value={newInstitute.nome}
            onChange={handleInputChange}
            className="add-modal-input"
          />

          <label className="add-modal-label">Acrônimo:</label>
          <input
            type="text"
            name="acronimo"
            value={newInstitute.acronimo}
            onChange={handleInputChange}
            className="add-modal-input"
          />

          <div className="add-modal-button-container">
            <Button variant="secondary" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddInstituteModal;
