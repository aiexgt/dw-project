'use strict'

const permiso = require('./permiso');

const controller = {
    
    read: async (req, res) => {
        try{
            const result = await permiso.checkPermiso(req, 'read');
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
            if(err) return res.status(500).send({
                'error': 'Error interno',
                err
            })
        }
    },

    readOne: (req, res) => {

    },

    add: (req, res) => {

    },

    update: (req, res) => {

    },

    remove: (req, res) => {

    },

    login: (req, res) => {

    }

}

module.exports = controller;