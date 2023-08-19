import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTable.css';

// Componente DataTable
const DataTable = () => {
  // Estado para armazenar os dados da tabela
  const [data, setData] = useState([]);

  // Estado para armazenar um novo item a ser adicionado ou editado
  const [newItem, setNewItem] = useState({ nome: '', acronimo: '' });

  // Estado para armazenar o ID do item em edição
  const [editItemId, setEditItemId] = useState(null);

  // Estado para controlar a página atual da tabela
  const [currentPage, setCurrentPage] = useState(0);

  // Estado para armazenar o número total de elementos na tabela
  const [totalElements, setTotalElements] = useState(false);

  // Estado para controlar a quantidade de itens por página
  const [itensPerPage, setItensPerPage] = useState(3);

  // Estado para verificar se chegou ao fim das páginas
  const [paginaFim, setPaginaFim] = useState(false);

  // Calcula o número de páginas com base no número total de elementos e itens por página
  const pages = Math.ceil(totalElements / itensPerPage);

  // Calcula o índice inicial e final dos itens na página atual
  const startIndex = currentPage * itensPerPage;
  const endIndex = startIndex + itensPerPage;
  const currentItens = data.slice(startIndex, endIndex);

  // Função para buscar os dados da API com base na página atual
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Atualiza a página de volta para a primeira sempre que a quantidade de itens por página é alterada
  useEffect(() => {
    setCurrentPage(0);
  }, [itensPerPage]);

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto`);
      setData(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };

  // Função para lidar com a mudança nos campos de entrada
  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Função para iniciar a edição de um item
  const handleEdit = id => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ nome: itemToEdit.nome, acronimo: itemToEdit.acronimo });
      setEditItemId(id);
    }
  };

  // Função para lidar com a submissão de uma edição ou adição
  const handleEditSubmit = async event => {
    event.preventDefault();

    try {
      if (editItemId !== null) {
        // Lógica de edição aqui (usar API PUT para atualizar um item existente)
        const editData = {
          id: editItemId,
          nome: newItem.nome,
          acronimo: newItem.acronimo
        };

        await axios.put(`http://localhost:8080/instituto`, editData);
      } else {
        // Lógica de criação aqui (usar API POST para adicionar um novo item)
        await axios.post('http://localhost:8080/instituto', newItem);
      }
      fetchData(); // Atualiza a lista após a edição ou adição
      setNewItem({ nome: '', acronimo: '' }); // Limpa os campos
      setEditItemId(null); // Limpa o ID de edição
    } catch (error) {
      console.error('Erro ao salvar alteração:', error);
    }
  };

  // Função para atualizar o estado e verificar se chegou ao fim das páginas
  const updateState = async page => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto?page=${page}`);
      setTotalElements(response.data.empty);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }

    if (totalElements) {
      setPaginaFim(true); // Se não houver mais elementos, marca como o fim das páginas
    } else {
      setPaginaFim(false);
    }
  };

  // Função para avançar para a próxima página
  const handleNextPage = () => {
    if (!paginaFim) { // Verifica se não chegou ao fim das páginas
      setCurrentPage(currentPage + 1);
      updateState(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage >= 1) {
      updateState(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para excluir um item
  const handleDelete = id => {
    axios
      .delete(`http://localhost:8080/instituto/${id}`)
      .then(() => {
        fetchData(); // Atualiza a lista após a exclusão
      })
      .catch(error => {
        console.error('Erro ao deletar cadastro:', error);
      });
  };

  // Renderiza a interface de usuário
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

      {/* Interface para navegação entre páginas */}
      <div className='pagination'>
        {Array.from(Array(pages), (item, index) => {
          return <button className="botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))} key={index}>{index + 1}</button>
        })}
      </div>
      {/* Interface para seleção de itens por página */}
      <div className='seletor'>
        <p className='informe'>Quantidade de itens por página</p>
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
