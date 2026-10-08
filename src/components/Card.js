import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LabelLevel from "./LabelLevel";
import { colors, spacing, radius, sombra } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress }) {
    return (
        <Pressable
            style={({ pressed }) => [
                estilos.tarjeta,
                sombra,
                pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }
            ]}
            onPress={onPress}
        >
            <Image source={clase.imagen} />
            <View style={estilos.cuerpo}>
                <View style={{ alignSelf: 'flex-start' }}>
                    <LabelLevel level={clase.nivel} />
                </View>
                <Text style={estilos.titulo} numberOfLines={2}>
                    {clase.titulo}
                </Text>
                <View style={estilos.filaProfesor}>
                    <Image
                        source={{ uri: clase.profesor.foto }}
                        style={estilos.avatar}
                    />
                    <Text style={estilos.profesor} numberOfLines={1}>
                        {clase.profesor.nombre}
                    </Text>
                </View>
                <View style={estilos.pie}>
                    <View style={estilos.filaCentro}>
                        <Ionicons name="time-outline" size={14} color={colors.textoSuave} />
                        <Text style={estilos.horario}>
                            {clase.horarios[0]}
                        </Text>
                    </View>
                    <Text style={estilos.precio}>
                        {formatearPrecio(clase.precio)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imagen: {
    width: '100%',
    height: 130,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
  filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borde },
  profesor: { fontSize: 13, color: colors.textoSuave, flexShrink: 1 },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  filaCentro: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  horario: { fontSize: 12, color: colors.textoSuave },
  precio: { fontSize: 14, fontWeight: '800', color: colors.primario },
});