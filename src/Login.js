import {useState} from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { login as iniciarLogin } from './api';
import { iniciarSesion } from './sesion';

export default function Login({ alEntrar }) {
    const [usuario, setUsuario] = useState("emilys");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    async function entrar() {
        setEnviando(true);
        setError(null);
        try {
            const datos = await iniciarLogin(usuario, password);
            alEntrar( await iniciarSesion(datos));
        }catch (e){
            setError(e.status ? "Usuario o contraseña incorrectos" : `Error de red: ${e.message}`);
        }finally {
            setEnviando(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Mis Tareas</Text>
            <TextInput value={usuario} onChangeText={setUsuario} autoCapitalize="none" autoCorrect={true} placeholder="Usuario"/>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Contraseña"></TextInput>

            {error && <Text>{error}</Text>}
            <Pressable onPress={entrar} disabled={enviando}>

                <Text>{enviando ? "Entrando..." : "Entrar"}</Text>

            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})