Commit 1: correcion reservas y hooks

 En  ReservasContext.js estoy tratando de compartir el estado de las reservas con todas las pantallas, pero los componentes que usan el contexto reciben undefined, sin hacer cambios me indicas como lo puedo corregir


El problema está en la línea 70 de ReservasContext.js.

Creaste correctamente el objeto valor con useMemo, pero olvidaste pasárselo mediante la prop value al componente <ReservasContext.Provider>. Al no definir dicha propiedad, React suministra undefined a todos los componentes que consumen el contexto (o lanzan el error de useReserva.js).

¿Cómo corregirlo?

En src/context/ReservasContext.js, cambia la línea del return:

Antes:
jsx
return <ReservasContext.Provider>{children}</ReservasContext.Provider>;
Después:
jsx
return (
  <ReservasContext.Provider value={valor}>
    {children}
  </ReservasContext.Provider>
);

Con solo agregar value={valor}, todos los componentes y hooks (como useReserva) recibirán el estado (reservas, cargando, agregarReserva, eliminarReserva).
_____________________________________________________________________________________________________________________________

En ReservasContext.js trato de agregar una nueva reserva al estado global, pero cuando registro una segunda reserva la primera desaparece y no hace cambios me indicas que puedo revisar 

Este comportamiento (donde registrar un nuevo elemento borra o sobrescribe el anterior) es un problema clásico en React al manejar estado con arreglos y useCallback.

Aquí tienes los puntos clave que debes revisar en ReservasContext.js:

1. Estado obsoleto en la clausura (Stale Closure) con useCallback

Esta es la causa más común.

Si en tu función agregarReserva estás usando la variable reservas directamente de esta forma:

javascript
// ❌ ERROR COMÚN:
const agregarReserva = useCallback((clase, horario) => {
    const nueva = { ... };
    setReservas([nueva, ...reservas]); // <-- Usa 'reservas' del scope
}, []); // <-- Dependencias vacías

  

  

¿Por qué ocurre?: Al tener [] en el array de dependencias de useCallback, la función se crea una sola vez en el primer render, cuando reservas vale []. En cada llamada posterior, reservas siempre valdrá []. Por tanto:


  

  
1ª reserva: [reserva1, ...[]] 
→
→ queda [reserva1].

  
2ª reserva: [reserva2, ...[]] 
→
→ queda [reserva2] (borrando la primera).

  

  

  

  

Qué revisar / Cómo solucionarlo:
Debes usar la forma funcional del setState, que siempre recibe el valor más actualizado en memoria (previas o prevReservas):


  
javascript
//  CORRECTO:
setReservas((previas) => [nueva, ...previas]);

  

  
2. Reemplazo del arreglo en vez de propagación (Spread Operator)

Revisa que en ningún punto se esté pasando únicamente el nuevo elemento al estado:

javascript
// ❌ Reemplaza todo el arreglo por un solo elemento
setReservas([nueva]);
//  Conserva los anteriores y agrega el nuevo al inicio
setReservas((previas) => [nueva, ...previas]);
3. Mutación directa con .push()

Si se muta el arreglo existente en lugar de crear una nueva referencia:

javascript
// ❌ Mutación directa (React no detecta el cambio de referencia):
setReservas((previas) => {
    previas.push(nueva);
    return previas;
});
//  Crea una nueva referencia de arreglo:
setReservas((previas) => [nueva, ...previas]);
4. Reinicio por desmontaje del <ReservasProvider>

Si el Provider no mantiene su ciclo de vida y se desmonta al navegar de pantalla:


  
Verifica en App.js que <ReservasProvider> envuelva toda la navegación y no esté dentro de pantallas individuales.

  
Revisa AppTabs.js: pasar elementos JSX a component (ej. component={<ClasesStack />} en lugar de component={ClasesStack}) provoca que React Navigation destruya y vuelva a montar componentes al re-renderizar.

  
5. Generación del id para evitar falsos duplicados

En tu ReservasContext.js:

javascript
id: clase.id + '-' + horario

Revisa que la segunda clase que estás registrando tenga un id o un horario diferente. Si ambas tienen el mismo identificador, la condición:

javascript
if (previas.some((r) => r.id === nueva.id)) return previas;

ignorará la nueva reserva considerándola un duplicado.
_____________________________________________________________________________________________________________________________

commit 2: estilos de card y colores de nivel


En App.js estoy necesito que la información de las reservas este disponible en todas las pantallas, pero algunas no la estan recibiendo. sin hacer cambios me indicas cuál puede ser el error

El error principal en App.js es que estás renderizando <ClasesStack /> en lugar del navegador principal <AppTabs />.

¿Por qué ocurre este problema?

  

  

Pantallas excluidas de la aplicación:
ClasesStack únicamente contiene dos pantallas: ClasesScreen y DetalleClaseScreen. Pantallas fundamentales que necesitan y consumen la información de las reservas (como ReservasScreen y PerfilScreen) están registradas dentro de AppTabs.js. Al no renderizar AppTabs en App.js, dichas pantallas ni siquiera existen en el árbol de componentes ni en la navegación activa.


  

  

  

Fallo de navegación:
En DetalleClaseScreen.js, cuando el usuario confirma una reserva, el botón intenta hacer navigation.navigate('ReservasTab'). Al estar cargado solo ClasesStack, esa ruta no existe y falla la navegación.


  

  
¿Cómo corregirlo en App.js?

Debes volver a importar y renderizar AppTabs:

1. En la importación (línea 5):
javascript
// ❌ Antes:
import ClasesStack from './src/navigation/ClasesStack';
//  Después:
import AppTabs from './src/navigation/AppTabs';
2. En el componente App (línea 27):
jsx
// ❌ Antes:
<SafeAreaProvider>
  <ReservasProvider>
    <NavigationContainer theme={temaNavegacion}>
      <StatusBar style="dark" />
      <ClasesStack />
    </NavigationContainer>
  </ReservasProvider>
</SafeAreaProvider>
//  Después:
<SafeAreaProvider>
  <ReservasProvider>
    <NavigationContainer theme={temaNavegacion}>
      <StatusBar style="dark" />
      <AppTabs />
    </NavigationContainer>
  </ReservasProvider>
</SafeAreaProvider>
Detalle adicional a revisar en AppTabs.js

Una vez restaures AppTabs, revisa la línea 49 de src/navigation/AppTabs.js:

jsx
// ❌ Incorrecto: pasar un elemento JSX hace que React Navigation desmonte y remonte el stack en cada render
<Tab.Screen
  name="ClasesTab"
  component={<ClasesStack />}
  ...
/>
//  Correcto: pasar la referencia del componente
<Tab.Screen
  name="ClasesTab"
  component={ClasesStack}
  ...
/>
______________________________________________________________________________________________________________________________

En LabelLevel.js necesito diferenciar visualmente los niveles de inglés usando colores, pero la experiencia sigue viéndose muy similar entre todos los niveles. indicame que cambios me indicas que podria mejorar o validar

Para que los niveles se diferencien de forma clara y atractiva, hay 2 validaciones técnicas de por qué actualmente se ven casi iguales, y 3 mejoras visuales que puedes aplicar en src/components/LabelLevel.js.

1. Validaciones técnicas (¿Por qué se ven muy similares?)
A. Fallback por tildes o variaciones de texto

En coloresPorNivel las claves están definidas sin tildes:

javascript
export const coloresPorNivel = {
  Basico: colors.exito,        // Verde
  Intermedio: colors.primario, // Azul (#4F46E5)
  Avanzado: colors.acento,     // Ámbar
  Conversacional: '#7C3AED',   // Morado
};

Si en alguna parte de los datos o formulario el nivel viene como "Básico" (con tilde), en minúsculas ("basico"), o con espacios:


  
coloresPorNivel[level] devuelve undefined.

  
Cae en el fallback: || colors.primario.

  
Como Intermedio también usa colors.primario, tanto los niveles no reconocidos como Intermedio terminan viéndose con el mismo azul corporativo.

  

  

TIP


  

  Validación: Normaliza el texto antes de buscar en el diccionario (removiendo tildes y recortando espacios) y usa un fallback neutro (gris) para detectar fácilmente si un nivel no coincide:


  
javascript
const nivelNormalizado = level?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const colorNivel = coloresPorNivel[nivelNormalizado] || colors.textoSuave;

  
B. Opacidad del fondo demasiado baja (+ '18')

En la línea 8 de LabelLevel.js:

javascript
backgroundColor: colorNivel + '18'

En hexadecimal, '18' equivale a apenas un ~9% de opacidad (24 / 255). Sobre fondos blancos o grises claros (#F6F7FB), un 9% es prácticamente invisible al ojo humano, dando la sensación de que todas las etiquetas son simples bordes tenues sin identidad.

2. Mejoras visuales recomendadas
Opción A: Aumentar contraste y agregar un punto indicador (Recomendado)

Mantienes el estilo chip suave, pero aumentas la opacidad al ~18%-20% ('25') y añades un pequeño círculo con el color puro que guíe la vista rápidamente:

jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, coloresPorNivel } from '../theme';
export default function LabelLevel({ level }) {
  // Normalizamos para evitar fallos por tildes (ej. Básico -> Basico)
  const nivelLimpio = level ? level.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : '';
  const colorNivel = coloresPorNivel[nivelLimpio] || colors.primario;
  return (
    <View style={[styles.container, { borderColor: colorNivel, backgroundColor: colorNivel + '22' }]}>
      {/* Pequeño punto indicador con el color puro */}
      <View style={[styles.dot, { backgroundColor: colorNivel }]} />
      <Text style={[styles.text, { color: colorNivel }]}>{level}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
Opción B: Estilo insignia sólida (Solid Badge)

Si deseas máximo impacto visual para que los niveles resalten inmediatamente en las tarjetas de Card.js:


  
Fondo con el color puro del nivel (backgroundColor: colorNivel).

  
Texto en blanco puro (color: '#FFFFFF').

  
Sin bordes tenues.

  
jsx
<View style={[styles.container, { backgroundColor: colorNivel }]}>
  <Text style={styles.textSolido}>{level}</Text>
</View>
Resumen de validaciones rápidas

  
Evita que Intermedio comparta el color primario de la app: En src/theme/index.js, considera darle a Intermedio un azul celeste (#0284C7) o turquesa para que no se confunda con el color global de la app (#4F46E5).

  
Sube la opacidad del canal alfa: Cambia '18' por '25' o '30'.

  
Normaliza tildes: Garantiza que "Básico" y "Basico" resuelvan al mismo color verde (colors.exito).

_____________________________________________________________________________________________________________________________________

commit 3: pantalla de reservas

En ReservasScreen.js estoy tratando de mostrar los detalles de cada reserva para que el estudiante tenga toda la información necesaria en un solo lugar.

Para lograr que el estudiante vea toda la información de su reserva completa y clara, hay un error crítico en el código actual que impide que se muestren los datos, y luego una serie de mejoras para enriquecer la tarjeta.

1. Error crítico: Desestructuración en FlatList

En la línea 32 de src/screens/ReservasScreen.js:

javascript
// ❌ Error: recibe el objeto envoltorio { item, index }
const renderItem = (item) => (

En React Native, el método renderItem de una FlatList no pasa el elemento directamente, sino un objeto { item, index, separators }. Al declarar (item), estás accediendo a item.titulo, item.horario, etc., los cuales resultan en undefined y dejan la tarjeta en blanco o sin datos.

Corrección:

javascript
//  Correcto: desestructurar { item }
const renderItem = ({ item }) => (
2. Información esencial que debe incluir la tarjeta de reserva

Para que el estudiante tenga una experiencia completa en un solo lugar:


  
Título de la clase y Nivel: LabelLevel para reconocer el nivel al instante.

  
Profesor: Nombre del docente con icono descriptivo.

  
Horario programado: Día y hora asignados (destacado visualmente).

  
Fecha de creación de la reserva: Usar item.createdAt para indicar cuándo se apartó el cupo.

  
Estado de la reserva: Una insignia visual de "Confirmada" / "Próxima".

  
Precio y acción de cancelación: Precio abonado y botón para cancelar con alerta de confirmación.

  
3. Código mejorado para src/screens/ReservasScreen.js

Aquí tienes la implementación completa de la tarjeta para mostrar toda la información organizada:

jsx
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
  // ✅ 1. Desestructuración corregida ({ item })
  const renderItem = ({ item }) => {
    // Formatear fecha de reserva amigable
    const fechaReserva = item.createdAt 
      ? new Date(item.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
      : null;
    return (
      <View style={[estilos.tarjeta, sombra]}>
        {/* Cabecera: Título, Nivel y Badge de Estado */}
        <View style={estilos.encabezado}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={estilos.titulo} numberOfLines={2}>
              {item.titulo}
            </Text>
            <View style={estilos.filaBadges}>
              <LabelLevel level={item.nivel} />
              <View style={estilos.badgeConfirmada}>
                <Ionicons name="checkmark-circle" size={12} color={colors.exito} />
                <Text style={estilos.textoConfirmada}>Confirmada</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Detalles de la sesión */}
        <View style={estilos.cuerpoInfo}>
          <View style={estilos.filaInfo}>
            <Ionicons name="person-outline" size={16} color={colors.textoSuave} />
            <Text style={estilos.textoInfo}>Prof. {item.profesor}</Text>
          </View>
          <View style={estilos.filaInfo}>
            <Ionicons name="calendar-outline" size={16} color={colors.primario} />
            <Text style={[estilos.textoInfo, estilos.textoDestacado]}>{item.horario}</Text>
          </View>
          {fechaReserva && (
            <View style={estilos.filaInfo}>
              <Ionicons name="time-outline" size={16} color={colors.textoSuave} />
              <Text style={estilos.textoSecundario}>Apartada el {fechaReserva}</Text>
            </View>
          )}
        </View>
        {/* Pie: Precio y Botón de Cancelar */}
        <View style={estilos.pie}>
          <View>
            <Text style={estilos.precioEtiqueta}>Total pagado</Text>
            <Text style={estilos.precio}>{formatearPrecio(item.precio)}</Text>
          </View>
          <TouchableOpacity
            style={estilos.botonEliminar}
            onPress={() => confirmarEliminar(item.id, item.titulo)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.peligro} />
            <Text style={estilos.textoEliminar}>Cancelar clase</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={[estilos.pantalla, { paddingTop: insets.top + spacing.md }]}>
      <View style={[estilos.cabecera, { paddingHorizontal }]}>
        <Text style={typography.titulo}>Mis Reservas</Text>
        <Text style={typography.secundario}>
          {reservas.length === 1 ? '1 clase programada' : `${reservas.length} clases programadas`}
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
            titulo="No tienes reservas activas"
            mensaje="Explora el catálogo de clases de inglés y agenda tu próximo horario."
          />
        }
      />
    </View>
  );
}
const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  cabecera: { marginBottom: spacing.md },
  lista: { paddingBottom: spacing.xxl },
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
  filaBadges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  badgeConfirmada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.exito + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  textoConfirmada: { fontSize: 11, fontWeight: '600', color: colors.exito },
  cuerpoInfo: { gap: spacing.xs },
  filaInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  textoInfo: { fontSize: 14, color: colors.textoSuave },
  textoDestacado: { color: colors.primario, fontWeight: '700' },
  textoSecundario: { fontSize: 12, color: colors.textoSuave },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingTop: spacing.sm,
  },
  precioEtiqueta: { fontSize: 11, color: colors.textoSuave },
  precio: { fontSize: 16, fontWeight: '800', color: colors.texto },
  botonEliminar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.peligro + '10',
  },
  textoEliminar: { color: colors.peligro, fontSize: 13, fontWeight: '600' },
});
4. Sugerencia complementaria para ReservasContext.js

Si deseas mostrar también la modalidad (Virtual/Presencial) o la duración (minutos) en la reserva, puedes incluir esos campos en el objeto de la reserva dentro de agregarReserva:

javascript
const nueva = {
    id: clase.id + '-' + horario,
    titulo: clase.titulo,
    nivel: clase.nivel,
    profesor: clase.profesor.nombre,
    precio: clase.precio,
    horario,
    modalidad: clase.modalidad,   // 💡 Añadir modalidad
    duracion: clase.duracion,     // 💡 Añadir duración
    createdAt: new Date().toISOString(),
};
______________________________________________________________________________________________________________________________________

estoy tratando de mostrar las reservas ReservasScreen.js que vienen desde useReserva(), pero quiero asegurarme de que la información se mantenga sincronizada con los cambios realizados en otras pantallas

Gracias a React Context, la sincronización entre pantallas ya es reactiva por naturaleza: cualquier componente que use useReserva() se suscribe automáticamente a los cambios. En el momento en que una pantalla (como DetalleClaseScreen) ejecuta agregarReserva(), el estado global se actualiza y React vuelve a renderizar de inmediato todas las pantallas suscritas, incluida ReservasScreen.js.

Para garantizar que esta sincronización nunca falle ni se desincronice, valida las siguientes 5 reglas de oro:

