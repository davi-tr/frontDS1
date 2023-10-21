/*import React, { useState } from 'react';
import { View, Text, Button, Picker, TextInput, FlatList } from 'react-native';
//instalar
import { BarChart, Grid } from 'react-native-svg-charts';

const TelaGRafo = () => {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [colorRanges, setColorRanges] = useState([
    { color: 'red', min: 0, max: 10 },
    { color: 'yellow', min: 11, max: 20 },
    { color: 'green', min: 21, max: 30 },
  ]);
  const [graphData, setGraphData] = useState([]);

  const generateGraph = () => {

    const instituteData = selectedInstitute;
    const researcherData = selectedResearcher;
    const productionData = selectedProduction;

    const filteredData = combineAndFilterData(instituteData, researcherData, productionData, colorRanges);

    setGraphData(filteredData);
  };

  return (
    <View>
      <Text>Selecione o instituto:</Text>
      <Picker
        selectedValue={selectedInstitute}
        onValueChange={(itemValue) => setSelectedInstitute(itemValue)}
      >
        {institutes.map((institute, index) => (
          <Picker.Item key={index} label={institute} value={institute} />
        ))}
      </Picker>

      <Text>Selecione o pesquisador:</Text>
      <Picker
        selectedValue={selectedResearcher}
        onValueChange={(itemValue) => setSelectedResearcher(itemValue)}
      >
        {researchers.map((researcher, index) => (
          <Picker.Item key={index} label={researcher} value={researcher} />
        ))}
      </Picker>

      <Text>Selecione a produção:</Text>
      <Picker
        selectedValue={selectedProduction}
        onValueChange={(itemValue) => setSelectedProduction(itemValue)}
      >
        {productions.map((production, index) => (
          <Picker.Item key={index} label={production} value={production} />
        ))}
      </Picker>

      <Text>Configurar cores do gráfico:</Text>
      <FlatList
        data={colorRanges}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TextInput
              placeholder="Cor"
              value={item.color}
              onChangeText={(text) => {
                const updatedColorRanges = [...colorRanges];
                updatedColorRanges[index].color = text;
                setColorRanges(updatedColorRanges);
              }}
            />
            <TextInput
              placeholder="Mínimo"
              value={item.min.toString()}
              onChangeText={(text) => {
                const updatedColorRanges = [...colorRanges];
                updatedColorRanges[index].min = parseInt(text, 10);
                setColorRanges(updatedColorRanges);
              }}
            />
            <TextInput
              placeholder="Máximo"
              value={item.max.toString()}
              onChangeText={(text) => {
                const updatedColorRanges = [...colorRanges];
                updatedColorRanges[index].max = parseInt(text, 10);
                setColorRanges(updatedColorRanges);
              }}
            />
          </View>
        )}
      />

      <Button title="Gerar Gráfico" onPress={generateGraph} />

      <Text>Dados do gráfico:</Text>
      <BarChart
        style={{ height: 200 }}
        data={graphData}
        svg={{ fill: 'green' }} // Cor das barras (pode ser personalizada)
        contentInset={{ top: 30, bottom: 30 }}
      >
        <Grid />
      </BarChart>
    </View>
  );
};

export default TelaGrafo;
*/