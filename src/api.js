const BASE = "https://dummyjson.com";

export class ErrorHttp extends Error {
    constructor(status) {
        super(`HTTP: ${status}`);
        this.status = status;
    }
}

async function pedir(ruta, opciones = {}) {
    const respuesta = await fetch(BASE + ruta, {
        ...opciones,
        headers: { "Content-Type": "application/json", ...opciones.headers }
    });
    if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
    return respuesta.json();
}

export function login(usuario, password) {
    return pedir("/user/login", {
        method: "POST",
        body: JSON.stringify({ username: usuario, password, expiresInMins: 2 }),
    });
}

export function quienSoy(token) {
    return pedir("/user/me", {
        headers: { Authorization: "Bearer " + token }
    });
}

export async function traerTareas() {
    const datos = await pedir("/todos?limit=10");
    return datos.todos.map((tarea) => ({ ...tarea, clave: String(tarea.id) }));
}

export function crearTarea(texto) {
    return pedir("/todos/add", {
        method: "POST",
        body: JSON.stringify({ todo: texto, completed: false, userId: 1 }),
    });
}
