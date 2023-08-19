import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './DataTable.css'; 

const EditInstituteModal = ({ show, onClose, institute, onEdit }) => {
  const [editedData, setEditedData] = useState({ nome: institute.nome, acronimo: institute.acronimo });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEditSubmit = async event => {
    event.preventDefault();
    
    onEdit(institute.id, editedData);

    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Instituto - ID: {institute.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleEditSubmit}>
          <p>ID: {institute.id}</p>
          <label>
            Nome:
            <input type="text" name="nome" value={editedData.nome} onChange={handleInputChange} />
          </label>
          <label>
            Acrônimo:
            <input type="text" name="acronimo" value={editedData.acronimo} onChange={handleInputChange} />
          </label>
          <Button variant="primary" type="submit">
            Confirmar Edição
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditInstituteModal;
