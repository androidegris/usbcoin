/**
 * manejador.js:
 * ----------
 *    Funciones que manejan las peticiones al servidor y devuelven la respuesta
 * adecuada.
 *
 * Seccion # 1
 * Redes de Computadoras I (CI-4835)
 * Universidad Simon Bolivar, 2016.
 */

// Dependencias
var querystring = require("querystring");
var file = "usuarios.db";
var fs = require('fs');
var moment = require('moment'); // Libreria para la fecha
moment.locale('es');

// Desplega formulario de login
function login(respuesta,data) {
    console.log("Manipulador de petición 'login' ha sido llamado.");
    var body =  "<head>"+
        '<meta charset="UTF-8">'+
            "<title>LOGIN</title>"+
        "</head>"+
        "<body>"+
            "<html>"+
                "<head>"+
                    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />'+
                "</head>"+
       '<img src="/logo.png" alt="Logo USBCoin" style="width:218px;height:125px;">'+
                '<h1>Login UsbCoin</h1>'+
                "<body>"+
                    '<form action="/subirLogin" method="post">'+
    '<input type="TEXT" name="user" placeholder="Nombre de Usuario" size="40">'+
                            "<br>"+
    '<input type="password" name="password" placeholder="Clave" size="40">'+
                                    "<br>"+
                                        '<input type="submit" value="ENVIAR" />'+
                                    "</form>"+
                                    '<form action="/registro">'+    
                                    "<br>"+
                                '<input type="submit" value="REGISTRO USUARIO" />'+
                                    "</form>" + 
                                '<form action="/transferir">'+    
                                    "<br>"+
                                '<input type="submit" value="TRANSFERIR SALDO" />'+
                                    "</form>" +
                                '<form action="/listaUsuarios">'+    
                                    "<br>"+
                                '<input type="submit" value="LISTA USUARIOS" />'+
                                    "</form>" +
                                '<form action="/balance">'+    
                                    "<br>"+
                                '<input type="submit" value="BALANCE TRANSFERENCIAS" />'+
                                    "</form>"
                                "</body>"+
                            "</html>"+
                        "</body>"+
                    '</html>';
    
    
    respuesta.writeHead(200, {"Content-Type": "text/html"});
    respuesta.write(body);
    respuesta.end(); 
}

// Desplega formulario de registro
function registro(respuesta,data) {
    console.log("Manipulador de petición 'registro' ha sido llamado.");
    var body =  "<head>"+
        '<meta charset="UTF-8">'+
            "<title>REGISTRO</title>"+
        "</head>"+
        "<body>"+
            "<html>"+
                "<head>"+
                    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />'+
                "</head>"+
                "<body>"+
                    '<form action="/subirRegistro" method="post">'+
  '<input type="TEXT" name="nombre" placeholder="Nombre" size="40">'+
                            "<br>"+
  '<input type="TEXT" name="user" placeholder="Username" size="40">'+
                            "<br>"+
  '<input type="password" name="password" placeholder="Clave" size="40">'+
                                    "<br>"+
    '<input type="password" placeholder="PIN" name="pin" maxlength="4" size="4">'+
                                    "<br>"+
                                        '<input type="submit" value="ENVIAR" />'+
                                    "</form>"+
                                "</body>"+
                            "</html>"+
                        "</body>"+
                    '</html>';
    respuesta.writeHead(200, {"Content-Type": "text/html"});
    respuesta.write(body);
    respuesta.end(); 
}


// Desplega formulario de transferencia
function transferir(respuesta,data) {
    console.log("Manipulador de petición 'transferir' ha sido llamado.");
    var body =  "<head>"+
        '<meta charset="UTF-8">'+
            "<title>TRANSFERIR</title>"+
        "</head>"+
        "<body>"+
            "<html>"+
                "<head>"+
                    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />'+
                "</head>"+
                "<body>"+
                    '<form action="/subirTransferir" method="post">'+
    '<input type="TEXT" name="user1" placeholder="Username Depositante" size="40">'+
                            "<br>"+
    '<input type="TEXT" name="user2" placeholder="Username Destinatario" size="40">'+
                            "<br>"+ 
    '<input type="TEXT" name="monto" placeholder="Monto a Transferir" size="40">'+
                                    "<br>"+
    '<input type="TEXT" name="descripcion" placeholder="Descripcion" size="40">'+
                                    "<br>"+
    '<input type="password" placeholder="Clave" name="password" size="40">'+
                                    "<br>"+
    '<input type="password" placeholder="PIN" name="pin" maxlength="4" size="4">'+
                                    "<br>"+
                                        '<input type="submit" value="ENVIAR"/>'+
                                    "</form>"+
                                "</body>"+
                            "</html>"+
                        "</body>"+
                    '</html>';
    respuesta.writeHead(200, {"Content-Type": "text/html"});
    respuesta.write(body);
    respuesta.end(); 
}


