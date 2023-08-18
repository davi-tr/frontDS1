// Importações necessárias
import React, { useState, useEffect } from 'react'; // Importa funcionalidades do React
import axios from 'axios'; // Importa a biblioteca Axios para requisições HTTP
import './DataTable.css'; // Importa estilos CSS

// Componente DataTable
const DataTable = () => {
  // Estados para armazenar dados e controle de interações
  const [data, setData] = useState([]); // Armazena os dados da tabela
  const [newItem, setNewItem] = useState({ nome: '', acronimo: '' }); // Dados para adicionar/editar
  const [editItemId, setEditItemId] = useState(null); // ID do item em edição
  const [currentPage, setCurrentPage] = useState(0); // Página atual da tabela
  const [totalElements, setTotalElements] = useState(false); // Total de elementos na API
  const [itensPerPage, setItensPerPage] = useState(3); // Quantidade de itens por página
  const [paginaFim, setPaginaFim] = useState(false); // Indica se chegou ao final da página

  // Cálculos de paginação
  const pages = Math.ceil(totalElements / itensPerPage); // Calcula o número total de páginas
  const startIndex = currentPage * itensPerPage; // Índice inicial dos itens a serem exibidos
  const endIndex = startIndex + itensPerPage; // Índice final dos itens a serem exibidos
  const currentItens = data.slice(startIndex, endIndex); // Itens a serem exibidos na página atual

  // Efeito para buscar dados quando a página atual muda
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Efeito para voltar à primeira página quando a quantidade de itens por página muda
  useEffect(() => {
    setCurrentPage(0);
  }, [itensPerPage]);

  // Função para buscar dados da API
  const fetchData = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto?page=${page}`);
      setData(response.data.content); // Define os dados da API no estado 'data'
      setTotalElements(response.data.totalElements); // Define o total de elementos da API
      updateState(page); // Atualiza o estado da página final
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };

  // Função para atualizar estado da página final
  const updateState = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8080/instituto?page=${page}`);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }

    // Define 'paginaFim' baseado no total de elementos
    if (totalElements) {
      setPaginaFim(true);
    } else {
      setPaginaFim(false);
    }
  };

  // Função para atualizar dados do estado 'newItem'
  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Função para editar item
  const handleEdit = id => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ nome: itemToEdit.nome, acronimo: itemToEdit.acronimo });
      setEditItemId(id);
    }
  };

  // Função para submeter edição ou criação
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
      fetchData(); // Atualiza os dados após edição/criação
      setNewItem({ nome: '', acronimo: '' }); // Limpa os campos do formulário
      setEditItemId(null); // Limpa o ID de edição
    } catch (error) {
      console.error('Erro ao salvar alteração:', error);
    }
  };

  // Função para ir para a próxima página
  const handleNextPage = () => {
    if (!paginaFim) {
      setCurrentPage(currentPage + 1);
      updateState(currentPage + 1);
    }
  };

  // Função para ir para a página anterior
  const handlePreviousPage = () => {
    if (currentPage >= 1) {
      updateState(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para deletar um item
  const handleDelete = id => {
    axios.delete(`http://localhost:8080/instituto/${id}`)
      .then(() => {
        fetchData(); // Atualiza os dados após exclusão
      })
      .catch(error => {
        console.error('Erro ao deletar cadastro:', error);
      });
  };

  // Renderização da interface
  return (
    <div className="container">
      <h2 className="titulo">Tabela de Dados</h2>
      <div className="form-container">
        {/* Formulário para edição/adicionamento */}
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
      {/* Tabela para exibir dados */}
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
          {/* Mapeia e exibe os itens da página atual */}
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
      {/* Componente de paginação */}
      <div className='pagination'>
        {Array.from(Array(pages), (item, index) => {
          return <button className= "botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))} key={index}>{index+1}</button>
        })}
      </div>
      {/* Seleção de quantidade de itens por página */}
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

// Exporta o componente DataTable
export default DataTable;
