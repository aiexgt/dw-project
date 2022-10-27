'use strict'

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const myconnection = require('express-myconnection');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuario');
const articuloRoutes = require('./routes/articulo');
const pedidoRoutes = require('./routes/pedido');
const detallePedidoRoutes = require('./routes/detallePedido');
const clienteRoutes = require('./routes/cliente');

const app = express();

const dbOptions = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
}

app.use(myconnection(mysql, dbOptions, 'single'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.set('trust proxy', true);


app.use('/usuario', usuarioRoutes);
app.use('/articulo', articuloRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/detallePedido', detallePedidoRoutes);
app.use('/cliente', clienteRoutes);

app.set('port', process.env.SERVERPORT);
app.listen(app.get('port'), ()=>{
    console.log("Server is ON on port ", app.get('port'));
});
