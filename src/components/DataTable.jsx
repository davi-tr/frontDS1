import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ nome: '', acronimo: '' });
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 2;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto?page=${page}&size=${pageSize}`);
      setData(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEdit = id => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ nome: itemToEdit.nome, acronimo: itemToEdit.acronimo });
      setEditItemId(id);
    }
  };

  const handleEditSubmit = async event => {
    event.preventDefault();

    try {
      if (editItemId !== null) {
        // Lógica de edição aqui (usar API PUT)
        const editData = {
          id: editItemId,
          nome: newItem.nome,
          acronimo: newItem.acronimo
        };

        await axios.put(`http://localhost:8080/instituto`, editData);
      } else {
        // Lógica de criação aqui (usar API POST)
        await axios.post('http://localhost:8080/instituto', newItem);
      }
      fetchData();
      setNewItem({ nome: '', acronimo: '' });
      setEditItemId(null);
    } catch (error) {
      console.error('Erro ao salvar alteração:', error);
    }
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:8080/instituto/${id}`)
      .then(() => {
        fetchData();
      })
      .catch(error => {
        console.error('Erro ao deletar cadastro:', error);
      });
  };

  return (
    <div className="container">
      <h2>Tabela de Dados</h2>
      <div className="form-container">
        <form onSubmit={handleEditSubmit}>
          <label>
            Nome:
            <input type="text" name="nome" value={newItem.nome} onChange={handleInputChange} />
          </label>
          <label>
            Acrônimo:
            <input type="text" name="acronimo" value={newItem.acronimo} onChange={handleInputChange} />
          </label>
          <button type="submit">{editItemId !== null ? 'Salvar Edição' : 'Adicionar'}</button>
        </form>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Acrônimo</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.acronimo}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(item.id)}>Editar</button>
                <button className="delete-button" onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination" align="center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Anterior
        </button>
        <span>Página {currentPage + 1}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default DataTable;
