import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------
// 1) setItem = Guardar datos
// "Serializa objetos con JSON" — AsyncStorage SOLO guarda strings
// ---------------------------------------------------------------
export const saveData = async (key, value) => {
  try {
    const json = JSON.stringify(value); // objeto/array/número → string
    await AsyncStorage.setItem(key, json);
    console.log(`setItem("${key}")`, json);
  } catch (error) {
    console.log('Error guardando:', error);
  }
};

// ---------------------------------------------------------------
// 2) getItem = Leer datos
// Si la key no existe, AsyncStorage devuelve null
// ---------------------------------------------------------------
export const getData = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    console.log(`getItem("${key}")`, json);
    return json !== null ? JSON.parse(json) : null; // string → objeto
  } catch (error) {
    console.log('Error leyendo:', error);
    return null;
  }
};

// ---------------------------------------------------------------
// 3) removeItem = Eliminar UNA key
// ---------------------------------------------------------------
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`removeItem("${key}")`);
  } catch (error) {
    console.log('Error eliminando:', error);
  }
};

// ---------------------------------------------------------------
// 4) clear = Borrar TODO el almacenamiento de la app
// ---------------------------------------------------------------
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('clear()');
  } catch (error) {
    console.log('Error limpiando:', error);
  }
};

// ---------------------------------------------------------------
// ver TODO lo guardado tal cual (strings crudos)
// ---------------------------------------------------------------
export const getAllRaw = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.log('Error leyendo todo:', error);
    return [];
  }
};
