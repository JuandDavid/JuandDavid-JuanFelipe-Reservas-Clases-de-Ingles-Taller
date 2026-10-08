import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';
import useReserva from '../hooks/useReserva';
import LabelLevel from '../components/LabelLevel';
import { colors, spacing, radius, typography, sombra } from '../theme';
import { NIVELES } from '../data/clases';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getData, saveData, removeData } from '../services/storage';

const NIVELES_DISPONIBLES = NIVELES.filter((n) => n !== 'Todos');

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = useResponsive();
  const { reservas } = useReserva();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nivelIngles, setNivelIngles] = useState('Basico');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumento] = useState('');

  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await getData(STORAGE_KEYS.PERFIL);
        if (perfil) {
          setNombre(perfil.nombre || '');
          setApellido(perfil.apellido || '');
          setNivelIngles(perfil.nivelIngles || 'Basico');
          setTelefono(perfil.telefono || '');
          setDocumento(perfil.documento || '');
          setGuardado(true);
          setEditando(false);
        } else {
          setEditando(true);
        }
      } catch (error) {
        console.log('Error cargando perfil:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  const guardarPerfil = async () => {
    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !documento.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos del formulario.');
      return;
    }

    const perfil = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nivelIngles,
      telefono: telefono.trim(),
      documento: documento.trim(),
      actualizadoEn: new Date().toISOString(),
    };

    try {
      await saveData(STORAGE_KEYS.PERFIL, perfil);
      setGuardado(true);
      setEditando(false);
      Alert.alert('¡Éxito!', 'Tus datos de estudiante han sido guardados.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información del perfil.');
    }
  };

  const confirmarBorrar = () => {
    Alert.alert(
      'Eliminar perfil',
      '¿Seguro que deseas borrar tus datos de estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await removeData(STORAGE_KEYS.PERFIL);
            setNombre('');
            setApellido('');
            setNivelIngles('Basico');
            setTelefono('');
            setDocumento('');
            setGuardado(false);
            setEditando(true);
          },
        },
      ]
    );
  };

  const iniciales = `${nombre ? nombre[0].toUpperCase() : ''}${apellido ? apellido[0].toUpperCase() : ''}` || 'ES';

  return (
    <View style={[estilos.pantalla, { paddingTop: insets.top + spacing.md }]}>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            estilos.contenedor,
            { paddingHorizontal, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecera}>
            <Text style={typography.titulo}>Perfil de Estudiante</Text>
            <Text style={typography.secundario}>
              {guardado && !editando
                ? 'Información académica registrada'
                : 'Registra o actualiza tus datos personales'}
            </Text>
          </View>

          {/* MODO VISUALIZACIÓN: Tarjeta del estudiante */}
          {guardado && !editando ? (
            <View style={[estilos.tarjetaCredencial, sombra]}>
              <View style={estilos.filaAvatar}>
                <View style={estilos.avatarCirculo}>
                  <Text style={estilos.textoIniciales}>{iniciales}</Text>
                </View>
                <View style={estilos.infoEstudiante}>
                  <Text style={estilos.nombreCompleto}>
                    {nombre} {apellido}
                  </Text>
                  <View style={estilos.contenedorNivel}>
                    <LabelLevel level={nivelIngles} />
                  </View>
                </View>
              </View>

              <View style={estilos.divisor} />

              <View style={estilos.filasDetalle}>
                <View style={estilos.itemDetalle}>
                  <Ionicons name="card-outline" size={18} color={colors.primario} />
                  <View style={estilos.textoColumna}>
                    <Text style={estilos.etiquetaCampo}>Documento de Identidad</Text>
                    <Text style={estilos.valorCampo}>{documento}</Text>
                  </View>
                </View>

                <View style={estilos.itemDetalle}>
                  <Ionicons name="call-outline" size={18} color={colors.primario} />
                  <View style={estilos.textoColumna}>
                    <Text style={estilos.etiquetaCampo}>Teléfono de Contacto</Text>
                    <Text style={estilos.valorCampo}>{telefono}</Text>
                  </View>
                </View>

                <View style={estilos.itemDetalle}>
                  <Ionicons name="school-outline" size={18} color={colors.primario} />
                  <View style={estilos.textoColumna}>
                    <Text style={estilos.etiquetaCampo}>Nivel de Inglés Actual</Text>
                    <Text style={estilos.valorCampo}>{nivelIngles}</Text>
                  </View>
                </View>

                <View style={estilos.itemDetalle}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primario} />
                  <View style={estilos.textoColumna}>
                    <Text style={estilos.etiquetaCampo}>Clases Reservadas</Text>
                    <Text style={estilos.valorCampo}>
                      {reservas.length === 1 ? '1 clase activa' : `${reservas.length} clases activas`}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={estilos.accionesCredencial}>
                <TouchableOpacity
                  style={[estilos.boton, estilos.botonEditar]}
                  onPress={() => setEditando(true)}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={estilos.textoBoton}>Editar Información</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.botonBorrar}
                  onPress={confirmarBorrar}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.peligro} />
                  <Text style={estilos.textoBotonBorrar}>Borrar mis datos</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* MODO EDICIÓN / REGISTRO: Formulario */
            <View style={[estilos.tarjetaFormulario, sombra]}>
              <Text style={estilos.tituloFormulario}>
                {guardado ? 'Editar mis datos' : 'Datos del estudiante'}
              </Text>

              <View style={estilos.campo}>
                <Text style={estilos.label}>Nombre</Text>
                <View style={estilos.inputContenedor}>
                  <Ionicons name="person-outline" size={18} color={colors.textoSuave} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Ej: Juan"
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={estilos.campo}>
                <Text style={estilos.label}>Apellido</Text>
                <View style={estilos.inputContenedor}>
                  <Ionicons name="person-outline" size={18} color={colors.textoSuave} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Ej: Gómez"
                    value={apellido}
                    onChangeText={setApellido}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={estilos.campo}>
                <Text style={estilos.label}>Documento de Identidad</Text>
                <View style={estilos.inputContenedor}>
                  <Ionicons name="card-outline" size={18} color={colors.textoSuave} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Ej: 1020304050"
                    value={documento}
                    onChangeText={setDocumento}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={estilos.campo}>
                <Text style={estilos.label}>Teléfono</Text>
                <View style={estilos.inputContenedor}>
                  <Ionicons name="call-outline" size={18} color={colors.textoSuave} />
                  <TextInput
                    style={estilos.input}
                    placeholder="Ej: 3001234567"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={estilos.campo}>
                <Text style={estilos.label}>Nivel de Inglés</Text>
                <View style={estilos.filaNiveles}>
                  {NIVELES_DISPONIBLES.map((item) => {
                    const seleccionado = nivelIngles === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[
                          estilos.chipNivel,
                          seleccionado && estilos.chipNivelSeleccionado,
                        ]}
                        onPress={() => setNivelIngles(item)}
                      >
                        <Text
                          style={[
                            estilos.textoChipNivel,
                            seleccionado && estilos.textoChipSeleccionado,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={estilos.accionesFormulario}>
                <TouchableOpacity
                  style={[estilos.boton, estilos.botonGuardar]}
                  onPress={guardarPerfil}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={estilos.textoBoton}>Guardar Información</Text>
                </TouchableOpacity>

                {guardado && (
                  <TouchableOpacity
                    style={estilos.botonCancelar}
                    onPress={() => setEditando(false)}
                  >
                    <Text style={estilos.textoBotonCancelar}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  flex: {
    flex: 1,
  },
  contenedor: {
    paddingTop: spacing.sm,
  },
  cabecera: {
    marginBottom: spacing.lg,
  },
  tarjetaCredencial: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  filaAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoIniciales: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  infoEstudiante: {
    flex: 1,
    gap: 6,
  },
  nombreCompleto: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.texto,
  },
  contenedorNivel: {
    alignSelf: 'flex-start',
  },
  divisor: {
    height: 1,
    backgroundColor: colors.borde,
    marginVertical: spacing.xs,
  },
  filasDetalle: {
    gap: spacing.md,
  },
  itemDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textoColumna: {
    flex: 1,
  },
  etiquetaCampo: {
    fontSize: 12,
    color: colors.textoSuave,
    fontWeight: '500',
  },
  valorCampo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.texto,
    marginTop: 2,
  },
  accionesCredencial: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  botonEditar: {
    backgroundColor: colors.primario,
  },
  botonGuardar: {
    backgroundColor: colors.primario,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  botonBorrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
  },
  textoBotonBorrar: {
    color: colors.peligro,
    fontSize: 13,
    fontWeight: '600',
  },
  tarjetaFormulario: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  tituloFormulario: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.texto,
    marginBottom: spacing.xs,
  },
  campo: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.texto,
  },
  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.fondo,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.texto,
    paddingVertical: 0,
  },
  filaNiveles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 4,
  },
  chipNivel: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.fondo,
  },
  chipNivelSeleccionado: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  textoChipNivel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textoSuave,
  },
  textoChipSeleccionado: {
    color: '#FFFFFF',
  },
  accionesFormulario: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  botonCancelar: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  textoBotonCancelar: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textoSuave,
  },
});

