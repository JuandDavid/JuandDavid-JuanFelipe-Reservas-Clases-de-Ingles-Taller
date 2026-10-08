import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClasesScreen from "../screens/ClasesScreen";
import DetalleClaseScreen from "../screens/DetalleClaseScreen";
import { colors } from "../theme/index.js";

const Stack = createNativeStackNavigator();

export default function ClasesStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={ClasesScreen}
                options={{headerShown: false}} 
            />
            <Stack.Screen
                name="DetalleClase" 
                component={DetalleClaseScreen}
                options={{
                    title: 'Detalle de la clase',
                    headerBackTitle: 'Atrás',
                    headerTintColor: colors.primario,
                }} 
            />
        </Stack.Navigator>
    );
}