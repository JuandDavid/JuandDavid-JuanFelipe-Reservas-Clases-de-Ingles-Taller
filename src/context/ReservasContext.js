import React, { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getData, saveData } from '../services/storage';

export const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Cargar reservas guardadas con el servicio de storage
    useEffect(() => {
        const cargar = async () => {
            try {
                const guardado = await getData(STORAGE_KEYS.RESERVAS);
                if (guardado) {
                    setReservas(guardado);
                }
            } catch (error) {
                console.log('Error leyendo reservas: ', error);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    // Guardar reservas en AsyncStorage usando el servicio saveData
    useEffect(() => {
        if (!cargando) {
            saveData(STORAGE_KEYS.RESERVAS, reservas);
        }
    }, [reservas, cargando]);

    const agregarReserva = useCallback((clase, horario) => {
        const nueva = {
            id: clase.id + '-' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario,
            createdAt: new Date().toISOString(),
        };
        let resultado = { ok: true };
        setReservas((previas) => {
            if (previas.some((r) => r.id === nueva.id)) {
                resultado = { ok: false };
                return previas;
            }
            return [nueva, ...previas];
        });
        return resultado;
    },[]);
    const eliminarReserva = useCallback((id) => {
        setReservas((previas) => previas.filter((r) => r.id !== id));
    }, []);
    const valor = useMemo(
        () => ({
            cargando,
            reservas,
            agregarReserva,
            eliminarReserva,
        }),
        [cargando, reservas, agregarReserva, eliminarReserva]
    );
    return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>;
}

