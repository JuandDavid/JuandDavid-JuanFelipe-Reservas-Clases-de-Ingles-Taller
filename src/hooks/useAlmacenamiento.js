import { useState, useEffect, useCallback } from 'react';
import { getData, saveData } from '../services/storage';

export default function useAlmacenamiento(key, valorInicial) {
    const [valor, setValor] = useState(valorInicial);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        let activo = true;

        getData(key)
            .then((guardado) => {
                if (activo && guardado !== null) {
                    setValor(guardado);
                }
            })
            .catch((error) => console.log('Error leyendo ' + key, error))
            .finally(() => activo && setListo(true));

        return () => {
            activo = false;
        };
    }, [key]);

    const actualizar = useCallback(
        async (nuevoValor) => {
            setValor(nuevoValor);
            await saveData(key, nuevoValor);
        },
        [key]
    );

    // Olvido de retornar el estado y la funcion
}

// Alias para compatibilidad con el ejemplo de la profesora (useAsyncStorage)
export { useAlmacenamiento as useAsyncStorage };