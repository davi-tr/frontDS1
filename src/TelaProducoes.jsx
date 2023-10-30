import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaProducao.css';
import './TelaPrincipal.css';

function TelaProducoes() {
  const [producoes, setProducoes] = useState([]);
  const [anoInicio, setAnoInicio] = useState('');
  const [anoFim, setAnoFim] = useState(new Date().getFullYear().toString());
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [tipoProducao, setTipoProducao] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [novosPesquisadores, setNovosPesquisadores] = useState([]);
  const pagesVisited = currentPage * itemsPerPage;

  const autoresComplementares = [];

  /*if (producao.tipo === 'Artigo') {
    const tituloEspecifico = producao.titulo; // Use o título do artigo atual
    autoresComplementares = autoresComplementares.filter((autor) =>
      autor.includes(tituloEspecifico)
    );
  }*/


  const displayProducoes = [...producoes, ...novosPesquisadores]
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((producao, index) => (

      <tr key={index}>
        <td>{producao.tipo}</td>
        <td>
          {producao.id} - {producao.tipo} : {producao.titulo} . De {producao.ano}
          <br />
          Autores: {producao.pesquisador.map(pesquisador => pesquisador.nome).join(', ')} |
          Autores Complementares: {autoresComplementares.join(', ')}
        </td>
      </tr>
    ));



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
        setProducoes(filteredProducoes);
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
        setProducoes(filteredProducoes);
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }
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
            onChange={(e) => setInstituto(e.target.value)}
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
            {listaDePesquisadores.map((pesquisador) => (
              <option key={pesquisador.idXML} value={pesquisador.idXML}>
                {pesquisador.nome}
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
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
          {"<<"}
        </button>
        <span>{currentPage + 1}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount - 1}>
          {">>"}
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