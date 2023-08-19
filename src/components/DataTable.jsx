import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ nome: '', acronimo: '' });
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(false);
  const [itensPerPage,  setItensPerPage] = useState(3);
  const [paginaFim, setPaginaFim] = useState(false);

  
  const pages = Math.ceil(totalElements/itensPerPage)
  const startIndex = currentPage * itensPerPage;
  const endIndex = startIndex + itensPerPage
  const currentItens = data.slice(startIndex, endIndex)

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() =>{
    setCurrentPage(0)
  }, [itensPerPage])

  


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto`);
      setData(response.data.content);
      setTotalElements(response.data.totalElements)
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

  const updateState =  async (page) => {

    try {
      const response = await axios.get(`http://localhost:8080/instituto?page=${page}`);
      setTotalElements(response.data.empty);
      console.log(response)
      console.log(totalElements)
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }

    if (totalElements) {
      setPaginaFim(true);
    } else {
      setPaginaFim(false);
    }
  };

  
  const handleNextPage = () => {
    if (!paginaFim) {
      setCurrentPage(currentPage + 1);
      updateState(currentPage + 1);
    }
  };

   const handlePreviousPage = () => {
    if (currentPage >= 1) {
      updateState(currentPage - 1);
      setCurrentPage(currentPage - 1);
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
      
      <h2 className="titulo">Tabela de Dados</h2>
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
          {currentItens.map(item => (
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


      <div className='pagination'>
        {Array.from(Array(pages), (item, index) => {
          return <button className= "botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))}key={index}>{index+1}</button>
        })}

      </div>
        <div className='seletor'>
        <p className='informe'>Quantidade de itens por pagina</p>
        <select className='qtdItens' value={itensPerPage} onChange={(e) => setItensPerPage(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>
      

    </div>
  );
};

export default DataTable;
