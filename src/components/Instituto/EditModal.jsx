import React, { useState } from 'react';
import './DataTable.css';

const EditModal = ({ show, onClose, institute, onSave, onCancel }) => {
    if (!show) return null;
  
    const [editedInstitute, setEditedInstitute] = useState({
      id: institute.id,
      nome: institute.nome,
      acronimo: institute.acronimo,
    });
  
    const handleFieldChange = (fieldName, value) => {
      setEditedInstitute(prevState => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
  
    const handleSave = () => {
        console.log("Salvando alterações:", editedInstitute);
      onSave(editedInstitute); // Chama a função onSave com as informações editadas
      onClose();
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Editar Instituto</h2>
          <div className="field">
            <label>ID:</label>
            <input
              type="text"
              value={editedInstitute.id}
              readOnly
            />
          </div>
          <div className="field">
            <label>Nome:</label>
            <input
              type="text"
              value={editedInstitute.nome}
              onChange={e => handleFieldChange('nome', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Acrônimo:</label>
            <input
              type="text"
              value={editedInstitute.acronimo}
              onChange={e => handleFieldChange('acronimo', e.target.value)}
            />
          </div>
          <div className="modal-buttons">
            <button onClick={onCancel} className='cencelar'>Cancelar</button>
            <button onClick={handleSave} className='salvar'>Salvar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditModal;