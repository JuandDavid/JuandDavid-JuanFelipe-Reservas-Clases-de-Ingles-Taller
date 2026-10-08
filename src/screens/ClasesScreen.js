import React, {useState, useMemo} from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, ScrollView, FlatList } from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';;
import {Ionicons} from '@expo/vector-icons';
import LabelLevel from "../components/LabelLevel";
import Card from "../components/Card.js";
import LevelChip  from "../components/LevelChip";
import EstadoVacio from "../components/EstadoVacio.js";
import useResponsive from "../hooks/useResponsive.js";

import { colors, spacing, radius, typography } from '../theme/index.js';
import {formatearPrecio, CLASES, NIVELES} from '../data/clases';

export default function ClasesScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const {columnas, paddingHorizontal} = useResponsive();

    const [nivel, setNivel] = useState('Todos');
    const[busqueda, setBusqueda] = useState('');

    const resultados = useMemo(() => {
        const textoBusqueda = busqueda.trim().toLowerCase()
    return CLASES.filter((clase) => {
        const coincidenciaNivel = nivel === 'Todos' || clase.nivel === nivel;
        const coincidenciaTexto = !textoBusqueda || 
        clase.titulo.toLowerCase().includes(textoBusqueda) ||
        clase.profesor.nombre.toLowerCase().includes(textoBusqueda);
        return coincidenciaNivel && coincidenciaTexto
    })
}, [nivel, busqueda]);

    return(
        <View style={[style.pantalla, { paddingTop: insets.top + spacing.md }]}>            
    <View style={{ paddingHorizontal }}>
        <Text style={typography.titulo}>Reserva Clases de Inglés</Text>
        <View style={style.buscador}> ... </View>
    </View>
    <ScrollView
        style={{ flexGrow: 0, marginVertical: spacing.md }}
        contentContainerStyle={{ paddingHorizontal, paddingVertical: 2 }}
        horizontal
        showsHorizontalScrollIndicator={false}
    >

                {
                    NIVELES.map((item) => (
                        <LevelChip
                            key={item}
                            label={item}
                            active={nivel === item}
                            onPress={() => setNivel(item)}
                        />
                    ))
                }
            </ScrollView>
            <FlatList
                data={resultados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card clase={item} 
                        onPress = {() => navigation.navigate('DetalleClase', {clase: item})}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal,
                    flexGrow: 1,
                }}
                numColumns={columnas}
                ListEmptyComponent={
                    <EstadoVacio
                        icono="search-outline"
                        titulo="No encontramos resultados"
                        mensaje="La combinación de búsqueda no arrojó resultados."
                        onAccion={() => {
                            setBusqueda('');
                            setNivel('Todos');
                        }
                    }
                    />
                }
            />
        </View>
    )
}

const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});