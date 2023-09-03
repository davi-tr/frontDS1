import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './DataTable.css'; // Importe o arquivo CSS com as regras de estilo
import { toast } from 'react-toastify'; // Importe o toast do react-toastify
import 'react-toastify/dist/ReactToastify.css';

const DeleteConfirmationModal = ({ show, onClose, onConfirm, itemId }) => {
  const [isDeleting, setIsDeleting] = useState(false); // Adicione um estado para rastrear o status de exclusão

  if (!show) {
    return null;
  }

  const handleConfirm = async () => {
    setIsDeleting(true); // Defina o estado para indicar que a exclusão está em andamento

    try {
      // Chame a função onConfirm para excluir o instituto
      await onConfirm();
      toast.success(`Instituto com ID ${itemId} excluído com sucesso!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsDeleting(false); // Restaure o estado após a exclusão bem-sucedida
      onClose(); // Feche o modal
    } catch (error) {
      console.error('Erro ao excluir o instituto:', error.mensagem);
      toast.error(`Erro ao excluir o Instituto com ID ${itemId}. Por favor, tente novamente. ${error.mensagem}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsDeleting(false); // Restaure o estado após o erro
    }
  };

  return (
    <div className="modal-popup">
      <div className="modal-popup-content">
        <div className="modal-header">
          <h2 className="modal-title">Confirmação de Exclusão</h2>
        </div>
        <div className="modal-body">
          <p>Tem certeza que deseja excluir o Instituto com o ID:</p>
          <p>{itemId}</p>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} className="mr-2 delete-button">
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm} className="add-button" disabled={isDeleting}>
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
