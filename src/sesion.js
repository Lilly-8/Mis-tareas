import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN = "sesion.token";
export const USUARIO = "sesion.usuario";

export async function iniciarSesion(datos) {
    const usuario = { id: datos.id, nombre: datos.firstName };
    await SecureStore.setItemAsync(TOKEN, datos.accessToken);
    //Credencial -> SecureStore
    await AsyncStorage.setItem(USUARIO, JSON.stringify(usuario));
    // no sensible -> AsyncStorage
    return usuario;
}

export async function leerToken() {
    return SecureStore.getItemAsync(TOKEN);
}

export async function cerrarSesion() {
    await SecureStore.deleteItemAsync(TOKEN);
    await AsyncStorage.multiRemove([USUARIO, "cache.tareas","sesion.usuario", "sesion.tareas", "copla.pendientes"]);
}

