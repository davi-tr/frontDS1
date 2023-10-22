import React, { useState } from 'react';
import './TelaPrincipal.css'; 
import './Telagrafo.css';

function TelaGrafo() {
  const [selectedInstituto, setSelectedInstituto] = useState('');
  const [selectedProducao, setSelectedProducao] = useState('');
  const [selectedPesquisador, setSelectedPesquisador] = useState('');
  const [selectedTipoVertice, setSelectedTipoVertice] = useState('Pesquisador');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [tipoProducao, setTipoProducao] = useState('');
  const [listaDeInstitutos, setListaDeInstitutos] = useState([]);
  const apiUrl = "http://localhost:8083/instituto";
  const [listaDePesquisadores, setListaDePesquisadores] = useState([]);
  const apiUrlP = "http://localhost:8083/pesquisador";
  const [regrasNP, setRegrasNP] = useState([
  
    { cor: 'Azul', inicio: '', fim: '0' },
    { cor: 'Vermelho', inicio: '', fim: '0' },
    { cor: 'Amarelo', inicio: '', fim: '0' },
  ]);

  const handleRegraChange = (index, field, value) => {
    const updatedRegras = [...regrasNP];
    updatedRegras[index][field] = value;
    setRegrasNP(updatedRegras);
  };

  

  const handleGerarGrafo = () => {
    // Coloque aqui a lógica para gerar o grafo com base nas configurações selecionadas
    // Isso pode envolver a chamada de funções ou componentes específicos para a geração de gráficos.
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
            <option value="">Selecione a Produção</option>
            {/* Opções de produções aqui */}
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
                  <select
                    value={regra.cor}
                    onChange={(e) => handleRegraChange(index, 'cor', e.target.value)}
                  >
                    <option value="Azul">Azul</option>
                    <option value="Vermelho">Vermelho</option>
                    <option value="Amarelo">Amarelo</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={regra.inicio}
                    onChange={(e) => handleRegraChange(index, 'inicio', e.target.value)}
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