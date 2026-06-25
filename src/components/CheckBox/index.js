import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONT_SIZE } from '../../theme/typography';

export default function CheckBox({ label, isSelected, onPress, disabled = false }) {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.disabledContainer]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={[styles.caixa, isSelected && styles.caixaSelecionada, disabled && styles.caixaDisabled]}>
        {isSelected && <View style={[styles.preenchido, disabled && styles.preenchidoDisable]} />}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 30 
  },
  disabledContainer: {
    opacity: 0.5, 
  },
  caixa: { width: 22, 
    height: 22, 
    borderWidth: 1.5, 
    borderColor: COLORS.lightGrey, 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  caixaDisabled: {
    borderColor: COLORS.grey,
  },
  caixaSelecionada: { 
    borderColor: COLORS.lightBlue 
  },
  preenchido: { 
    width: 12, 
    height: 12, 
    backgroundColor: COLORS.lightBlue, 
    borderRadius: 3 
  },
  preenchidoDisable: {
    backgroundColor: COLORS.grey, 
  },
  label: { 
    fontSize: FONT_SIZE.small, 
    marginLeft: 10, 
    color: COLORS.black 
  },
  labelDisabled: {
    color: COLORS.grey, 
  },
});