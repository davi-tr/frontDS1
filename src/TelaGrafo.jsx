import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaGrafo.css';

function TelaGrafo() {
  const [selectedProducao, setSelectedProducao] = useState('');
  const [selectedTipoVertice, setSelectedTipoVertice] = useState('Pesquisador');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [producoes, setProducoes] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [pesquisadoresData, setPesquisadoresData] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [regrasNP, setRegrasNP] = useState([
    { cor: 'Verde', inicio: '1', fim: '0' },
    { cor: 'Vermelho', inicio: '', fim: '0' },
    { cor: 'Amarelo', inicio: '', fim: '0' },
  ]);
  const [selectedInstituto, setSelectedInstituto] = useState('');

// Declaração da função para atualizar a lista de pesquisadores
const updatePesquisadoresBasedOnInstituto = async (institutoId) => {
  try {
    const response = await axios.get(apiUrlP);
    const pesquisadoresData = response.data.content;

    // Filtra os pesquisadores com base no instituto selecionado
    const filteredPesquisadores = pesquisadoresData.filter((pesquisador) => {
      return pesquisador.institutoId === institutoId;
    });

    setPesquisadoresData(filteredPesquisadores);
  } catch (error) {
    console.error("Erro ao atualizar a lista de pesquisadores:", error);
  }
};

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
}, []);

useEffect(() => {
  // Aplique a filtragem dos pesquisadores com base no instituto selecionado
  const filteredPesquisadores = pesquisadoresData.filter((pesquisador) => {
    return pesquisador.institutoId === selectedInstituto;
  });

  setPesquisadoresData(filteredPesquisadores);
}, [selectedInstituto]);

const fetchPesquisadoresByInstituto = async (institutoId) => {
  try {
    const response = await axios.get(`${apiUrlP}?institutoId=${institutoId}`);
    const pesquisadoresData = response.data.content;
    setPesquisadoresData(pesquisadoresData);
  } catch (error) {
    console.error("Erro ao buscar pesquisadores:", error);
  }
};

