import React, { useState, useEffect } from 'react';
import './TelaProducao.css';

function TelaProducoes() {
  const [producoes, setProducoes] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [instituto, setInstituto] = useState('');
  const [pesquisador, setPesquisador] = useState('');
  const [tipoProducao, setTipoProducao] = useState('');




  const handleBusca = () => {
    // Verifica se todos os campos estão preenchidos
    if (dataInicio && dataFim && instituto && pesquisador && tipoProducao) {
      const resultadosFiltrados = producoes.filter((producao) => {
        // Lógica de filtragem
        return (
          producao.data >= dataInicio &&
          producao.data <= dataFim &&
          producao.instituto === instituto &&
          producao.pesquisador === pesquisador &&
          producao.tipoProducao === tipoProducao
        );
      });

      // Atualiza o estado
      setProducoes(resultadosFiltrados);
    } else {
      // Mensagem de erro se algum campo estiver vazio
      alert('Preencha todos os campos de filtro.');
    }
  };

 // ...

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
        {/* Institutos */}
    </select>
    </div>

    <div className="column">
    <select
        value={pesquisador}
        onChange={(e) => setPesquisador(e.target.value)}
        className="custom-input"
    >
        <option value="">Selecione o Pesquisador</option>
        {/* Pesquisadores*/}
    </select>
    </div>

    <div className="column">
    </div>
  
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
  
      <ul>
        {producoes.map((producao, index) => (
          <li key={index}>
            <strong>Título:</strong> {producao.titulo}, <strong>Autor:</strong> {producao.autor}
          </li>
        ))}
      </ul>

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
            <td>{producao.tipoProducao}</td>
            <td>{producao.detalhamento}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
  
  );
  
}

export default TelaProducoes;
