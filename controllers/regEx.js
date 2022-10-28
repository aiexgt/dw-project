"use strict";

const regEx = {

    nombre: new RegExp("^[A-Z ñáéíóúü]{1,100}$", "i"),
    nombreA: new RegExp("^[A-Z0-9 .-/ñáéíóúü]{1,100}$", "i"),
    apellido: new RegExp("^[A-Z ñáéíóúü]{1,50}$", "i"),
    usuario: new RegExp("^[A-Z]{5,50}$", "i"),
    password: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,30}$"),
    correo: new RegExp("^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$"),
    numeros: new RegExp("^[0-9 ]+$"),
    estado: new RegExp("^[01]{1,1}$"),
    codigo: new RegExp("^[A-Z-]{1,18}$"),
    monto: new RegExp("^[0-9.]+$"),
    direccion: new RegExp("^[A-Z0-9 ñáéíóúü]{1,300}$", "i"),

}

module.exports = regEx