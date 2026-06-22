import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../theme/colors';
import { FONT_SIZE } from '../../theme/typography';

export default function ImageSelector({ onImageSelected, textoBtn }) {
  const [previewUri, setPreviewUri] = useState(null);

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setPreviewUri(uri); // Atualiza a miniatura local no componente
      onImageSelected(uri); // Envia a URI para a tela de cadastro
    }
  };

  const removerImagem = () => {
    setPreviewUri(null);
    onImageSelected(null); // Avisa a tela de cadastro que a imagem foi removida
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selecionarImagem} activeOpacity={0.7}>
        <Text style={styles.linkText}>{textoBtn}</Text>
      </TouchableOpacity>

      {previewUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
          <TouchableOpacity onPress={removerImagem}>
            <Text style={styles.removeText}>Remover imagem</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 10,

},
  linkText: { 
    fontSize: FONT_SIZE.medium, 
    color: COLORS.darkBlue, 
    textDecorationLine: 'underline',

},
  previewContainer: { 
    marginTop: 15, 
    alignItems: 'flex-start' 
},
  previewImage: { 
    width: 120, 
    height: 90, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: COLORS.lightGrey 
},
  removeText: { 
    color: COLORS.red, 
    marginTop: 5, 
    fontSize: 14 
}
});