// Procesa intento de registro
function subirRegistro(respuesta,data) {
    console.log("Manipulador de petición 'subir Registro' ha sido llamado.");
    var nombre = querystring.parse(data)["nombre"];
    var usuario = querystring.parse(data)["user"];
    var clave = querystring.parse(data)["password"];
    var pin  = parseInt(querystring.parse(data)["pin"],10);
    // Respuesta Web
    // respuesta.writeHead(200, {"Content-Type": "text/html"});
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(file);
    var insertar = "INSERT INTO Usuarios VALUES (?,?,?,?,?,?)";
    try {
        //Insertamos nuevo usuario con 1000 de saldo
        db.run(insertar,[null,nombre,usuario,clave,pin,1000],
            function(error){
                if (error){
                    console.log(error);
                    console.log("Error en Registro");
                    var msjError = "SQLITE_CONSTRAINT: UNIQUE constraint failed: Usuarios.user";
                    if (error.message == msjError) {
                        respuesta.write("Error: El Usuario ingresado ya existe" + "\n");    
                    }
                    else {
                        respuesta.write("Error en Registro"+ "\n");
                    }
                }
                else{
                    console.log("Registro Exitoso");
                    respuesta.write("Registro Exitoso" + "\n");
                    console.log("Insertado nuevo usuario " + usuario);
                    db.each("SELECT nombre,user,saldo  FROM Usuarios", 
                    function(err, row) {
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        console.log("Usuario: " + row.user + 
                                    " Nombre: " + row.nombre + 
                                    " Saldo: "  + row.saldo);
                    });
                }
                respuesta.write("Datos Ingresados \n");
                respuesta.write("Nombre: " + nombre + "\n");
                respuesta.write("Usuario: " + usuario + "\n");
                respuesta.write("Clave: "   + clave   + "\n");
                respuesta.end();
                db.close();
            });
    } catch (err) {
        // manejamos error
        console.log(err);        
        db.close();
    }
}


// Procesa intento de Login
function subirLogin(respuesta,data) {
    console.log("Manipulador de petición 'subirLogin' ha sido llamado.");
    var usuario = querystring.parse(data)["user"];
    var clave = querystring.parse(data)["password"];
    // Respuesta Web
    // respuesta.writeHead(200, {"Content-Type": "text/html"});
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(file);
    try {
        db.get("SELECT user,password,saldo  FROM Usuarios WHERE user =?",
        [usuario], 
        function(error, row) {
            if (error || row == undefined){ // Vemos si usuario existe
                console.log(error);
                console.log("Error en Login");
                respuesta.write("Error en Login"+ "\n");
            }
            else { // Si existe revisamos que su clave este correcta
                if (row.user == usuario && row.password == clave) {
                    console.log("Login Exitoso");
                    respuesta.write("Login Exitoso"+ "\n");
                    respuesta.write("Saldo de :"+ row.saldo + "\n"); 
                    respuesta.write(row.saldo + "\n");
                }
                else{
                    console.log("Error en Login");
                    respuesta.write("Error en Login"+ "\n");    
                }
            }
            respuesta.write("Datos Ingresados \n");
            respuesta.write("Usuario: " + usuario + "\n");
            respuesta.write("Clave: "   + clave   + "\n");
            respuesta.end();
            db.close();
        });
    } catch (err) {
        // manejamos error
        console.log(err);        
        db.close();
    }
}


