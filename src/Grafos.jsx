import React, { useState, useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/dist/vis-network.esm.min.js';
import 'vis-network/styles/vis-network.css';

const GraphComponent = () => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const graphContainerRef = useRef(null);
  const networkRef = useRef(null);

  

  useEffect(() => {
    setLoading(true);

    fetch('http://localhost:8083/producao')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJsonData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  useEffect(() => {
    if (!jsonData) {
      console.log('No data');
      return;
    }
  
    const container = graphContainerRef.current;
    if (!container) {
      console.log('No container');
      return;
    }
  
    if (networkRef.current) {
      networkRef.current.destroy();
    }
  
    const researcherNodes = new DataSet();
    const edges = new DataSet();
  
    jsonData.content.forEach(item => {
      const researchers = item.pesquisador || [];
  
      // Adiciona um nó para cada pesquisador
      researchers.forEach(researcher => {
        if (!researcherNodes.get(researcher.id)) {
          researcherNodes.add({ id: researcher.id, label: researcher.nome });
        }
      });
  
      // Adiciona uma aresta para cada par de pesquisadores que trabalharam juntos
      for (let i = 0; i < researchers.length; i++) {
        for (let j = i + 1; j < researchers.length; j++) {
          edges.add({ from: researchers[i].id, to: researchers[j].id });
        }
      }
    });
  
    const data = {
      nodes: researcherNodes,
      edges: edges,
    };
  
    const options = {};
  
    const network = new Network(container, data, options);
    networkRef.current = network;
  }, [jsonData]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={graphContainerRef} style={{ height: '900px'}}></div>
      )}
    </div>
  );
};

export default GraphComponent;