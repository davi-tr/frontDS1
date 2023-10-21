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
  const [itensPerPage, setItensPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [producoesOriginais, setProducoesOriginais] = useState([]);

  const pagesVisited = currentPage * itemsPerPage;

  const displayProducoes = producoes
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((producao, index) => (
      <tr key={index}>
        <td>{producao.tipo}</td>
        <td>
          {producao.id} - {producao.tipo} : {producao.titulo} . De {producao.ano}
          <br />
          Autores: {producao.pesquisador.map(pesquisador => pesquisador.nome).join(', ')}
          {/* Autores complementares: producao.autorcomplementar.map(autorcomplementar => autorcomplementar.nome).join(', ') */}
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(producoes.length / itemsPerPage);

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

  const fetchProducoes = async () => {
    try {
      const response = await fetch('http://localhost:8083/producao');
      const data = await response.json();
      const producoesData = data.content;
      setProducoes(producoesData);
      setProducoesOriginais(producoesData);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
    }
  };

  const handleBusca = () => {
    if (anoInicio && pesquisador) {
      const filteredProducoes = producoesOriginais.filter(producao => {
        const dataProducao = new Date(producao.ano);
        const dataInicioFilter = new Date(anoInicio);
        const dataFimFilter = new Date(anoFim);
        return dataProducao.getFullYear() >= dataInicioFilter.getFullYear() &&
          dataProducao.getFullYear() <= dataFimFilter.getFullYear() &&
          producao.instituto === instituto;
      });
      setProducoes(filteredProducoes);
    } else {
      alert('Preencha o ano inicial e selecione o Pesquisador para aplicar o filtro.');
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
          Anterior
        </button>
        {[...Array(pageCount)].map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index)} disabled={currentPage === index}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount - 1}>
          Próximo
        </button>
      </div>
      <div className="seletor">
        <p className='informe'>Quantidade de itens por página</p>
        <select className='qtdItens' value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
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
