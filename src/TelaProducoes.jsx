import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaProducao.css';

function TelaProducoes() {
  const [producoes, setProducoes] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [tipoProducao, setTipoProducao] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";


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
      const producoesData = data.content; // Acesso ao array de produções

      setProducoes(producoesData);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
    }
  };


  const handleBusca = () => {
    // Verifica se todos os campos estão preenchidos
    if (dataInicio && dataFim && instituto && pesquisador && tipoProducao) {
      // Aqui você pode aplicar filtros se necessário
      // Seus filtros

      // Atualiza o estado
      // Não é necessário atualizar o estado aqui, pois os dados serão buscados da API
    } else {
      // Mensagem de erro se algum campo estiver vazio
      alert('Preencha todos os campos de filtro.');
    }
  };

  useEffect(() => {

    // Faz uma solicitação à API para buscar os dados
    axios.get('http://localhost:8083/producao')
      .then((response) => {

        // Acesso à matriz de produções na resposta da API
        setProducoes(response.data.content);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
      });
  }, []);


  return (
    <div>
      <h2 className="titulo">Itens de produção</h2>

      <div className="row">
        <div className="column">
          <input
            type="text"
            placeholder="Data Início"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="custom-input"
          />
        </div>

        <div className="column">
          <input
            type="text"
            placeholder="Data Fim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
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
      <table className="custom-table">
        <thead>
          <tr>
            <th>Tipo de Produção</th>
            <th>Detalhamento</th>
          </tr>
        </thead>
        <tbody>
          {producoes.map((producao, index) => (
            <tr key={index}>
              <td>{producao.tipo}</td>
              <td>
                {producao.id} ; {producao.titulo} | {producao.ano}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TelaProducoes;
