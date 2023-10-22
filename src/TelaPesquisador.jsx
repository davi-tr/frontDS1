import React, { useState, useEffect } from 'react';
import DataTable from './components/Instituto/DataTable';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import './TelaPesquisador.css';
import 'react-toastify/dist/ReactToastify.css';
import '../src/components/Instituto/AddResearcherForm';


function TelaPesquisador() {
    const [mostrarDataTable, setMostrarDataTable] = useState(false);
    const [pesquisadores, setPesquisadores] = useState([]);
    const [selectedPesquisador, setSelectedPesquisador] = useState(null);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const [pesquisadorXmlId, setPesquisadorXmlId] = useState(null); // Defina o estado para o ID do pesquisador do XML
    const [pesquisadorAdicionadoId, setPesquisadorAdicionadoId] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);

    // Estado para armazenar o número total de elementos na tabela
    const [totalElements, setTotalElements] = useState(false);

    // Estado para controlar a quantidade de itens por página
    const [itensPerPage, setItensPerPage] = useState(3);// Inicialize com 0

    const startIndex = currentPage * itensPerPage;
    const endIndex = startIndex + itensPerPage;
    const currentItens = pesquisadores.slice(startIndex, endIndex);

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [filter, setFilter] = useState('all');

    const pages = Math.ceil(totalElements / itensPerPage);
    const [researcherId, setResearcherId] = useState('');
    const [instituteId, setInstituteId] = useState('');
    const [institutes, setInstitutes] = useState([]);
    const [responseControl, setResponseControl] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filteredInstitutes, setFilteredInstitutes] = useState([]);


    useEffect(() => {
        fetchPesquisadores();
    }, [currentPage]);
    //
    useEffect(() => {
        setCurrentPage(0);
        fetchPesquisadores();
    }, [itensPerPage]);

    useEffect(() => {
        if (searchText) {
            searchPesquisadores();
        } else {
            fetchPesquisadores(currentPage); // Caso contrário, busque os resultados com paginação
        }
    }, [currentPage, searchText]); // Atualize sempre que a página ou pesquisa mudar


    useEffect(() => {
        fetchInstitutes();
    }, []);

    useEffect(() => {
        const filtered = institutes.filter((institute) =>
            institute.nome.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredInstitutes(filtered);
    }, [searchText, institutes]);


    const fetchInstitutes = async () => {
        try {
            const response = await axios.get('http://localhost:8083/instituto');
            setInstitutes(response.data.content);
        } catch (error) {
            console.error('Erro ao buscar a lista de institutos:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedInstitute = institutes.find(
            (institute) => institute.id === parseInt(instituteId)
        );
        if (!selectedInstitute) {
            toast.error('ID do instituto inválido.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8083/pesquisador', {
                idPesquisador: researcherId,
                idinstituto: parseInt(instituteId),
            });

            console.log(response);

            onClose();

            // Exibe o alerta de sucesso apenas se o cadastro for bem-sucedido
            toast.success('Pesquisador cadastrado com sucesso!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });


            // Atualize a tabela apenas se o cadastro for bem-sucedido

            fetchPesquisadores();
            updateTable();

        } catch (error) {
            console.error('Erro ao cadastrar pesquisador:', error.response.data.mensagem);

            // Exibe o alerta de erro apenas se ocorrer um erro no cadastro
            toast.error(`Erro ao cadastrar pesquisador. Por favor, tente novamente. ERRO:${error.response.data.mensagem}`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    const handleSearchFilter = () => {
        fetchData(); // Atualize os dados com base na pesquisa e no filtro
    };
    const handleSearch = () => {
        fetchData(); // Atualize os dados com base na pesquisa
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const searchPesquisadores = async () => {
        try {
            let response;
            if (filter === 'all') {
                response = await axios.get(`http://localhost:8083/pesquisador?search=${searchText}`);
            } else if (filter === 'nome') {
                response = await axios.get(`http://localhost:8083/pesquisador?nome=${searchText}`);
            } else if (filter === 'idXML') {
                response = await axios.get(`http://localhost:8083/pesquisador?idXML=${searchText}`);
            }

            setSearchResults(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados da API:', error);
        }
    };

    const fetchPesquisadores = async () => {
        try {
            const response = await axios.get(`http://localhost:8083/pesquisador?page=${currentPage}&size=${itensPerPage}`);
            setPesquisadores(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Erro ao buscar a lista de pesquisadores:', error);
        }
    };

    const handleDeleteClick = async (pesquisadorId) => {
        try {
            await axios.delete(`http://localhost:8083/pesquisador/${pesquisadorId}`);
            // Atualizar a lista de pesquisadores após a exclusão
            fetchPesquisadores();
            setSelectedPesquisador(null); // Limpar a seleção
        } catch (error) {
            console.error('Erro ao excluir o pesquisador:', error);
        }
    };

    const handlePesquisadorSelect = (pesquisador) => {
        setSelectedPesquisador(pesquisador);
        setSelectedRowId(pesquisador.idXML);
    };

    const handleRowClick = (pesquisador) => {
        setSelectedPesquisador(pesquisador);
        setPesquisadorAdicionadoId(pesquisador.idXML); // Atualizar o estado com o ID do pesquisador
    };

    return (


        <div className="container">
            <h2 className="titulo">Pesquisadores Cadastrados </h2>

            <div className="search-and-buttons">
                <div className="search-input">
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="nome">Nome</option>
                        <option value="idXML">ID</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou ID"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <div className="edit-delete-buttons">

                    <button onClick={() => setModalIsOpen(true)} className="add-button">
                        Cadastrar Pesquisador
                    </button>
                    <button
                        className="delete-button"
                        disabled={!selectedPesquisador}
                        onClick={() => setShowConfirmationPopup(true)}
                    >
                        Excluir
                    </button>

                </div>

            </div>

            <div className="form-container">
                
                <table className="data-table-pesquisadores">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOME</th>
                            <th>INSTITUTO</th>
                            <th>ACRÔNIMO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 ? (
                            searchResults.map((pesquisador) => (
                                <tr
                                    key={pesquisador.id}
                                    onClick={() => handleRowClick(pesquisador)}
                                    className={selectedPesquisador === pesquisador ? 'selected-row' : ''}
                                >
                                    <td>{pesquisador.idXML}</td>
                                    <td>{pesquisador.nome}</td>
                                    <td>{pesquisador.instituto.nome}</td>
                                    <td>{pesquisador.instituto.acronimo}</td>
                                </tr>
                            ))
                        ) : (
                            pesquisadores.map((pesquisador) => (
                                <tr
                                    key={pesquisador.id}
                                    onClick={() => handleRowClick(pesquisador)}
                                    className={selectedPesquisador === pesquisador ? 'selected-row' : ''}
                                >
                                    <td>{pesquisador.idXML}</td>
                                    <td>{pesquisador.nome}</td>
                                    <td>{pesquisador.instituto.nome}</td>
                                    <td>{pesquisador.instituto.acronimo}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={showConfirmationPopup}
                onRequestClose={() => setShowConfirmationPopup(false)}
                contentLabel="Confirmar Exclusão"
                className="modal-popup"
                overlayClassName="modal-overlay"
            >
                <div className="modal-content">
                    <h2 className="modal-header">Confirmar Exclusão</h2>
                    {selectedPesquisador && pesquisadorAdicionadoId !== null && (
                        <p>
                            Deseja realmente excluir o pesquisador com ID:  <span className="highlighted-id">{pesquisadorAdicionadoId}</span>?
                        </p>
                    )}
                    <div className="add-modal-button-container">
                        <button
                            className="delete-button"
                            onClick={() => {
                                if (selectedPesquisador && pesquisadorAdicionadoId !== null) {
                                    handleDeleteClick(selectedPesquisador.id);
                                    setShowConfirmationPopup(false);
                                }
                            }}
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => setShowConfirmationPopup(false)}
                            className="add-button"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            <div className='pagination'>
                {Array.from(Array(pages), (item, index) => {
                    return <button className="botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))} key={index}>{index + 1}</button>
                })}
            </div>
            <div className='seletor'>
                <p className='informe'>Quantidade de itens por página</p>
                <select className='qtdItens' value={itensPerPage} onChange={(e) => setItensPerPage(Number(e.target.value))}>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                </select>
            </div>




            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Cadastrar Pesquisador"
                className="modal-popup"
                overlayClassName="modal-overlay"
            >
                <div className="modal-content">  {/* Adicione uma div para envolver o conteúdo do modal */}
                    <h2 className="modal-header"> Cadastrar Pesquisador </h2>
                    <form onSubmit={handleSubmit}>
                        <label className="add-modal-label">
                            <input
                                type="text"
                                value={researcherId}
                                onChange={(e) => setResearcherId(e.target.value)}
                                className="add-modal-input"
                                placeholder="ID pesquisador"
                            />
                        </label>

                        <label className="add-modal-label">
                            <input
                                type="text"
                                placeholder="Pesquisar instituto"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="add-modal-input"
                            />
                            <select
                                value={instituteId}
                                onChange={(e) => setInstituteId(e.target.value)}
                                className="add-modal-input"
                            >
                                <option value="">Selecione um instituto</option>
                                {filteredInstitutes.map((institute) => (
                                    <option key={institute.id} value={institute.id}>
                                        {institute.nome}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="add-modal-button-container">
                            <button onClick={() => setModalIsOpen(false)} className="mr-2 delete-button">
                                Fechar
                            </button>
                            <button type="submit" className="add-button">
                                Cadastrar
                            </button>

                        </div>
                    </form>
                </div>
                <h2 className="modal-header"></h2>
                <form onSubmit={handleSubmit}  >
                    <label className="add-modal-label">
                        <input
                            type="text"
                            value={researcherId}
                            onChange={(e) => setResearcherId(e.target.value)}
                            className="add-modal-input"
                            placeholder="ID pesquisador"
                        />
                    </label>
                </form>
            </Modal>

            <ToastContainer />
        </div>













    );






};
export default TelaPesquisador;