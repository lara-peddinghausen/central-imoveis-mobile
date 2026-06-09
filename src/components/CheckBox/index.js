import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONT_SIZE } from '../../theme/typography';

export default function CheckBox({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.box, isSelected && styles.selectedBox]}>
        {isSelected && <View style={styles.filled} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 30 
  },
  box: { width: 22, 
    height: 22, 
    borderWidth: 1.5, 
    borderColor: COLORS.lightGrey, 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  selectedBox: { 
    borderColor: COLORS.lightBlue 
  },
  filled: { 
    width: 12, 
    height: 12, 
    backgroundColor: COLORS.lightBlue, 
    borderRadius: 3 
  },
  label: { 
    fontSize: FONT_SIZE.small, 
    marginLeft: 10, 
    color: COLORS.black 
  },
});