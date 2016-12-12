/**
 * router.js:
 * ----------
 *    Funcion que se se encarga de dar a cada solicitud el manejador adecuado a
 * su ruta.
 *
 * Seccion # 1
 * Redes de Computadoras I (CI-4835)
 * Universidad Simon Bolivar, 2016.
 */


// Funcion que le da a cada ruta su funcion respuesta adecuada
function route(manejador,ruta,respuesta,data) {
    console.log("A punto de rutear una peticion para " + ruta);
    if (typeof manejador[ruta] === 'function') {
        return manejador[ruta](respuesta,data);
    } else {
        console.log("No se encontro manipulador para " + ruta);
        respuesta.writeHead(200, {"Content-Type": "text/html"});
        respuesta.write("404 No Encontrado" + ruta);
        respuesta.end();
    }
}

// Exportamos funciones
exports.rutas = route;
