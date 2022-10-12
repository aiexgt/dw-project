'use strict'

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const permiso = require('./permiso');
const { estado } = require('./regEx');
const regEx = require('./regEx');

const controller = {
    
    read: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'lectura');
            if(result.permiso == true){
                const word = req.query.word;
                let query = '';
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    if(word != '' && word != null && word != 'undefined'){
                        query = `WHERE u.nombre LIKE '%${word}%' OR u.primerApellido LIKE '%${word}%'
                        OR u.segundoApellido LIKE '%${word}%' OR u.usuario LIKE '%${word}%'
                        OR u.correo LIKE '%${word}%'`;
                    }
                    conn.query(`
                        SELECT u.id, u.nombre, u.primerApellido, u.segundoApellido, 
                        u.usuario, u.correo, r.nombre AS rol, u.estado 
                        FROM usuario u
                        INNER JOIN rol r ON u.rolId = r.id
                        ${query}
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

    add: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'crear');
            if(result.permiso == true){
                const nombre = req.body.nombre;
                const primerApellido = req.body.primerApellido;
                const segundoApellido = req.body.segundoApellido;
                const usuario = req.body.usuario;
                const password = req.body.password;
                const confPassword = req.body.confPassword;
                const correo = req.body.correo;
                const rolId = req.body.rolId;
                let data = {};

                if(regEx.nombre.test(nombre) && nombre != 'undefined' && nombre != null){
                    data.nombre = nombre;
                }else{
                    return res.status(400).send({
                        'error': 'Nombre no es válido'
                    })
                }

                if(regEx.apellido.test(primerApellido) && primerApellido != 'undefined' && primerApellido != null){
                    data.primerApellido = primerApellido;
                }else{
                    return res.status(400).send({
                        'error': 'Primer apellido no es válido'
                    })
                }

                if(regEx.apellido.test(segundoApellido)){
                    data.segundoApellido = segundoApellido;
                }else{
                    return res.status(400).send({
                        'error': 'Segundo apellido no es válido'
                    })
                }

                if(regEx.usuario.test(usuario) && usuario != 'undefined' && usuario != null){
                    data.usuario = usuario;
                }else{
                    return res.status(400).send({
                        'error': 'Usuario no es válido'
                    })
                }

                if(regEx.password.test(password) && password != 'undefined' && password != null){
                    if(password == confPassword){
                        data.password = await bcrypt.hash(password, 12);
                    }else{
                        return res.status(400).send({
                            'error': 'Las contraseñas no coinciden'
                        })
                    }
                }else{
                    return res.status(400).send({
                        'error': 'Contraseña no es segura'
                    })
                }

                if(regEx.correo.test(correo) && correo != 'undefined' && correo != null){
                    data.correo = correo;
                }else{
                    return res.status(400).send({
                        'error': 'Correo no es válido'
                    })
                }

                if(regEx.numeros.test(rolId) && rolId != 'undefined' && rolId != null && rolId > 0){
                    data.rolId = rolId;
                }else{
                    return res.status(400).send({
                        'error': 'El rol no es válido'
                    })
                }
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`
                        INSERT INTO usuario SET ?`, [data], 
                    (err, rows)=>{
                        if(err) {
                            if(err.code == 'ER_DUP_ENTRY'){
                                return res.status(400).send({
                                    'error': 'Ya existe usuario'
                                })
                            }
                            else{
                                return res.status(500).send({
                                    'error': 'Error interno',
                                    err
                                })
                            }
                        }
                        return res.status(200).send({
                            'usuario': data.usuario,
                            'id': rows.insertId,
                            'createdAt': new Date()
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

    update: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'editar');
            if(result.permiso == true){
                const nombre = req.body.nombre;
                const primerApellido = req.body.primerApellido;
                const segundoApellido = req.body.segundoApellido;
                const usuario = req.body.usuario;
                const password = req.body.password;
                const confPassword = req.body.confPassword;
                const correo = req.body.correo;
                const rolId = req.body.rolId;
                const estado = req.body.estado;
                let data = {};

                if(regEx.nombre.test(nombre) && nombre != 'undefined' && nombre != null){
                    data.nombre = nombre;
                }else{
                    return res.status(400).send({
                        'error': 'Nombre no es válido'
                    })
                }

                if(regEx.apellido.test(primerApellido) && primerApellido != 'undefined' && primerApellido != null){
                    data.primerApellido = primerApellido;
                }else{
                    return res.status(400).send({
                        'error': 'Primer apellido no es válido'
                    })
                }

                if(regEx.apellido.test(segundoApellido)){
                    data.segundoApellido = segundoApellido;
                }else{
                    return res.status(400).send({
                        'error': 'Segundo apellido no es válido'
                    })
                }

                if(regEx.usuario.test(usuario) && usuario != 'undefined' && usuario != null){
                    data.usuario = usuario;
                }else{
                    return res.status(400).send({
                        'error': 'Usuario no es válido'
                    })
                }

                if(password != 'undefined' && password != null && password != ''){
                    if(regEx.password.test(password)){
                        if(password == confPassword){
                            data.password = await bcrypt.hash(password, 12);
                        }else{
                            return res.status(400).send({
                                'error': 'Las contraseñas no coinciden'
                            })
                        }
                    }else{
                        return res.status(400).send({
                            'error': 'Contraseña no es segura'
                        })
                    }
                }

                if(regEx.correo.test(correo) && correo != 'undefined' && correo != null){
                    data.correo = correo;
                }else{
                    return res.status(400).send({
                        'error': 'Correo no es válido'
                    })
                }

                if(regEx.numeros.test(rolId) && rolId != 'undefined' && rolId != null && rolId > 0){
                    data.rolId = rolId;
                }else{
                    return res.status(400).send({
                        'error': 'El rol no es válido'
                    })
                }

                if(regEx.estado.test(estado) && estado != 'undefined' && estado != null){
                    data.estado = estado;
                }else{
                    return res.status(400).send({
                        'error': 'El estado no es válido'
                    })
                }

                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`
                        UPDATE usuario SET ? WHERE id = ?`, 
                        [data, req.params.id], 
                    (err, rows)=>{
                        if(err) {
                            if(err.code == 'ER_DUP_ENTRY'){
                                return res.status(400).send({
                                    'error': 'Ya existe usuario'
                                })
                            }
                            else{
                                return res.status(500).send({
                                    'error': 'Error interno',
                                    err
                                })
                            }
                        }
                        return res.status(200).send({
                            'usuario': data.usuario,
                            'id': req.params.id,
                            'updatedAt': new Date()
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
            if(err) return res.status(500).send({
                'error': 'Error interno'
            })
        }
    },

    remove: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'eliminar');
            if(result.permiso == true){
                req.getConnection((err, conn)=>{
                    if(err) return res.status(500).send({
                        'error': 'Error interno'
                    });
                    conn.query(`DELETE FROM usuario WHERE id = ?`, 
                    [req.params.id], 
                        (err) =>{
                            if(err) return res.status(500).send({
                                'error': 'Error interno',
                                err
                            });
                            else{
                                return res.status(204).send();
                            }
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