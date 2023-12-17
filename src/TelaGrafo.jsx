import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TelaPrincipal.css';
import './Telagrafo.css';
import GraphComponent from './Grafos'; // Ajuste o caminho de importação conforme necessário

function TelaGrafo() {
  const [selectedProducao, setSelectedProducao] = useState('');
  const [selectedTipoVertice, setSelectedTipoVertice] = useState('Pesquisador');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [producoes, setProducoes] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [regrasNP, setRegrasNP] = useState([


    { color: 'green', start: '1', end: '0' },
    { color: 'red', start: '', end: '0' },
    { color: 'yellow', start: '', end: '0' },
  ]);

 

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

    fetchInstitutos();
  }, [apiUrl]);




  // lidar com a alteração das regras
  const handleRegraChange = (index, field, value) => {
    const updatedRegras = [...regrasNP];
    updatedRegras[index][field] = value;

    if (field === 'start') {
      // Aplique o mesmo ajuste para todas as linhas seguintes
      for (let i = index; i <= updatedRegras.length; i++) {
        if (i === 0) {
          updatedRegras[i]['end'] = (parseInt(updatedRegras[i]['start']) + 1).toString();
        } else {
          const currentstart = parseInt(updatedRegras[i]['start']);
          const previousend = parseInt(updatedRegras[i - 1]['end']);
          if (currentstart <= previousend) {
            updatedRegras[i]['start'] = (previousend + 1).toString();
            updatedRegras[i]['end'] = (previousend + 1).toString();
          }
        }
      }
    }

    if (field === 'end') {
      const startValue = parseInt(updatedRegras[index]['start']);
      const endValue = parseInt(value);

      if (endValue < startValue) {
        updatedRegras[index]['end'] = (startValue + 1).toString();
      }

      // Aplique o mesmo ajuste para todas as linhas seguintes
      for (let i = index + 1; i < updatedRegras.length; i++) {
        const currentstart = parseInt(updatedRegras[i]['start']);
        const previousend = parseInt(updatedRegras[i - 1]['end']);
        updatedRegras[i]['start'] = (previousend + 1).toString();
        updatedRegras[i]['end'] = (previousend + 1).toString();
      }
    }

    setRegrasNP(updatedRegras);
  };

  ///////////////////lógica inicial para gerar grafo
  const handleGerarGrafo = () => {
    setShowGraph(true);
    const translatedRegras = translateColors(regrasNP);
    console.log(translatedRegras)
  };

  function translateColors(regras) {
    const colorMap = {
      'vermelho': 'red',
      'verde': 'green',
      'azul': 'blue',
        };
  
    return regras.map(regra => ({
      ...regra,
      color: colorMap[regra.color] || regra.color, // use a cor mapeada, ou a cor original se não houver mapeamento
    }));
  }


  return (
    <div className="grafo-generator">
      <h2 className="titulo">Gerador de Grafos</h2>
      <div className="configuracoes">
        <div className="combo-box">
          <select
            value={instituto}
            onChange={(e) => {
              setInstituto(e.target.value);
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

        <div className="combo-box">
          <select
            value={selectedTipoVertice}
            onChange={(e) => setSelectedTipoVertice(e.target.value)}
          >
            <option value="Pesquisador">Pesquisador</option>
            <option value="Instituto">Instituto</option>
          </select>
        </div>
        <div className="combo-box">
          <select
            value={selectedProducao}
            onChange={(e) => setSelectedProducao(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Artigo">Artigo</option>
            <option value="Livro">Livro</option>

          </select>
        </div>

        <button onClick={handleGerarGrafo} className="gerar-button">Gerar Grafo</button>

      </div>

      <div className="regras-plotagem">
        <h2 className="titulo">Regras de Plotagem (Número de Produção - NP)</h2>
        <table className="config-table">
          <thead>
            <tr>
              <th>Vértice (color)</th>
              <th>Valor NP (Início)</th>
              <th>Valor NP (end)</th>
            </tr>
          </thead>
          <tbody>
            {regrasNP.map((regra, index) => (
              <tr key={index}>
                <td>
                  <div className={`color-box ${regra.color.toLowerCase()}`}></div>
                  <span className="color-label">{regra.color}</span>
                </td>
                <td>
                  <input
                    type="number"
                    value={index === 0 ? '1' : regrasNP[index - 1].end}
                    onChange={(e) => handleRegraChange(index, 'start', e.target.value)}
                    disabled={index !== 0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={regra.end}
                    onChange={(e) => handleRegraChange(index, 'end', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        <button onClick={handleGerarGrafo} className="gerar-button">Gerar Grafo</button>
        {showGraph && <GraphComponent colorRanges={regrasNP} edgeType={selectedProducao} vertexType={selectedTipoVertice} />}
        
      </div>
    </div>
  );
}
export default TelaGrafo;
