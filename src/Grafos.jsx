import React, { useState, useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/dist/vis-network.esm.min.js';
import 'vis-network/styles/vis-network.css';

const GraphComponent = () => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const graphContainerRef = useRef(null);
  const networkRef = useRef(null);

  // Function to get the number of productions associated with a researcher
  const researcherProductionsCount = researcherId => {
    return jsonData.filter(item => (item.pesquisador || []).some(researcher => researcher.id === researcherId)).length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8083/producao');
        const data = await response.json();
        setJsonData(data.content);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Erro ao obter JSON:', error);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!jsonData) {
      return;
    }

    // Check if the container element is available
    const container = graphContainerRef.current;
    if (!container) {
      return;
    }

    // Clean up existing network instance, if any
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    // Create a set to store unique researcher nodes
    const researcherNodes = new DataSet();

    // Create edges based on the relationship between researchers and their productions
    const edges = new DataSet();

    jsonData.forEach(item => {
      const researchers = item.pesquisador || [];

      // Add researchers to the set
      researchers.forEach(researcher => {
        if (!researcherNodes.get(researcher.id)) {
          // Change node color based on the number of productions
          let nodeColor = 'white'; // Default color
          const productionsCount = researcherProductionsCount(researcher.id);

          if (productionsCount > 1 && productionsCount <= 5) {
            nodeColor = 'yellow';
          } else if (productionsCount >= 6 && productionsCount < 8) {
            nodeColor = 'red';
          } else if (productionsCount >= 8 && productionsCount < 10) {
            nodeColor = 'purple';
          } else if (productionsCount >= 10 && productionsCount <= 15) {
            nodeColor = 'blue';
          } else if (productionsCount >= 16 && productionsCount <= 20) {
            nodeColor = 'green';
          } else if (productionsCount > 20) {
            nodeColor = 'orange';
          }

          researcherNodes.add({
            id: researcher.id,
            label: researcher.nome,
            color: { background: nodeColor },
          });
        }
      });

      // Create edges between researchers if there are multiple researchers
      for (let i = 0; i < researchers.length - 1; i++) {
        for (let j = i + 1; j < researchers.length; j++) {
          edges.add({
            from: researchers[i].id,
            to: researchers[j].id,
          });
        }
      }
    });

    console.log('researcherNodes:', researcherNodes);
    console.log('edges:', edges);

    const data = {
      nodes: researcherNodes,
      edges: edges,
    };

    const options = {};

    // Create a new network instance
    const network = new Network(container, data, options);

    // Save the network instance to the ref for later cleanup
    networkRef.current = network;

    // Clean up the network when the component is unmounted
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [jsonData]);

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