// Procesa intento de Transferencia
function subirTransferir(respuesta,data) {
    console.log("Manipulador de petición 'subirTransferir' ha sido llamado.");
    var userFuente = querystring.parse(data)["user1"];
    var userDestino = querystring.parse(data)["user2"];
    var monto = parseInt(querystring.parse(data)["monto"],10);
    var pin  = parseInt(querystring.parse(data)["pin"],10);
    var clave = querystring.parse(data)["password"];
    var descripcion = querystring.parse(data)["descripcion"];
    var saldoFuente = 0;
    var saldoDestino = 0;
    // Vemos que usuarios no sean iguales
    if (userFuente == userDestino) {
        respuesta.write("Error: Un usuario no puede transferirse a si mismo")
        respuesta.end();
    }
    else if (monto <= 0) { // Revisamos si monto es negativo o 0
        respuesta.write("Error: Monto Transferencia debe ser positivo")
        respuesta.end();    
    }
    else { // Si son distintos seguimos
    // Respuesta Web
    // respuesta.writeHead(200, {"Content-Type": "text/html"});
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(file);
    try {
        db.get("SELECT user,password,saldo,pin  FROM Usuarios WHERE user =?",
        [userFuente], 
        function(error, row) { // Vemos si usuario fuente existe
            if (row != undefined) {
                saldoFuente = row.saldo;    // Si existe vemos su saldo
            }
            if (error || row == undefined){ // Si no existe damos error
                console.log(error);
                console.log("Error en Login");
                respuesta.write("Error: Problema en datos del usuario"+ "\n");
                respuesta.end();
                
            }
            else { // Si usuario fuente es valido, vemos si 
                   // clave y pin son correctos y saldo es suficiente
                if ((row.user == userFuente && row.password == clave) 
                    && (row.saldo  >= monto && row.pin == pin)) {
                    saldoFuente = row.saldo;
                    console.log("Login Exitoso");  
                    // Revisamos si usuario destino existe
                    db.get("SELECT user,saldo FROM Usuarios WHERE user =?",
                        [userDestino], 
                    function(error, row) {
                        if (error || row == undefined){
                            console.log(error);
                            console.log("Error usuario destino");
                            respuesta.write("Error: Usuario destino no existe"+ "\n");
                            respuesta.end();
                        }
                        else { // Los 2 usuarios existen realizamos 
                               // transferencia
                               console.log("Usuario Destino Existe");
                               saldoDestino  = row.saldo;
                               // Actualizamos saldos
                               saldoDestino = saldoDestino + monto;
                               saldoFuente = saldoFuente - monto;
                               var actualizar = "UPDATE Usuarios " + 
                                                 "SET saldo = ?" +
                                                 "WHERE user = ?";
                               console.log("Saldos son " + saldoFuente);
                               console.log("Saldos son " + saldoDestino);
                               //Actualizamos saldo fuente
                               db.run(actualizar,[saldoFuente,userFuente],
                               function(error){
                               if (error){
                                    console.log(error);
                                    console.log("Error transferencia fuente");
                                    respuesta.write("Error: Problemas con la transferencia"+ "\n");
                                    respuesta.end();
                                }
                                else{
                                    console.log("Saldo Fuente Actualizado");
                                    //Actualizamos saldo destino
                                    db.run(actualizar,[saldoDestino,userDestino],
                                    function(error){
                                        if (error){
                                            console.log(error);
                                            console.log("Error " +
                                                    "transferencia destino");
                                            respuesta.write("Error: Problemas con la transferencia"+ "\n");
                                            respuesta.end();
                                        }
                                        else{
                                            console.log("Saldo Destino "+ 
                                                                "Actualizado");
                                            // Si la transferencia se realizo
                                            // con exito actualizamos tabla
                                            // de transferencias
                                            var insertar = "INSERT INTO Transferencias VALUES (?,?,?,?,?,?)";
                                            var fecha = moment().format('MMMM D YYYY, h:mm:ss a');
                                            db.run(insertar,[null,userFuente,userDestino,monto,descripcion,fecha],
                                            function(error){
                                            if (error){
                                                console.log(error);
                                                console.log("Error " +
                                                    "registro transferencia");
                                                respuesta.write("Error: Problemas con la transferencia"+ "\n");
                                                respuesta.end();
                                                }
                                            else {
                                            console.log("Transferencia "+ 
                                                                "Registrada");
                                            respuesta.write("Transferencia Exitosa" + 
                                                            "\n");
                                            respuesta.write("Saldo despues de transferencia-" + 
                                                            saldoFuente.toString() + "\n");
                                            respuesta.end();
                                            }});
                                        }
                                    });
                                    
                                    
                                }
                            });
                    }});
                }
                else{
                    console.log("Error en Login");
                    if (monto > saldoFuente && saldoFuente > 0){
                        respuesta.write("Error: Saldo insuficiente"+ "\n");    
                    }
                    else {
                        respuesta.write("Error: PIN o clave incorrecta"+ "\n");
                    }
                    respuesta.end();
                }
            }
        });
    } catch (err) {
        // manejamos error
        console.log(err);
    }
    }
}



// Procesa intento de Lista Usuarios
function listaUsuarios(respuesta,data) {
    console.log("Manipulador de petición 'listaUsuarios' ha sido llamado.");
    // Respuesta Web
    // respuesta.writeHead(200, {"Content-Type": "text/html"});
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(file);
    var lista = "";
    try {
        db.each("SELECT nombre,user FROM Usuarios", 
                    function(err, row) {
                        if (err){
                            console.log(err);
                            respuesta.write("Error obteniendo usuarios"+"\n");
                            throw err;
                        }
                        else { 
                            lista = lista + row.user + "-" + row.nombre +"\n";
                            }
                    },function(err, num){
                        if (err){
                            console.log(err);
                            respuesta.write("Error obteniendo usuarios"+"\n");                            
                            respuesta.end();
                            throw err;
                        }              
                        console.log("Cantidad de Usuarios"+ num);
                        console.log(lista);
                        respuesta.write("Cantidad de Usuarios-"+ num.toString() 
                        +"\n");
                        respuesta.write(lista);            
                        respuesta.end();
                    });
    } catch (err) {
        // manejamos error
        console.log(err);
    }
}

