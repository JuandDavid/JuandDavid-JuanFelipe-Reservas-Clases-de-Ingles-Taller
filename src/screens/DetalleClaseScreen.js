import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useResponsive from "../hooks/useResponsive";
import useReserva from "../hooks/useReserva";
import { colors, spacing, radius, typography } from '../theme/index.js';
import { formatearPrecio } from '../data/clases';
import LabelLevel from "../components/LabelLevel";

export default function DetalleClase({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { clase } = route.params;
    const { paddingHorizontal, isTablet } = useResponsive();
    const { reservas, agregarReserva } = useReserva();

    const [horarioSeleccionado, setHorarioSeleccionado] = useState(
        clase.horarios && clase.horarios.length > 0 ? clase.horarios[0] : ''
    );
    const [cuposDisponibles, setCuposDisponibles] = useState(clase.cupos);

    const yaReservada = reservas.some(
        (r) => r.id === `${clase.id}-${horarioSeleccionado}`
    );

    function manejarReserva() {
        if (!horarioSeleccionado) {
            Alert.alert('Horario requerido', 'Por favor selecciona un horario para tu clase.');
            return;
        }

        if (yaReservada) {
            Alert.alert(
                'Clase ya reservada',
                `Ya tienes una reserva para "${clase.titulo}" en el horario ${horarioSeleccionado}. Puedes consultarla en la sección de Reservas.`
            );
            return;
        }

        Alert.alert(
            'Confirmar reserva',
            `¿Deseas apartar "${clase.titulo}" para ${horarioSeleccionado}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        const resultado = agregarReserva(clase, horarioSeleccionado);
                        if (resultado && resultado.ok) {
                            setCuposDisponibles((actuales) => Math.max(0, actuales - 1));
                            Alert.alert(
                                '¡Reserva exitosa!',
                                `Tu clase ha sido reservada para ${horarioSeleccionado}.`,
                                [
                                    {
                                        text: 'Ver mis reservas',
                                        onPress: () => navigation.navigate('ReservasTab'),
                                    },
                                    { text: 'Aceptar', style: 'default' },
                                ]
                            );
                        } else {
                            Alert.alert('Aviso', 'Esta clase ya se encuentra reservada en ese horario.');
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={estilos.pantalla}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 130 }}
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={{ uri: clase.imagen }}
                    resizeMode="cover"
                    style={[estilos.portada, { height: isTablet ? 380 : 210 }]}
                />
                <View style={{ paddingHorizontal, gap: spacing.lg, paddingTop: spacing.md }}>
                    <View style={estilos.filaEncabezado}>
                        <LabelLevel level={clase.nivel} />
                        <View style={estilos.filaRating}>
                            <Ionicons name="star" size={16} color={colors.acento} />
                            <Text style={estilos.ratingTexto}>{clase.rating}</Text>
                        </View>
                    </View>

                    <Text style={typography.titulo}>{clase.titulo}</Text>
                    <Text style={estilos.descripcion}>{clase.descripcion}</Text>

                    <View style={estilos.profesor}>
                        <Image
                            source={{ uri: clase.profesor.foto }}
                            style={estilos.avatar}
                        />
                        <View>
                            <Text style={estilos.profesorNombre}>{clase.profesor.nombre}</Text>
                            <Text style={estilos.profesorPais}>{clase.profesor.pais}</Text>
                        </View>
                    </View>

                    <View style={estilos.datos}>
                        <View style={estilos.dato}>
                            <Ionicons name="videocam-outline" size={18} color={colors.primario} />
                            <Text style={estilos.datoValor}>{clase.modalidad}</Text>
                            <Text style={estilos.datoEtiqueta}>Modalidad</Text>
                        </View>
                        <View style={estilos.dato}>
                            <Ionicons name="time-outline" size={18} color={colors.primario} />
                            <Text style={estilos.datoValor}>{`${clase.duracion} min`}</Text>
                            <Text style={estilos.datoEtiqueta}>Duración</Text>
                        </View>
                        <View style={estilos.dato}>
                            <Ionicons name="people-outline" size={18} color={colors.primario} />
                            <Text style={estilos.datoValor}>{`${cuposDisponibles}`}</Text>
                            <Text style={estilos.datoEtiqueta}>Cupos</Text>
                        </View>
                    </View>

                    <View style={estilos.seccionHorarios}>
                        <Text style={typography.subtitulo}>Selecciona tu horario</Text>
                        <View style={estilos.listaHorarios}>
                            {clase.horarios.map((horario) => {
                                const seleccionado = horarioSeleccionado === horario;
                                const estaReservado = reservas.some(
                                    (r) => r.id === `${clase.id}-${horario}`
                                );

                                return (
                                    <Pressable
                                        key={horario}
                                        onPress={() => setHorarioSeleccionado(horario)}
                                        style={[
                                            estilos.chipHorario,
                                            seleccionado && estilos.chipHorarioSeleccionado,
                                        ]}
                                    >
                                        <Ionicons
                                            name={seleccionado ? "time" : "time-outline"}
                                            size={18}
                                            color={seleccionado ? colors.primario : colors.textoSuave}
                                        />
                                        <Text
                                            style={[
                                                estilos.textoHorario,
                                                seleccionado && estilos.textoHorarioSeleccionado,
                                            ]}
                                        >
                                            {horario}
                                        </Text>
                                        {estaReservado && (
                                            <View style={estilos.badgeReservado}>
                                                <Text style={estilos.textoBadgeReservado}>Apartado</Text>
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View
                style={[
                    estilos.barra,
                    {
                        paddingHorizontal,
                        paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : spacing.md,
                    },
                ]}
            >
                <View>
                    <Text style={estilos.precioEtiqueta}>Precio por sesión</Text>
                    <Text style={estilos.precio}>{formatearPrecio(clase.precio)}</Text>
                </View>

                <Pressable
                    disabled={cuposDisponibles <= 0 || yaReservada}
                    onPress={manejarReserva}
                    style={({ pressed }) => [
                        estilos.boton,
                        (cuposDisponibles <= 0 || yaReservada) && estilos.botonDeshabilitado,
                        pressed && { opacity: 0.8 },
                    ]}
                >
                    <Ionicons
                        name={yaReservada ? "checkmark-circle" : "calendar"}
                        size={18}
                        color="#FFFFFF"
                    />
                    <Text style={estilos.botonTexto}>
                        {cuposDisponibles <= 0
                            ? 'Sin cupos'
                            : yaReservada
                            ? 'Ya reservada'
                            : 'Reservar clase'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: colors.fondo,
    },
    portada: {
        width: '100%',
        backgroundColor: colors.primarioSuave,
    },
    filaEncabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filaRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.superficie,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    ratingTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.texto,
    },
    descripcion: {
        ...typography.cuerpo,
        color: colors.textoSuave,
        lineHeight: 22,
    },
    profesor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        padding: spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.borde,
    },
    profesorNombre: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.texto,
    },
    profesorPais: {
        fontSize: 12,
        color: colors.textoSuave,
        marginTop: 2,
    },
    datos: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
    },
    dato: {
        alignItems: 'center',
        gap: 3,
    },
    datoValor: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.texto,
    },
    datoEtiqueta: {
        fontSize: 11,
        color: colors.textoSuave,
    },
    seccionHorarios: {
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    listaHorarios: {
        gap: spacing.sm,
    },
    chipHorario: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.superficie,
        borderWidth: 1.5,
        borderColor: colors.borde,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    chipHorarioSeleccionado: {
        borderColor: colors.primario,
        backgroundColor: colors.primarioSuave,
    },
    textoHorario: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: colors.texto,
    },
    textoHorarioSeleccionado: {
        color: colors.primarioOscuro,
        fontWeight: '700',
    },
    badgeReservado: {
        backgroundColor: colors.acentoSuave,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    textoBadgeReservado: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.acento,
    },
    barra: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.superficie,
        borderTopWidth: 1,
        borderTopColor: colors.borde,
        paddingTop: spacing.md,
    },
    precioEtiqueta: {
        fontSize: 11,
        color: colors.textoSuave,
    },
    precio: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primario,
    },
    boton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primario,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    botonTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    botonDeshabilitado: {
        backgroundColor: colors.borde,
    },
});