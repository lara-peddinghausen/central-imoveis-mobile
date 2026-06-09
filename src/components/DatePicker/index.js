import React, { useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    // Agora o event está sendo lido aqui
    if (event.type === 'set' || event.type === 'dismissed') {
      if (Platform.OS === 'android') {
        setShow(false);
      }
    }
    
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Data selecionada: {date.toLocaleDateString('pt-BR')}</Text>
      
      <Button title="Selecionar Data" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}