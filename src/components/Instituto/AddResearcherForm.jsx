import React, { useState, useEffect } from 'react';
//import axios from 'axios';

const AddResearcherForm = ({ onClose }) => {
  const [researcherId, setResearcherId] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [institutes, setInstitutes] = useState([]);

  useEffect(() => {
    fetchInstitutes(); // Busca a lista de institutos ao carregar o componente
  }, []);

  const fetchInstitutes = async () => {
    try {
      // fetch('http://localhost:8081/instituto/')
      const response = await axios.get('http://localhost:8081/instituto');
      setInstitutes(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de institutos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o ID do instituto é válido
    const selectedInstitute = institutes.find(institute => institute.id === parseInt(instituteId));
    if (!selectedInstitute) {
      console.error('ID do instituto inválido.');
      return;
    }

    // Usando a API para cadastrar o pesquisador usando o ID digitado e o ID do instituto
    try {
      await axios.post('http://localhost:8081/pesquisador', { idPesquisador: researcherId, idinstituto: parseInt(instituteId) });
      onClose(); // Feche a janela pop-up após o cadastro bem-sucedido
    } catch (error) {
      console.error('Erro ao cadastrar pesquisador:', error);
    }
  };

  return (
    <div>
      <h2>Cadastrar Pesquisador</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID do Pesquisador:
          <input
            type="text"
            value={researcherId}
            onChange={(e) => setResearcherId(e.target.value)}
          />
        </label>
        <label>
          ID do Instituto:
          <select value={instituteId} onChange={(e) => setInstituteId(e.target.value)}>
            <option value="">Selecione um instituto</option>
            {institutes.map(institute => (
              <option key={institute.id} value={institute.id}>{institute.nome}</option>
            ))}
          </select>
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AddResearcherForm;
