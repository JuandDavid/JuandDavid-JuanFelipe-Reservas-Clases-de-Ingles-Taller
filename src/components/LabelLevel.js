import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, coloresPorNivel } from '../theme';

export default function LabelLevel({ level }) {
  const colorNivel = coloresPorNivel[level] || colors.primario;

  return (
    <View style={[styles.container, { borderColor: colorNivel, backgroundColor: colorNivel + '18' }]}>
      <Text style={[styles.text, { color: colorNivel }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});