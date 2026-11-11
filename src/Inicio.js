import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { traerTareas } from './api';

const TEMA = 'pref.tema';
const CACHE_TAREAS = 'cache.tareas';

export default function Inicio({ usuario, salir }) {
    const [temaOscuro, setTemaOscuro] = useState(false);
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        async function cargarTema() {
            try {
                const temaGuardado = await AsyncStorage.getItem(TEMA);
                setTemaOscuro(temaGuardado === 'oscuro');
            } catch (error) {
                console.error('No se pudo cargar el tema:', error);
            }
        }

        async function leerCache() {
            try {
                const tareasGuardadas = await AsyncStorage.getItem(CACHE_TAREAS);
                if (tareasGuardadas) {
                    setTareas(JSON.parse(tareasGuardadas));
                }
            } catch (error) {
                console.error('No se pudo leer la cache:', error);
            }
        }

        async function pedirFrescas() {
            try {
                const tareasNuevas = await traerTareas();
                setTareas(tareasNuevas);
                await AsyncStorage.setItem(CACHE_TAREAS, JSON.stringify(tareasNuevas));
            } catch (error) {
                console.error('No se pudieron cargar las tareas:', error);
            }
        }

        cargarTema();
        leerCache();
        pedirFrescas();
    }, []);

    async function cambiarTema(valor) {
        setTemaOscuro(valor);

        try {
            await AsyncStorage.setItem(TEMA, valor ? 'oscuro' : 'claro');
        } catch (error) {
            console.error('No se pudo guardar el tema:', error);
        }
    }

    return (
        <View style={[styles.container, temaOscuro && styles.containerOscuro]}>
            <Text style={[styles.texto, temaOscuro && styles.textoOscuro]}>
                Hola, {usuario.nombre}
            </Text>
            
            <Switch
                value={temaOscuro}
                onValueChange={cambiarTema}
            />

            <Pressable onPress={salir}>
                <Text style={[styles.texto, temaOscuro && styles.textoOscuro]}>
                    Salir
                </Text>
            </Pressable>

            <FlatList
                data={tareas}
                keyExtractor={(tarea) => tarea.clave}
                renderItem={({ item }) => (
                    <Text style={[styles.texto, temaOscuro && styles.textoOscuro]}>
                        {item.todo}
                    </Text>
                )}
            />

            <StatusBar style={temaOscuro ? 'light' : 'dark'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerOscuro: {
        backgroundColor: '#000',
    },
    texto: {
        color: '#000',
        margin: 8,
    },
    textoOscuro: {
        color: '#fff',
    },
});