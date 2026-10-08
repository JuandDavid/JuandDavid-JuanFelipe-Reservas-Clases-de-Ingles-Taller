# 🤖 AGENTS.md — Protocolo de Colaboración con IA y Bitácora de Aprendizaje

**Curso:** Construcción de Software V — Desarrollo Móvil  
**Proyecto:** App Móvil de Reserva de Clases de Inglés y Perfil de Estudiantes  
**Framework:** React Native con Expo  

---

## 📌 1. Propósito y Filosofía de Asistencia

Este documento define el rol, las restricciones éticas y los lineamientos de interacción de la Inteligencia Artificial (IA) en el desarrollo de este proyecto universitario. La herramienta de IA se utiliza bajo el modelo de **Tutor Técnico / Par Observador**, garantizando que el estudiante mantenga el control intelectual, la autoría y la comprensión de cada línea de código.

---

## ⚖️ 2. Las 3 Reglas Obligatorias de Asistencia de IA

### 🚫 Regla 1: Prohibida la Generación Total de Código
* La IA **NO** debe generar pantallas, componentes o módulos completos de principio a fin.
* No se admiten bloques de código masivos sin justificación.
* El estudiante debe redactar e integrar el código manualmente, aprendiendo la sintaxis y los patrones de React Native.

### 🔍 Regla 2: Rol de Observador, Analista de Código y Guía
* La IA actúa como un **depurador y analista arquitectónico**.
* Cuando el estudiante encuentra un bug, pantalla en blanco o error de compilación:
  1. La IA explica el **origen conceptual del error** (por qué falla en React / Metro).
  2. Proporciona una **guía de pasos conceptuales** y pistas para que el estudiante aplique la corrección.
  3. Sugiere buenas prácticas de optimización acordes al nivel de la materia.

### 📋 Regla 3: Tablero de Contexto y Registro de Consultas (AI Board)
* Toda interacción significativa entre el estudiante y la IA debe quedar documentada en el **Tablero de Colaboración** inferior, especificando:
  * El problema o error detectado por el estudiante.
  * El componente afectado.
  * La guía o pista técnica ofrecida por la IA.
  * La solución aplicada y su correspondiente commit.

---

## 📊 3. Tablero de Consultas, Contexto y Progreso (AI Collaboration Board)

| # | Fase / Commit | Problema / Error de Aprendiz | Componente | Causa Identificada y Pista de la IA | Solución Aplicada por el Estudiante |
|---|---|---|---|---|---|
| **1** | `commit 1: correccion reservas y hooks` | La app crashea al arrancar diciendo que `useReserva` no está dentro de un Provider, y no persiste datos. | `ReservasContext.js`, `useAlmacenamiento.js` | El `<ReservasContext.Provider>` no tenía el prop `value={valor}`, y el hook `useAlmacenamiento` no tenía sentencia `return`. | Se pasó el objeto `value` al Provider con estados y acciones, y se retornó `[valor, actualizar, listo]` en el hook. |
| **2** | `commit 2: estilos de card y colores de nivel` | Las tarjetas se ven desordenadas, la imagen colapsa en 0 píxeles y el texto no tiene jerarquía. | `Card.js`, `LabelLevel.js` | En React Native las etiquetas `<Image>` locales o remotas requieren `width` y `height` explícitos; faltaba enlazar estilos de `theme`. | Se asignaron dimensiones fijas (`height: 130`, `width: '100%'`), estilos de tarjeta con sombra y chips con colores dinámicos por nivel. |
| **3** | `commit 3: pantalla de reservas` | Al entrar a Reservas, el contenido choca con la barra superior del celular y los chips de categorías se ven aplastados. | `ReservasScreen.js`, `ClasesScreen.js` | No se respetaba el área segura (`insets.top`) y el ScrollView horizontal carecía de márgenes verticales. | Se usó `useSafeAreaInsets()` en la pantalla, se implementó `FlatList` con `ListEmptyComponent` y se dio aire a los chips. |
| **4** | `commit 4: pantalla perfil de estudiante` | Error al guardar los datos del estudiante: no se importó AsyncStorage y se pasaba un objeto directo a setItem sin serializar. | `PerfilScreen.js` | AsyncStorage solo guarda strings. Además, se debe usar la función auxiliar `saveData` del servicio centralizado. | Se corrigió usando `saveData(STORAGE_KEYS.PERFIL, perfil)` garantizando persistencia en JSON. |
| **5** | `commit 5: navegacion tipo tab` | Error 'A navigator cannot have a component that is a React element' con `component={<ClasesStack />}` y en App.js no se veían las pestañas. | `AppTabs.js`, `App.js` | En `Tab.Screen` se debe pasar la referencia a la función (`component={ClasesStack}`) y en `App.js` montar `<AppTabs />`. | Se corrigió la prop `component` en `AppTabs.js` y se conectó `<AppTabs />` en `App.js`. |
| **6** | `commit 6: flujo de reserva con horario` | Al tocar "Reservar", solo baja el contador en la pantalla de detalle pero no se guarda en Mis Reservas ni deja elegir horario. | `DetalleClaseScreen.js` | Los horarios eran texto plano (`<Text>`) y el botón solo mutaba un estado local sin llamar a `agregarReserva` del contexto. | Se convirtieron los horarios en botones interactivos (`Pressable`), se validaron duplicados y se conectó la persistencia. |
| **7** | `commit 7: detalles finales y retoques de diseno` | Ajuste dinámico de la barra de pestañas para que no colisione con el notch/gestos, y título temático en cabecera. | `AppTabs.js`, `ClasesStack.js` | En celulares con barra de gestos inferior los tabs quedan tapados sin `insets.bottom`. | Se adaptó la altura de tabBarStyle usando `useSafeAreaInsets` y se estilizó el Stack. |

---

## 🛠️ 4. Guía de Ejecución y Pruebas
1. Instalar dependencias exactas con Expo:
   ```bash
   npx expo install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npx expo start
   ```
3. Verificar compatibilidad y dependencias nativas:
   ```bash
   npx expo-doctor
   ```

