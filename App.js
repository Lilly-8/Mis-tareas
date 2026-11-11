import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import Login from './src/Login';
import Inicio from './src/Inicio';
import { leerToken, cerrarSesion } from './src/sesion';
import { quienSoy } from './src/api';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [revisando, setRevisando] = useState(true);

  useEffect(() => {
    async function revisarSesion() {
      const token = await leerToken();
      if (!token) return;
      try {
        const yo = await quienSoy(token);
        setUsuario({ id: yo.id, nombre: yo.firstName });
      } catch (error) {
        if (error.status === 401)await cerrarSesion(); // expiro el token, no hay que hacer nada mas, solo cerrar sesion
      }
    }
    revisarSesion().finally(() => setRevisando(false));
  }, []);

  async function salir() {
    await cerrarSesion();
    setUsuario(null);
  }

  if (revisando) return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  if (!usuario) return <Login alEntrar={setUsuario} />;

  return <Inicio usuario={usuario} salir={salir} />;
}
