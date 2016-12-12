/**
 * basedatos.js:
 * ----------
 *    Inicio de base de datos SQLite. Crea una tabla de usuarios con
 * los siguientes campos:
 * 
 *  id:       Id se genera al ingresar usuario a la base de datos
 *  nombre:   Nombre del usuario
 *  user:     Nombre de identificacion del usuario (debe ser unico)
 *  password: Contraseña para la autenticacion del usuario
 *  saldo:    Saldo que tiene el usuario en su cuenta  
 * 
 * Seccion # 1
 * Redes de Computadoras I (CI-4835)
 * Universidad Simon Bolivar, 2016.
 */

var fs = require("fs");
var file = "usuarios.db";
var exists = fs.existsSync(file); // Vemos si no existe para crearla
var sqlite3 = require('sqlite3').verbose();


// Funcion inicia la base de datos
function iniciar(){
    if(!exists) {
        console.log("Creating DB file."); // Se crea si no existe
        fs.openSync(file, "w");
    }
    var db = new sqlite3.Database(file);

    db.serialize(function() {
    if(!exists) {
        // Se crea tabla
        db.run("CREATE TABLE IF NOT EXISTS Usuarios " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, " +
        "user TEXT UNIQUE NOT NULL, password TEXT NOT NULL, " +
        "pin INTEGER NOT NULL, saldo INTEGER NOT NULL)");
        
        db.run("CREATE TABLE IF NOT EXISTS Transferencias " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, depositante TEXT NOT NULL, " +
        "destino TEXT NOT NULL,monto INTEGER NOT NULL, " +
        " descripcion TEXT NOT NULL, fecha TEXT NOT NULL," +
        " FOREIGN KEY(depositante) REFERENCES usuarios(user),"+
        " FOREIGN KEY(destino) REFERENCES usuarios(user),"+ 
        " CHECK (NOT (depositante = destino)))");
  
        var insertar = "INSERT INTO Usuarios VALUES (?,?,?,?,?,?)";
        console.log("La tabla usuarios ha sido correctamente creada");
        try {
            //Insertamos 3 usuarios manualmente con 1000 de saldo
            db.run(insertar,[null,"Andres Guzman","andres","prueba123",
                    1234,1000],
                function(error){
                    if (error){
                     console.log(error);
                    }
                });
            db.run(insertar,[null,"Barbara Guzman","barbara","prueba123",
                    1234,1000],
                function(error){
                    if (error){
                        console.log(error);
                    }
                });
            db.run(insertar,[null,"Angela Guzman","angela","prueba123",
                    1234,1000],
                function(error){
                    if (error){
                        console.log(error);
                    }
                });
        } catch (err) {
        // manejamos error
            console.log(err);
        }
        }
        // Vemos lista de usuarios en la base de datos        
        console.log("Lista de Usuarios");
        db.each("SELECT nombre,user,saldo  FROM Usuarios", function(err, row) {
            console.log("Usuario: "+ row.user + " Nombre: " + row.nombre + 
                        " Saldo: " + row.saldo);
        });
    });

    db.close();
}



// Exportamos funciones
exports.iniciar = iniciar;
