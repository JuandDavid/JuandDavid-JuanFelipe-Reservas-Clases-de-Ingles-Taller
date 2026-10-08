import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function LevelChip({label, active, onPress}) {
    return (
        <Pressable onPress={onPress}
            style={( {pressed} ) => [
                style.chip,
                active && style.chipActivo,
                pressed && { opacity: 0.7 },
            ]}
        >
            <Text style={[style.texto, active && style.textoActivo]}>
                {label}
            </Text>
        </Pressable>
    )
}

const style = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    marginRight: spacing.sm,
  },
  chipActivo: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  texto: { fontSize: 13, fontWeight: '600', color: colors.textoSuave },
  textoActivo: { color: '#FFFFFF' },
});