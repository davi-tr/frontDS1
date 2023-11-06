import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaProducao.css';
import Home from './TelaHome.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function TelaProducoes() {
  const [producoes, setProducoes] = useState([]);
  const [anoInicio, setAnoInicio] = useState('');
  const [anoFim, setAnoFim] = useState(new Date().getFullYear().toString());
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [autoresComplementares, setAutoresComplementares] = useState([]);
  const [tipoProducao, setTipoProducao] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [novosPesquisadores, setNovosPesquisadores] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('')
  const pagesVisited = currentPage * itemsPerPage;


  const displayProducoes = [...producoes, ...novosPesquisadores]
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((producao, index) => {
      const autoresComplementares = producao.autorComplementar.id
      console.log(autoresComplementares)

      return (
        <tr key={index}>
          <td>{producao.tipo}</td>
          <td>
            {producao.id} - {producao.tipo} : {producao.titulo} . De {producao.ano}
            <br />
            Autores: {producao.pesquisador.map(pesquisador => pesquisador.nome).join(', ')} |
            Autores Complementares: {producao.autorComplementar.map(autorComplementar => autorComplementar.nomeCita).join(', ')}
          </td>
        </tr>
      );
    });



  const pageCount = Math.ceil(producoes.length / itemsPerPage) + Math.ceil(novosPesquisadores.length / itemsPerPage);

  useEffect(() => {
    async function fetchPesquisadores() {
      try {
        const response = await fetch(apiUrlP);
        if (response.ok) {
          const data = await response.json();
          setListaDePesquisadores(data.content);
        }
      } catch (error) {
        console.error("Erro ao buscar a lista de pesquisadores:", error);
      }
    }

    fetchPesquisadores();
  }, [apiUrlP]);

  useEffect(() => {
    async function fetchInstitutos() {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setListaDeInstitutos(data.content);
        }
      } catch (error) {
        console.error("Erro ao buscar a lista de institutos:", error);
      }
    }
    fetchInstitutos();
  }, [apiUrl]);

  useEffect(() => {
    fetchProducoes();
  }, []);

  useEffect(() => {
    if (novosPesquisadores.length > 0) {
      setProducoes([producoes, novosPesquisadores]);
      setNovosPesquisadores([]);
    }
  }, [novosPesquisadores, producoes]);

  const fetchProducoes = async () => {
    try {
      const response = await fetch('http://localhost:8083/producao');
      const data = await response.json();
      const producoesData = data.content;
      setProducoes(producoesData);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
    }
  };



  const handleBusca = async () => {
    console.log("instituto:", instituto, "anoInicial: ", anoInicio, "pesquisador:", pesquisador, "tipo de producao:", tipoProducao)
    if (anoInicio != "" && pesquisador != "") {
      try {
        const response = await fetch(`http://localhost:8083/producao/pesquisador=${pesquisador}/datas=${anoInicio}-2023`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }


      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
    else if (anoInicio != "" && instituto != "") {
      console.log("caso 2")

      try {
        const response = await fetch(`http://localhost:8083/producao/datas=${anoInicio}-2023/instituto=${instituto}`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
    else if (anoInicio != "" && instituto == "") {
      console.log("caso 3")

      try {
        const response = await fetch(`http://localhost:8083/producao/datas=${anoInicio}-2023`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
        setProducoes(filteredProducoes);
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }

    else if (anoInicio == "" && instituto == "" && tipoProducao != "") {
      console.log("caso 6")

      try {
        const response = await fetch(`http://localhost:8083/producao`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
       
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }

    else if (anoInicio == '' && pesquisador == '' && instituto != '') {
      try {
        const response = await fetch(`http://localhost:8083/producao/instituto=${instituto}`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
    else if (anoInicio != '' && pesquisador != '' && instituto != '') {
      try {
        const response = await fetch(`http://localhost:8083/producao/instituto=${instituto}`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
    
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
    else if (anoInicio == '' && pesquisador != '' && instituto != '') {
      try {
        const response = await fetch(`http://localhost:8083/producao/pesquisador=${pesquisador}&instituto=${instituto}`);
        console.log(response);
        const data = await response.json();
        if (tipoProducao === "Artigo") {
          const filteredProducoes = data.content.filter(item => item.tipo === "ARTIGO");
          setProducoes(filteredProducoes);
        }
        else if (tipoProducao === "Livro") {
          const filteredProducoes = data.content.filter(item => item.tipo === "LIVRO");
          setProducoes(filteredProducoes);
        }
        else {
          const filteredProducoes = data.content
          setProducoes(filteredProducoes);
        }
    
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
    else {
      toast.error("Preencha algum campo para realizar a busca");
    }
  };



  const getPaginationGroup = () => {
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(start + 4, pageCount - 1);
    start = Math.max(0, end - 4);
    
    return new Array(end - start + 1).fill().map((_, idx) => start + idx);
    
  };

  
  return (
    <div className="tela-producoes">
      <h2 className="titulo">Itens de produção</h2>

      <div className="row">
        <div className="column">
          <input
            type="number"
            placeholder="Ano Inicial"
            value={anoInicio}
            onChange={(e) => setAnoInicio(e.target.value)}
            className="custom-input"
          />
        </div>

        <div className="column">
          <input
            type="text"
            value={anoFim}
            disabled
            className="custom-input"
          />
        </div>

        <div className="column">
          <select
            value={instituto}
            onChange={(e) => {
              const selectedInstituto = e.target.value;
              setInstituto(selectedInstituto);
              setPesquisador("");
               // Limpar a seleção de pesquisador ao selecionar um instituto
            }}
            className="custom-input"
          >
            <option value="">Selecione o Instituto</option>
            {listaDeInstitutos.map((instituto) => (
              <option key={instituto.id} value={instituto.id}>
                {instituto.nome}
              </option>
            ))}
          </select>
        </div>
       
    <div className="column">
  <select
    value={pesquisador}
    onChange={(e) => setPesquisador(e.target.value)}
    className="custom-input"
  >
    <option value="">Selecione o Pesquisador</option>
    {listaDePesquisadores
  .filter(item => !instituto || item.instituto && item.instituto.id === parseInt(instituto))
  .map(item => (
    <option key={item.id} value={item.idXML}>
      {item.nome}
    </option>
  ))}
  </select>
</div>


        <div className="column"></div>

        <div className="column">
          <select
            value={tipoProducao}
            onChange={(e) => setTipoProducao(e.target.value)}
            className="custom-input"
          >
            <option value="">Tipo de Produção</option>
            <option value="Artigo">Artigo</option>
            <option value="Livro">Livro</option>
          </select>
        </div>
      </div>

      <button onClick={handleBusca} className="add-button">
        Aplicar
      </button>


      <table className="data-table-pesquisadores">
        <thead>
          <tr>
            <th>Tipo de Produção</th>
            <th>Detalhamento</th>
          </tr>
        </thead>
        <tbody>
          {displayProducoes}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
          {"|<"}
        </button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
          {"<"}
        </button>
        {getPaginationGroup().map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(item)}
            className={currentPage === item ? 'active' : ''}
          >
            {item + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount - 1}>
          {">"}
        </button>
        <button onClick={() => setCurrentPage(pageCount - 1)} disabled={currentPage === pageCount - 1}>
          {">|"}
        </button>
      </div>
      <div className="seletor">
        <p className='informe'>Quantidade de itens por página</p>
        <select className='qtdItens' value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>
    </div>
  );
}

export default TelaProducoes;