function logo(respuesta) {
     var img = fs.readFileSync('./logo1.png');
     respuesta.writeHead(200, {'Content-Type': 'image/png' });
     respuesta.end(img, 'binary');
}

function favicon(respuesta) {
     var img = fs.readFileSync('./favicon.png');
     respuesta.writeHead(200, {'Content-Type': 'image/png' });
     respuesta.end(img, 'binary');
}

function balance(respuesta,data) {
    console.log("Manipulador de petición 'balance' ha sido llamado.");
    var body =  "<head>"+
        '<meta charset="UTF-8">'+
            "<title>BALANCE</title>"+
        "</head>"+
        "<body>"+
            "<html>"+
                "<head>"+
                    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />'+
                "</head>"+
       '<img src="/logo.png" alt="Logo USBCoin" style="width:218px;height:125px;">'+
                '<h1>Login UsbCoin</h1>'+
                "<body>"+
                    '<form action="/subirBalance" method="post">'+
    '<input type="TEXT" name="user" placeholder="Nombre de Usuario" size="40">'+
                            "<br>"+
    '<input type="password" name="password" placeholder="Clave" size="40">'+
                                    "<br>"+
                                        '<input type="submit" value="ENVIAR" />'+
                                "</body>"+
                            "</html>"+
                        "</body>"+
                    '</html>';
    
    
    respuesta.writeHead(200, {"Content-Type": "text/html"});
    respuesta.write(body);
    respuesta.end(); 

}


// Procesa intento de conseguir balance
function subirBalance(respuesta,data) {
    console.log("Manipulador de petición 'subirBalance' ha sido llamado.");
    var usuario = querystring.parse(data)["user"];
    var clave = querystring.parse(data)["password"];
    // Respuesta Web
    // respuesta.writeHead(200, {"Content-Type": "text/html"});
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(file);
    try {
        db.get("SELECT user,password,saldo  FROM Usuarios WHERE user =?",
        [usuario], 
        function(error, row) {
            if (error || row == undefined){ // Vemos si usuario existe
                console.log(error);
                console.log("Error en Login");
                respuesta.write("Error en Login"+ "\n");
                respuesta.end();
            }
            else { // Si existe revisamos que su clave este correcta
                if (row.user == usuario && row.password == clave) {
                    console.log("Login Exitoso");
                    respuesta.write("Login Exitoso"+ "\n");
                    respuesta.write("Saldo de -"+ row.saldo + "\n");
                    // Conseguimos balance
                    var lista = "";
                    db.each("SELECT * FROM " +
                    "Transferencias WHERE depositante=? or destino=?",[usuario,usuario], 
                    function(err, row) {
                        if (err){
                            console.log(err);
                            respuesta.write("Error obteniendo transferencias"+"\n");
                            throw err;
                        }
                        else { 
                            lista = lista + row.depositante + "-" + 
                                    row.destino  + "-" +
                                    row.monto  + "-" +
                                    row.descripcion  + "-" +
                                    row.fecha  +
                                    "\n";
                        }
                    },function(err, num){
                        if (err){
                            console.log(err);
                            respuesta.write("Error obteniendo usuarios"+"\n");                            
                            respuesta.end();
                            throw err;
                        }              
                        console.log("Cantidad de Transferencias"+ num);
                        console.log(lista);
                        respuesta.write("Cantidad de Transferencias-"+ num.toString() 
                        +"\n");
                        respuesta.write(lista);//dep-dest-monto-desc-fecha            
                        respuesta.end();
                    });
                    
                }
                else{
                    console.log("Error en Login");
                    respuesta.write("Error en Login"+ "\n"); 
                    respuesta.end();
                }
            }
        });
    } catch (err) {
        // manejamos error
        console.log(err);
    }
}






// Exportamos funciones
exports.login = login;
exports.subirLogin = subirLogin;
exports.registro = registro;
exports.subirRegistro = subirRegistro;
exports.transferir = transferir;
exports.subirTransferir = subirTransferir;
exports.listaUsuarios = listaUsuarios;
exports.favicon = favicon;
exports.logo = logo;
exports.subirBalance = subirBalance;
exports.balance = balance;