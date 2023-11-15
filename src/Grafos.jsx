import React, { useState ,useEffect } from 'react';
import { DataSet, Network } from 'vis-network/dist/vis-network.esm.min.js';
import 'vis-network/styles/vis-network.css';

const GraphComponent = () => {
    const [jsonData, setJsonData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:8083/producao');
          const data = await response.json();
          setJsonData(data.content);
        } catch (error) {
          console.error('Erro ao obter JSON:', error);
        }
      };
  
      fetchData();
    }, []); 
  
    useEffect(() => {
      if (!jsonData) {
        return;
      }
  
      // Criar um conjunto para armazenar nós únicos de pesquisadores com base em seu ID
      const researcherNodes = new Set();
  
      // Criar um conjunto para armazenar arestas entre pesquisadores e institutos
      const edges = new DataSet();
  
      jsonData.forEach(item => {
        const researchers = item.pesquisador || [];
  
        researchers.forEach(researcher => {
          // Adicionar nó de pesquisador se ainda não existir
          if (!researcherNodes.has(researcher.id)) {
            researcherNodes.add(researcher.id);
          }
  
          // Criar aresta entre pesquisador e instituto, se a afiliação existir
          const institute = researcher.instituto;
          if (institute && institute.id) {
            edges.add({ from: researcher.id, to: institute.id });
          }
        });
      });
  
      // Criação dos nós de pesquisadores com os nomes
      const nodes = new DataSet(Array.from(researcherNodes).map(researcherId => {
        const researcher = jsonData
          .flatMap(item => item.pesquisador || [])
          .find(researcher => researcher.id === researcherId);
  
        return {
          id: researcher.id,
          label: researcher.nome,
        };
      }));
  
      // Configuração do grafo
      const container = document.getElementById('graph');
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {};
  
      // Criação do grafo
      const network = new Network(container, data, options);
    }, [jsonData]);
  
    return <div id="graph" style={{ height: '400px' }}></div>;
  };
  
  export default GraphComponent;