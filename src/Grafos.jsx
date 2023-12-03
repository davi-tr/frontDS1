import React, { useState, useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/dist/vis-network.esm.min.js';
import 'vis-network/styles/vis-network.css';

const GraphComponent = ({ colorRanges, edgeType, vertexType }) => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const graphContainerRef = useRef(null);
  const networkRef = useRef(null);

  // Função para obter a contagem de produções associadas a um pesquisador
  const researcherProductionsCount = researcherId => {
    // Lógica para contar as produções com base no tipo de vértice (vertexType)
    // ...
  };

  useEffect(() => {
    // Lógica para buscar dados JSON
    // ...
  }, []);

  useEffect(() => {
    if (!jsonData) {
      return;
    }

    // Verifique se o elemento do contêiner está disponível
    const container = graphContainerRef.current;
    if (!container) {
      return;
    }

    // Limpe a instância da rede existente, se houver
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    // Crie um conjunto para armazenar nós de pesquisadores exclusivos
    const researcherNodes = new DataSet();

    // Crie arestas com base no relacionamento entre pesquisadores e suas produções
    const edges = new DataSet();

    jsonData.forEach(item => {
      const researchers = item[vertexType] || [];

      // Adicione pesquisadores ao conjunto
      researchers.forEach(researcher => {
        if (!researcherNodes.get(researcher.id)) {
          // Altere a cor do nó com base no número de produções
          let nodeColor = 'white'; // Cor padrão
          const productionsCount = researcherProductionsCount(researcher.id);

          // Determine a cor do nó com base nos intervalos de cor fornecidos (colorRanges)
          for (const range of colorRanges) {
            if (productionsCount >= range.start && productionsCount <= range.end) {
              nodeColor = range.color;
              break;
            }
          }

          researcherNodes.add({
            id: researcher.id,
            label: researcher.nome,
            color: { background: nodeColor },
          });
        }
      });

      // Crie arestas entre pesquisadores se houver vários pesquisadores
      for (let i = 0; i < researchers.length - 1; i++) {
        for (let j = i + 1; j < researchers.length; j++) {
          // Adicione a aresta com base no tipo de dado que será representado na aresta (edgeType)
          edges.add({
            from: researchers[i].id,
            to: researchers[j].id,
            // Você pode adicionar lógica adicional aqui para definir propriedades da aresta com base em edgeType
          });
        }
      }
    });

    const data = {
      nodes: researcherNodes,
      edges: edges,
    };

    const options = {};

    // Crie uma nova instância da rede
    const network = new Network(container, data, options);

    // Salve a instância da rede na ref para limpeza posterior
    networkRef.current = network;

    // Limpe a rede quando o componente for desmontado
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [jsonData, colorRanges, edgeType, vertexType]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={graphContainerRef} style={{ height: '900px' }}></div>
      )}
    </div>
  );
};

export default GraphComponent;