1. No dupliques reservas en un estado local (useState)

Este es el error más común que rompe la sincronización. Si haces esto en ReservasScreen.js:

javascript
// ❌ Error: copia en estado local
const { reservas } = useReserva();
const [misReservas, setMisReservas] = useState(reservas); // Se queda congelado con el valor inicial

Al copiarlo en un useState local, el componente solo toma el valor en el primer montaje y no se entera cuando otra pantalla agrega una reserva.


  
Solución: Pasa reservas directamente a la lista:
  
jsx
<FlatList data={reservas} ... />

  

  
2. Maneja el estado cargando de AsyncStorage

En ReservasContext.js el estado inicia vacío [] mientras se leen las reservas guardadas en el disco con getData().

Si no verificas cargando, el usuario verá por unos milisegundos el mensaje de "No tienes reservas aún", dando la falsa impresión de que los datos no se sincronizaron.


  
Solución: Consume cargando desde useReserva() y muestra un indicador de carga mientras lee el almacenamiento:
  
jsx
const { reservas, eliminarReserva, cargando } = useReserva();
if (cargando) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primario} />
    </View>
  );
}

  

  
3. Agrega la prop extraData={reservas} a la FlatList

Las FlatList de React Native optimizan los re-renders. A veces, si un elemento interno no detecta el cambio o si se cancela una reserva, la lista podría no refrescarse visualmente de inmediato.


  
Solución: Indícale explícitamente a la lista que depende de reservas:
  
jsx
<FlatList
  data={reservas}
  extraData={reservas} //  Garantiza el re-render inmediato ante cualquier adición o eliminación
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
/>

  

  
4. Mantén una única fuente de la verdad en App.js

Asegúrate de que <ReservasProvider> esté ubicado únicamente en la raíz (App.js), envolviendo a todo el <NavigationContainer>.

Si por error se coloca un <ReservasProvider> dentro de una pantalla o stack individual, cada pantalla tendrá una instancia de reservas independiente en memoria y no compartirán los datos.

5. Respetar la inmutabilidad en ReservasContext.js

Para que React sepa que debe notificar a ReservasScreen, el arreglo en el contexto siempre debe generar una nueva referencia:

javascript
//  Correcto al agregar:
setReservas((previas) => [nueva, ...previas]);
//  Correcto al eliminar:
setReservas((previas) => previas.filter((r) => r.id !== id));
// ❌ Incorrecto (mutación directa, React no detectará cambios entre pantallas):
reservas.push(nueva);
Resumen del flujo sincronizado

Siguiendo estos pasos, en cuanto el usuario presione "Confirmar reserva" en el detalle de una clase y navegue a la pestaña de reservas, la nueva clase ya estará pintada en la lista en tiempo real.
__________________________________________________________________
commit 4 : pantalla perfil de estudiante

En PerfilScreen.js explicame como puedo hacer para guardar la información del estudiante y no tenga que volver a ingresarla cada vez que abre la aplicación

Para que la información del estudiante persista y se cargue automáticamente cada vez que se abre la aplicación, se requiere un ciclo de persistencia con almacenamiento local (AsyncStorage).

En tu código de PerfilScreen.js ya tienes casi todo preparado, pero hay un error específico en la función guardarPerfil que impide que los datos se guarden en el disco del teléfono.

