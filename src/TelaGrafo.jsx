import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GraphComponent from './Grafos'; // Ajuste o caminho do componente conforme necessário
import './TelaPrincipal.css';
import './Telagrafo.css';

function TelaGrafo() {
  const [selectedTipoVertice, setSelectedTipoVertice] = useState('Pesquisador');
  const [producoes, setProducoes] = useState([]);
  const apiUrlProducao = "http://localhost:8083/producao";

  const [regrasNP, setRegrasNP] = useState([
    { cor: 'Verde', inicio: '1', fim: '0' },
    { cor: 'Vermelho', inicio: '', fim: '0' },
    { cor: 'Amarelo', inicio: '', fim: '0' },
  ]);

  const [grafoData, setGrafoData] = useState(null);

  useEffect(() => {
    async function fetchProducoes() {
      try {
        const response = await axios.get(apiUrlProducao);
        setProducoes(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar produções:', error);
      }
    }

    fetchProducoes();
  }, [apiUrlProducao]);

  const handleRegraChange = (index, field, value) => {
    const updatedRegras = [...regrasNP];
    updatedRegras[index][field] = value;

    if (field === 'inicio') {
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

      for (let i = index + 1; i < updatedRegras.length; i++) {
        const currentInicio = parseInt(updatedRegras[i]['inicio']);
        const previousFim = parseInt(updatedRegras[i - 1]['fim']);
        updatedRegras[i]['inicio'] = (previousFim + 1).toString();
        updatedRegras[i]['fim'] = (previousFim + 1).toString();
      }
    }

    setRegrasNP(updatedRegras);
  };

  const handleGerarGrafo = () => {
    const nodes = [];
    const edges = [];

    producoes.forEach((producao) => {
      nodes.push({ id: producao.id, label: producao.titulo, group: 'Producao' });

      const pesquisadores = producao.pesquisador || [];
      for (let i = 0; i < pesquisadores.length - 1; i++) {
        for (let j = i + 1; j < pesquisadores.length; j++) {
          edges.push({ from: pesquisadores[i].id, to: pesquisadores[j].id, color: { color: 'Producao' } });
        }
      }
    });

    setGrafoData({
      colorRanges: regrasNP,
      edgeType: 'Producao',
      vertexType: selectedTipoVertice,
      jsonData: producoes, // Adicionando o JSON completo como propriedade
    });
  };

  return (
    <div className="grafo-generator">
      <h2 className="titulo">Gerador de Grafos</h2>
      <div className="configuracoes">
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

      {grafoData && <GraphComponent {...grafoData} />}
      {!grafoData && <p>Gerar o gráfico para exibi-lo aqui.</p>}
    </div>
  );
}

export default TelaGrafo;