useEffect(() => {
  async function fetchInstitutos() {
    try {
      const response = await axios.get(apiUrl);
      setListaDeInstitutos(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar a lista de institutos:", error);
  const handlePesquisadorSelection = (e, pesquisadorId) => {
    const isChecked = e.target.checked;
    setSelectedPesquisadores((prevSelectedPesquisadores) => {
      if (isChecked) {
        return [...prevSelectedPesquisadores, pesquisadorId];
      } else {
        return prevSelectedPesquisadores.filter((id) => id !== pesquisadorId);
      }
    });
  };
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

  const [selectedPesquisadores, setSelectedPesquisadores] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

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
  }

  fetchInstitutos();
}, []);

const handleInstitutoChange = (e) => {
  const selectedOption = e.target.value;
  setSelectedInstituto(selectedOption);

  if (selectedOption) {
    // Chame a função para buscar pesquisadores com base no instituto selecionado
    fetchPesquisadoresByInstituto(selectedOption);
  } else {
    // Se nenhum instituto for selecionado, limpe a lista de pesquisadores
    setPesquisadoresData([]);
  }
};
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


  // lidar com a alteração das regras
  const handleRegraChange = (index, field, value) => {
    const updatedRegras = [...regrasNP];
    updatedRegras[index][field] = value;

    if (field === 'inicio') {
      // Aplique o mesmo ajuste para todas as linhas seguintes
      for (let i = index; i < updatedRegras.length; i++) {
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


  ///////////////////lógica inicial para gerar grafo
  const handleGerarGrafo = () => {
    const nodes = [];
    const edges = [];
    const nodeMap = {};

    // nós com base nas seleções
    if (selectedTipoVertice === 'Pesquisador') {
      addNode(nodes, pesquisador, pesquisador, 'Pesquisador');
    } else if (selectedTipoVertice === 'Instituto') {
      addNode(nodes, instituto, instituto, 'Instituto');
    } else if (selectedTipoVertice === 'Producao') {
      producoes.forEach((producao) => {
        addNode(nodes, producao.id, producao.titulo, 'Producao');
      });
    }

    // objeto para mapear conexões com base nas regras
    const connections = {};
    regrasNP.forEach((regra) => {
      if (!connections[regra.inicio]) {
        connections[regra.inicio] = [];
      }
      connections[regra.inicio].push(regra.fim);
    });

    // arestas com base nas conexões mapeadas
    Object.keys(connections).forEach((startNodeId) => {
      const startNode = nodes.find((node) => node.data.id === startNodeId);
      if (startNode) {
        connections[startNodeId].forEach((endNodeId) => {
          const endNode = nodes.find((node) => node.data.id === endNodeId);
          if (endNode) {
            const edgeColor = getColorBasedOnProductions(startNodeId, endNodeId); //a cor com base nas produções
            addEdge(edges, startNode, endNode, edgeColor);
          }
        });
      }
    });

  };

  // Função para definir a cor com base na quantidade de produções
  const getColorBasedOnProductions = (startNodeId, endNodeId) => {

    const producoesInicio = countProductions(startNodeId);
    const producoesFim = countProductions(endNodeId);
    if (producoesInicio > producoesFim) {
      return 'verde';
    } else if (producoesInicio < producoesFim) {
      return 'vermelho';
    } else {
      return 'amarelo';
    }
  };

  // Função para contar as produções com base no nó
  const countProductions = (nodeId) => {
    const pesquisador = pesquisadores.find((pesquidador) => pesquisador.idXML === nodeId);
    if (pesquisador) {
      return pesquisador.producoes.length;
    } else {
      return 0; // Nenhum pesquisador encontrado ou nenhuma produção associada
    }
  };
  /////////////////final da logica de gerar grafo

  return (
    <div className="grafo-generator">
      <h2 className="titulo">Gerador de Grafos</h2>
      <div className="configuracoes">
      <div className="combo-box">
          <select
            value={selectedInstituto}
            onChange={handleInstitutoChange}
          >
            <option value="">Selecione o(s) Instituto(s)</option>
            {listaDeInstitutos.map((instituto) => (
              <option key={instituto.id} value={instituto.id}>
                {instituto.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de pesquisadores com base na seleção do instituto */}
        {instituto && (
          <div className="combo-box" style={{ maxWidth: '200px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', position: 'relative' }}>
            <button onClick={toggleList} style={{ position: 'absolute', top: '10px', right: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
              {isListOpen ? 'Fechar' : 'Abrir Lista'}
            </button>
            {isListOpen && (
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {listaDePesquisadores
                  .filter((pesquisador) => pesquisador.institutoId === instituto.id) // Filtra pesquisadores pelo instituto selecionado
                  .map((pesquisador) => (
                    <div key={pesquisador.idXML} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        value={pesquisador.idXML}
                        checked={selectedPesquisadores.includes(pesquisador.idXML)}
                        onChange={(e) => handlePesquisadorSelection(e, pesquisador.idXML)}
                        style={{ marginRight: '5px' }}
                      />
                      <label style={{ fontSize: '14px' }}>{pesquisador.nome}</label>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        <div className="combo-box">
          <select
            value={selectedProducao}
            onChange={(e) => setSelectedProducao(e.target.value)}
          >
            <option value="">Todas</option>
          </select>
        </div>
        <div className="combo-box">
  {pesquisadoresData.length > 0 ? (
    <>
      <button className="close-button" onClick={handlePesquisadorButtonClick}>
        Fechar
      </button>
      <select
        value={pesquisador}
        onChange={(e) => setPesquisador(e.target.value)}
      >
        <option value="">Selecione o Pesquisador</option>
        {pesquisadoresData.map((pesquisador) => (
          <option key={pesquisador.idXML} value={pesquisador.idXML}>
            {pesquisador.nome}
          </option>
        ))}
      </select>
    </>
  ) : (
    <button className="open-button" onClick={handlePesquisadorButtonClick}>
      Abrir Lista
    </button>
  )}
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
        <button onClick={handleGerarGrafo} className="gerar-button">
          Gerar Grafo
        </button>
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
