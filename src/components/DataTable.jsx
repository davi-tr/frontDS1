import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ nome: '', acronimo: '' });
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const apiUrl = 'http://localhost:8080/instituto'; // Substitua pela URL correta da API

    axios.get(apiUrl)
      .then(response => {
        const responseData = response.data.content;
        setData(responseData);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados da API:', error);
      });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios.post('http://localhost:8080/instituto', newItem) // Substitua pela URL correta da API para criar novos itens
      .then(() => {
        fetchData();
        setNewItem({ nome: '', acronimo: '' });
      })
      .catch(error => {
        console.error('Erro ao criar novo cadastro:', error);
      });
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
    axios.delete(`http://localhost:8080/instituto/${id}`) // Substitua pela URL correta da API para deletar itens
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
      <table>
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
                <button onClick={() => handleEdit(item.id)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default DataTable;
