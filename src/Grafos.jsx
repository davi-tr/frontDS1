import React, { useEffect, useRef } from 'react';
import { Network } from 'react-vis-network';
import 'vis-network/styles/vis-network.css';

const GraphComponent = ({ colorRanges, edgeType, vertexType, jsonData }) => {
  const graphContainerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!jsonData) {
      return;
    }

    const container = graphContainerRef.current;

    if (!container) {
      return;
    }

    const nodes = [];
    const edges = [];

    jsonData.forEach(item => {
      const researchers = item[vertexType] || [];

      researchers.forEach(researcher => {
        let nodeColor = 'white';
        // Adicione lógica para determinar a cor do nó com base nos intervalos de cor
        for (const range of colorRanges) {
          // Adicione a lógica específica para determinar a cor do nó
          // com base no intervalo de cor fornecido (range)
          // Exemplo: if (productionsCount >= range.start && productionsCount <= range.end) {
          //           nodeColor = range.color;
          //         }

          // Substitua a lógica acima com a lógica específica para o seu caso
        }

        nodes.push({
          id: researcher.id,
          label: researcher.nome,
          color: { background: nodeColor },
        });
      });

      for (let i = 0; i < researchers.length - 1; i++) {
        for (let j = i + 1; j < researchers.length; j++) {
          edges.push({
            from: researchers[i].id,
            to: researchers[j].id,
            // Adicione propriedades da aresta com base no tipo de dado que será representado (edgeType)
            // Exemplo: title: 'Aresta de Produção'
          });
        }
      }
    });

    const data = { nodes, edges };
    const options = {}; // Adicione opções personalizadas se necessário

    if (networkRef.current) {
      // Se uma instância anterior existir, destrua-a
      networkRef.current.setOptions(options);
      networkRef.current.setData(data);
    } else {
      // Crie uma nova instância da rede
      networkRef.current = new Network(container, data, options);
    }

    return () => {
      if (networkRef.current) {
        // Defina a ref como nula para indicar que a instância foi destruída
        networkRef.current = null;
      }
    };
  }, [jsonData, colorRanges, edgeType, vertexType]);

  return <div ref={graphContainerRef} style={{ height: '500px' }} />;
};

export default GraphComponent;
