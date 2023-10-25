import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaPrincipal.css';
import './Telagrafo.css';

function TelaGrafo() {
  const [selectedProducao, setSelectedProducao] = useState('');
  const [selectedTipoVertice, setSelectedTipoVertice] = useState('Pesquisador');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [producoes, setProducoes] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [regrasNP, setRegrasNP] = useState([


    { cor: 'Verde', inicio: '1', fim: '0' },
    { cor: 'Vermelho', inicio: '', fim: '0' },
    { cor: 'Amarelo', inicio: '', fim: '0' },
  ]);

  // useEffect para buscar a lista de pesquisadores
  useEffect(() => {
    async function fetchPesquisadores() {
      try {
        const response = await axios.get(apiUrlP);
        setListaDePesquisadores(response.data.content);
      } catch (error) {
        console.error("Erro ao buscar a lista de pesquisadores:", error);
      }
    }

    fetchPesquisadores();
  }, [apiUrlP]);

  // useEffect para buscar a lista de institutos
  useEffect(() => {
    async function fetchInstitutos() {
      try {
        const response = await axios.get(apiUrl);
        setListaDeInstitutos(response.data.content);
      } catch (error) {
        console.error("Erro ao buscar a lista de institutos:", error);
      }
    }

    fetchInstitutos();
  }, [apiUrl]);

  // useEffect para buscar a lista de produções
  useEffect(() => {
    fetchProducoes();
  }, []);

  // Função para buscar as produções
  const fetchProducoes = async () => {
    try {
      const response = await axios.get('http://localhost:8083/producao');
      const producoesData = response.data.content;
      setProducoes(producoesData);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
    }
  };

  // Função para lidar com a alteração das regras
  const handleRegraChange = (index, field, value) => {
    const updatedRegras = [...regrasNP];
    updatedRegras[index][field] = value;
  
    if (field === 'inicio') {
      // Aplique o mesmo ajuste para todas as linhas seguintes
      for (let i = index; i <= updatedRegras.length; i++) {
        if (i === 0) {
          updatedRegras[i]['fim'] = (parseInt(updatedRegras[i]['inicio']) + 1).toString();
        } else {
          const currentInicio = parseInt(updatedRegras[i]['inicio']);
          const previousFim = parseInt(updatedRegras[i - 1]['fim']);
          if (currentInicio <= previousFim) {
            updatedRegras[i]['inicio'] = (previousFim + 1).toString();
            updatedRegras[i]['fim'] = (previousFim + 1).toString();
          }
        }
      }
    }
  
    if (field === 'fim') {
      const inicioValue = parseInt(updatedRegras[index]['inicio']);
      const fimValue = parseInt(value);
  
      if (fimValue < inicioValue) {
        updatedRegras[index]['fim'] = (inicioValue + 1).toString();
      }
  
      // Aplique o mesmo ajuste para todas as linhas seguintes
      for (let i = index + 1; i < updatedRegras.length; i++) {
        const currentInicio = parseInt(updatedRegras[i]['inicio']);
        const previousFim = parseInt(updatedRegras[i - 1]['fim']);
        updatedRegras[i]['inicio'] = (previousFim + 1).toString();
        updatedRegras[i]['fim'] = (previousFim + 1).toString();
      }
    }
  
    setRegrasNP(updatedRegras);
  };
  // const [grafoElements, setGrafoElements] = useState([]);
  const handleGerarGrafo = () => {
    //nodes é uma array vazia que será usada para armazenar os nós (ou vértices) do grafo
    //edges é outra array vazia que será usada para armazenar as arestas (ou conexões) entre os nós do grafo.
    //const nodes = [];
    //const edges = [];

    // Adicione nós com base nas seleções
    //  if (selectedTipoVertice === 'Pesquisador') {

    // Adicione os nós dos pesquisadores selecionados
    //nodes.push({ data: { id: pesquisador, label: pesquisador, type: 'Pesquisador' } });
    //  } else if (selectedTipoVertice === 'Instituto') {

    // Adicione os nós dos institutos selecionados
    // nodes.push({ data: { id: instituto, label: instituto, type: 'Instituto' } });
    //  } else if (selectedTipoVertice === 'Producao') {

    // Adicione os nós das produções selecionadas
    //   producoes.forEach((producao) => {
    //   nodes.push({ data: { id: producao.id, label: producao.titulo, type: 'Producao' } });
    //  });
    //  }

    // Adicione arestas com base nas regras
    // regrasNP.forEach((regra, index) => {
    //if (index < regrasNP.length - 1) {
    //  const startNode = nodes.find((node) => node.data.id === regra.inicio);
    //  const endNode = nodes.find((node) => node.data.id === regra.fim);
    //  if (startNode && endNode) {
    //     edges.push({ data: { source: startNode.data.id, target: endNode.data.id, color: regra.cor } });
    //  }
    //  }
    //});

  };

  return (
    <div className="grafo-generator">
      <h2 className="titulo">Gerador de Grafos</h2>
      <div className="configuracoes">
        <div className="combo-box">
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

        <div className="combo-box">
          <select
            value={selectedProducao}
            onChange={(e) => setSelectedProducao(e.target.value)}
          >
            <option value="">Todas</option>
            {/* Outras opções de produções aqui */}
          </select>
        </div>
        <div className="combo-box">
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
        <div className="combo-box">
          <select
            value={selectedTipoVertice}
            onChange={(e) => setSelectedTipoVertice(e.target.value)}
          >
            <option value="Pesquisador">Pesquisador</option>
            <option value="Instituto">Instituto</option>
            <option value="Producao">Produção</option>
          </select>
        </div>
        <button onClick={handleGerarGrafo} className="gerar-button">Gerar Grafo</button>
      </div>

      <div className="regras-plotagem">
        <h2 className="titulo">Regras de Plotagem (Número de Produção - NP)</h2>
        <table className="config-table">
          <thead>
            <tr>
              <th>Vértice (Cor)</th>
              <th>Valor NP (Início)</th>
              <th>Valor NP (Fim)</th>
            </tr>
          </thead>
          <tbody>
            {regrasNP.map((regra, index) => (
              <tr key={index}>
                <td>
                <div className={`color-box ${regra.cor.toLowerCase()}`}></div>
        <span className="color-label">{regra.cor}</span>
                </td>
                <td>
                  <input
                    type="number"
                    value={index === 0 ? '1' : regrasNP[index - 1].fim}
                    onChange={(e) => handleRegraChange(index, 'inicio', e.target.value)}
                    disabled={index !== 0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={regra.fim}
                    onChange={(e) => handleRegraChange(index, 'fim', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
export default TelaGrafo;