1. ¿Cuál es el error actual en PerfilScreen.js?

En la función guardarPerfil (líneas 80-81) tienes:

javascript
try {
  // Error de novato: guardar el objeto directo sin JSON.stringify
  await AsyncStorage.setItem(STORAGE_KEYS.PERFIL, perfil);
  setGuardado(true);
  ...
} catch (error) {
  Alert.alert('Error', 'No se pudo guardar la información del perfil.');
}

Este código falla por dos motivos:


  
AsyncStorage no está importado: En las importaciones del archivo no existe AsyncStorage, lo que lanza un error de variable no definida (ReferenceError) y salta directo al catch.

  
AsyncStorage solo almacena strings: perfil es un objeto JavaScript ({ nombre, apellido, ... }). AsyncStorage.setItem no puede guardar objetos directamente; requiere serializarlos con JSON.stringify().

  

Al fallar la escritura en disco, los datos se quedan solo en la memoria RAM temporal. Cuando cierras o recargas la app, esa memoria se borra.

2. ¿Cómo corregirlo usando tu servicio saveData?

En la línea 21 de PerfilScreen.js ya tienes importada la función auxiliar saveData desde ../services/storage:

javascript
import { getData, saveData, removeData } from '../services/storage';

Esta función ya se encarga de convertir el objeto a texto con JSON.stringify internamente. Solo debes reemplazar la línea 81:

En src/screens/PerfilScreen.js:
javascript
// ❌ Antes:
await AsyncStorage.setItem(STORAGE_KEYS.PERFIL, perfil);
//  Después:
await saveData(STORAGE_KEYS.PERFIL, perfil);
3. ¿Cómo funciona el ciclo completo de persistencia?

Para que no tengas que volver a ingresar los datos, el flujo funciona en dos momentos clave:

A. Al abrir la app (Lectura automática):

Tu useEffect (líneas 40-62) ya está bien implementado:

