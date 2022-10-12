'use strict'

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const permiso = require('./permiso');

const controller = {
    
    read: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'lectura');
            if(result.permiso == true){
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`
                        SELECT u.id, u.nombre, u.primerApellido, u.segundoApellido, 
                        u.usuario, u.correo, r.nombre AS rol, u.estado 
                        FROM usuario u
                        INNER JOIN rol r ON u.rolId = r.id
                        ORDER BY u.nombre ASC`, 
                    (err, rows)=>{
                        if(err) return res.status(500).send({
                            'error': 'Error interno',
                            err
                        })
                        return res.status(200).send({
                            'data': rows
                        })
                    })
                })
            }
            else{
                return res.status(403).send({
                    'error': 'Sin permisos'
                })
            }
        }catch(err){
            console.log(err);
            if(err) return res.status(500).send({
                'error': 'Error interno'
            })
        }
    },

    readOne: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'lectura');
            if(result.permiso == true){
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`
                        SELECT u.id, u.nombre, u.primerApellido, u.segundoApellido, 
                        u.usuario, u.correo, r.nombre AS rol, u.estado 
                        FROM usuario u
                        INNER JOIN rol r ON u.rolId = r.id
                        WHERE u.id = ?`, [req.params.id], 
                    (err, rows)=>{
                        if(err) return res.status(500).send({
                            'error': 'Error interno',
                            err
                        })
                        return res.status(200).send({
                            'data': rows
                        })
                    })
                })
            }
            else{
                return res.status(403).send({
                    'error': 'Sin permisos'
                })
            }
        }catch(err){
            console.log(err);
            if(err) return res.status(500).send({
                'error': 'Error interno'
            })
        }
    },

    search: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'lectura');
            if(result.permiso == true){
                const word = req.query.word;
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`
                        SELECT u.id, u.nombre, u.primerApellido, u.segundoApellido, 
                        u.usuario, u.correo, r.nombre AS rol, u.estado 
                        FROM usuario u
                        INNER JOIN rol r ON u.rolId = r.id
                        WHERE u.nombre LIKE '%${word}%' OR u.primerApellido LIKE '%${word}%'
                        OR u.segundoApellido LIKE '%${word}%' OR u.usuario LIKE '%${word}%'
                        OR u.correo LIKE '%${word}%'
                        ORDER BY u.nombre ASC`, 
                    (err, rows)=>{
                        if(err) return res.status(500).send({
                            'error': 'Error interno',
                            err
                        })
                        return res.status(200).send({
                            'data': rows
                        })
                    })
                })
            }
            else{
                return res.status(403).send({
                    'error': 'Sin permisos'
                })
            }
        }catch(err){
            console.log(err);
            if(err) return res.status(500).send({
                'error': 'Error interno'
            })
        }
    },

    add: (req, res) => {
        
    },

    update: (req, res) => {

    },

    remove: (req, res) => {

    },

    login: (req, res) => {
        try{
            if(req.body.usuario == null || req.body.usuario == ""){
                return res.status(400).send({
                    'error': 'No se ingreso usuario'
                })
            }
            else if(req.body.password == null || req.body.password == ""){
                return res.status(400).send({
                    'error': 'No se ingreso contraseña'
                })
            }
            else{
                const usuario = req.body.usuario;
                const password = req.body.password;
                req.getConnection((err,conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`SELECT id, nombre, usuario, password, rolId
                    FROM usuario WHERE usuario = ?`, [usuario],
                    (err, rows)=>{
                        if(err) return res.status(500).send({
                            'error': 'Error interno',
                            err
                        })
                        else if(rows == ''){
                            return res.status(400).send({
                                'error': 'No existe usuario'
                            })
                        }
                        let compare = bcrypt.compareSync(password, rows[0].password);
                        if(compare){
                            jwt.sign({
                                'id': rows[0].id,
                                'user': rows[0].usuario,
                                'nombre': rows[0].nombre,
                                'rol': rows[0].rolId
                            }, process.env.KEYJWT, {expiresIn: '100d'}, 
                            (err, token) => {
                                if(err) return res.status(500).send({
                                    'error': 'Error interno',
                                    err
                                })
                                return res.status(200).send({
                                    'token': token
                                })
                            })
                        }
                        else{
                            return res.status(400).send({
                                'error': 'Credenciales incorrectas'
                            })
                        }
                    })
                })
            }
        }catch(err){
            if(err) return res.status(500).send({
                'error': 'Error interno'
            })
        }
    }

}

module.exports = controller;