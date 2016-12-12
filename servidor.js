/**
 * servidor.js:
 * ----------
 *    Inicio de base de datos SQLite. Crea una tabla de usuarios con
 * los siguientes campos:
 *
 * Seccion # 1
 * Redes de Computadoras I (CI-4835)
 * Universidad Simon Bolivar, 2016.
 */


// Dependencias
var http = require("http");
var url =  require("url");

// Funcion inicia el servidor
// enrutador: Funcion que dependiendo de la ruta elige el manejador adecuado
// manejador: Arreglo con las rutas y su manejador asociado 
function iniciar(enrutador,manejador) {
    
    // Funcion que maneja c/u de las peticiones al servidor
    function enPeticion(peticion, respuesta) {
        var dataPosteada = "";
        var ruta = url.parse(peticion.url).pathname;
        console.log("Petición para " + ruta + " recibida.");
        peticion.setEncoding("utf8");  // Agregamos un listener para los
        peticion.addListener("data", function(trozoPosteado) {// datos pasados 
          dataPosteada += trozoPosteado;        // por las peticiones (POST)
          console.log("Recibido trozo POST '" + trozoPosteado + "'.");
        });
        peticion.addListener("end", function() {
            enrutador(manejador, ruta,respuesta, dataPosteada);
        });
    }
    
    http.createServer(enPeticion).listen(8080); // Creamos servidor http
    console.log("Servidor Iniciado.");
    
}


// Exportamos funciones
exports.iniciar = iniciar;
