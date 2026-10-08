import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useReserva from '../hooks/useReserva';
import LabelLevel from '../components/LabelLevel';
import EstadoVacio from '../components/EstadoVacio';
import useResponsive from '../hooks/useResponsive';
import { colors, spacing, radius, typography, sombra } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function ReservasScreen() {
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = useResponsive();
  const { reservas, eliminarReserva } = useReserva();

  const confirmarEliminar = (id, titulo) => {
    Alert.alert(
      'Cancelar reserva',
      `¿Estás seguro de que deseas cancelar la reserva de "${titulo}"?`,
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => eliminarReserva(id),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[estilos.tarjeta, sombra]}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        <LabelLevel level={item.nivel} />
      </View>

      <View style={estilos.filaInfo}>
        <Ionicons name="person-outline" size={16} color={colors.textoSuave} />
        <Text style={estilos.textoInfo}>{item.profesor}</Text>
      </View>

      <View style={estilos.filaInfo}>
        <Ionicons name="calendar-outline" size={16} color={colors.primario} />
        <Text style={[estilos.textoInfo, estilos.textoDestacado]}>{item.horario}</Text>
      </View>

      <View style={estilos.pie}>
        <Text style={estilos.precio}>{formatearPrecio(item.precio)}</Text>
        <TouchableOpacity
          style={estilos.botonEliminar}
          onPress={() => confirmarEliminar(item.id, item.titulo)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.peligro} />
          <Text style={estilos.textoEliminar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[estilos.pantalla, { paddingTop: insets.top + spacing.md }]}>
      <View style={[estilos.cabecera, { paddingHorizontal }]}>
        <Text style={typography.titulo}>Mis Reservas</Text>
        <Text style={typography.secundario}>
          {reservas.length === 1 ? '1 clase reservada' : `${reservas.length} clases reservadas`}
        </Text>
      </View>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          estilos.lista,
          { paddingHorizontal },
          reservas.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EstadoVacio
            icono="calendar-outline"
            titulo="No tienes reservas aún"
            mensaje="Explora el catálogo de clases de inglés y reserva tu primer horario."
          />
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  cabecera: {
    marginBottom: spacing.md,
  },
  lista: {
    paddingBottom: spacing.xxl,
  },
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.texto,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textoInfo: {
    fontSize: 14,
    color: colors.textoSuave,
  },
  textoDestacado: {
    color: colors.primario,
    fontWeight: '600',
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  precio: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.texto,
  },
  botonEliminar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoEliminar: {
    color: colors.peligro,
    fontSize: 13,
    fontWeight: '600',
  },
});

