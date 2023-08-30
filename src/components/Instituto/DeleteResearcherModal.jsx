import React from 'react';
import Button from 'react-bootstrap/Button';
import './DataTable.css'; // Importe o arquivo CSS com as regras de estilo

const DeleteResearcherModal = ({ show, onClose, onConfirm, itemId }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-popup">
      <div className="modal-popup-content">
        <div className="modal-header">
          <h5>Confirmação de Exclusão</h5>
        </div>
        <div className="modal-body">
          <p>Tem certeza que deseja excluir o Instituto com o Pesquisador selecionado:</p>
          <p>{itemId}</p>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar Exclusão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResearcherModal;


