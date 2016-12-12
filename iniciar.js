/**
 * iniciar.js:
 * ----------
 *    Funcion principal que pone en funcionamiento el servidor 
 * y sus dependencias (Base de datos, enrutadores y manejadores)
 *
 * Seccion # 1
 * Redes de Computadoras I (CI-4835)
 * Universidad Simon Bolivar, 2016.
 */

//Dependencias
var servidor = require("./servidor");
var rutas = require("./router");
var manejadorSolicitudes = require("./manejador");
var baseDatos = require("./basedatos");
var manejador = {};
var moment = require('moment');
manejador["/"] = manejadorSolicitudes.login;
manejador["/login"] = manejadorSolicitudes.login;
manejador["/subirLogin"] = manejadorSolicitudes.subirLogin;
manejador["/registro"] = manejadorSolicitudes.registro;
manejador["/subirRegistro"] = manejadorSolicitudes.subirRegistro;
manejador["/transferir"] = manejadorSolicitudes.transferir;
manejador["/subirTransferir"] = manejadorSolicitudes.subirTransferir;
manejador["/listaUsuarios"] = manejadorSolicitudes.listaUsuarios;
manejador["/balance"] = manejadorSolicitudes.balance;
manejador["/subirBalance"] = manejadorSolicitudes.subirBalance;
manejador["/favicon.ico"] = manejadorSolicitudes.favicon;
manejador["/logo.png"] = manejadorSolicitudes.logo;
baseDatos.iniciar();
moment.locale('es');
var fecha = moment().format('MMMM D YYYY, h:mm:ss a');
console.log("Servidor iniciado: " + fecha);
servidor.iniciar(rutas.rutas,manejador);
