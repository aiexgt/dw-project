"use strict";

const regEx = {

    nombre: new RegExp("^[A-Z ñáéíóúü]{5,100}$", "i"),
    apellido: new RegExp("^[A-Z ñáéíóúü]{5,50}$", "i"),
    usuario: new RegExp("^[A-Z]{5,50}$", "i"),
    password: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"),
    correo: new RegExp("^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$"),
    numeros: new RegExp("^[0-9]+$"),
    estado: new RegExp("^[01]{1,1}$"),

}

module.exports = regEx