javascript
useEffect(() => {
  const cargarPerfil = async () => {
    try {
      // 1. Lee del almacenamiento local
      const perfil = await getData(STORAGE_KEYS.PERFIL);
      
      // 2. Si existen datos guardados, restaura los estados y muestra la tarjeta
      if (perfil) {
        setNombre(perfil.nombre || '');
        setApellido(perfil.apellido || '');
        setNivelIngles(perfil.nivelIngles || 'Basico');
        setTelefono(perfil.telefono || '');
        setDocumento(perfil.documento || '');
        setGuardado(true);
        setEditando(false);
      } else {
        // 3. Si no hay datos, abre el formulario para escribir
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
B. Al presionar "Guardar" (Escritura en disco):

Al usar await saveData(STORAGE_KEYS.PERFIL, perfil);:


  
El objeto se convierte en texto plano JSON y se almacena en el dispositivo físico bajo la clave @perfil_estudiante.

  
Al reiniciar Expo o cerrar la aplicación, getData encontrará ese registro y llenará los campos automáticamente.
____________________________________________________________________________________

Indicame como guardar el nivel que seleccione el estudiante junto con el resto de sus datos sin que se pierda la información

Para guardar el nivel de inglés seleccionado junto con los demás datos y garantizar que no se pierda al cerrar la app, el flujo requiere conectar 4 pasos esenciales dentro de src/screens/PerfilScreen.js:

1. Capturar la selección en el estado local (useState)

Primero, asegúrate de tener un estado para almacenar el nivel actual (con un valor por defecto seguro como 'Basico'):

javascript
// Línea 32 de PerfilScreen.js
const [nivelIngles, setNivelIngles] = useState('Basico');

En el formulario, los botones o chips de nivel deben actualizar dicho estado cada vez que el estudiante toque una opción:

jsx
// Líneas 277-300 de PerfilScreen.js
<View style={estilos.filaNiveles}>
  {NIVELES_DISPONIBLES.map((item) => {
    const seleccionado = nivelIngles === item;
    return (
      <TouchableOpacity
        key={item}
        style={[
          estilos.chipNivel,
          seleccionado && estilos.chipNivelSeleccionado, // Resalta el nivel elegido
        ]}
        onPress={() => setNivelIngles(item)} // ✅ Actualiza el estado con el nivel pulsado
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
2. Empaquetar nivelIngles en el objeto del perfil

Cuando el estudiante presiona "Guardar Información", la función guardarPerfil debe incluir la propiedad nivelIngles dentro del objeto único que se enviará al almacenamiento:

javascript
// Líneas 70-77 de PerfilScreen.js
const perfil = {
  nombre: nombre.trim(),
  apellido: apellido.trim(),
  nivelIngles, // ✅ Se incluye junto a los demás datos
  telefono: telefono.trim(),
  documento: documento.trim(),
  actualizadoEn: new Date().toISOString(),
};
3. Guardar el objeto en almacenamiento persistente con saveData

Para que el nivel y los datos se graben físicamente en el dispositivo:

javascript
// Líneas 79-88 de PerfilScreen.js
try {
  // ✅ Usar saveData para serializar automáticamente a JSON y guardar en AsyncStorage
  await saveData(STORAGE_KEYS.PERFIL, perfil);
  setGuardado(true);
  setEditando(false);
  Alert.alert('¡Éxito!', 'Tus datos de estudiante han sido guardados.');
} catch (error) {
  Alert.alert('Error', 'No se pudo guardar la información del perfil.');
}
4. Recuperar y restaurar el nivel al reabrir la app (useEffect)

Cuando el estudiante vuelve a abrir la pantalla, el useEffect inicial lee el perfil guardado con getData y restaura el estado de nivelIngles:

javascript
// Líneas 40-52 de PerfilScreen.js
useEffect(() => {
  const cargarPerfil = async () => {
    try {
      const perfil = await getData(STORAGE_KEYS.PERFIL);
      if (perfil) {
        setNombre(perfil.nombre || '');
        setApellido(perfil.apellido || '');
        // ✅ Restaura el nivel guardado; si no existiera, usa 'Basico' como respaldo
        setNivelIngles(perfil.nivelIngles || 'Basico');
        setTelefono(perfil.telefono || '');
        setDocumento(perfil.documento || '');
        setGuardado(true);
        setEditando(false);
      }
    } catch (error) {
      console.log('Error cargando perfil:', error);
    } finally {
      setCargando(false);
    }
  };
  cargarPerfil();
}, []);
5. Visualizar el nivel en la credencial del estudiante

Una vez guardado, en la tarjeta de presentación se muestra el nivel recuperado usando el componente LabelLevel:

jsx
// Línea 150 de PerfilScreen.js
<View style={estilos.contenedorNivel}>
  <LabelLevel level={nivelIngles} />
</View>

Con este flujo unificado, cada vez que el estudiante cambie de nivel y guarde, su nuevo nivel quedará grabado en disco y se mantendrá intacto al reiniciar la aplicación.

revisa porfavor la clase PerfilScreen.js y ayudame a corregir el error

He revisado src/screens/PerfilScreen.js y ya he aplicado la corrección.

¿Cuál era el error?

En la línea 80, dentro de guardarPerfil:

javascript
// ❌ Antes:
await AsyncStorage.setItem(STORAGE_KEYS.PERFIL, perfil);

Tenía dos problemas que provocaban que saltara inmediatamente al bloque catch mostrando la alerta "No se pudo guardar la información del perfil":


  
AsyncStorage no estaba importado en el archivo, lo que generaba un ReferenceError.

  
AsyncStorage.setItem solo acepta texto (string), por lo que pasarle el objeto perfil directamente sin serializar no es compatible.

  
Corrección aplicada

Se reemplazó la llamada directa por la función auxiliar saveData (que ya tienes importada en la línea 21 y que internamente ejecuta JSON.stringify):

javascript
//  Ahora (línea 80):
await saveData(STORAGE_KEYS.PERFIL, perfil);

Con este cambio:


  
La información del estudiante (nombre, apellido, documento, teléfono y nivel seleccionado) se guarda correctamente en el almacenamiento del dispositivo.

  
Al recargar o reiniciar la aplicación, la función cargarPerfil() en el useEffect recuperará los datos y los mostrará en la credencial sin necesidad de volver a ingresarlos.
____________________________________________________________________________________

commit 5: 