'use strict'

const controller = {
    
    read: (req, res) => {
        req.getConnection((err, conn)=>{
            if(err) return res.status(500).send({
                'error': 'Error en la conexión'
            });
            conn.query(`
                SELECT u.id, u.nombre, u.primerApellido, u.segundoApellido, 
                u.usuario, u.correo, r.nombre AS rol, u.estado 
                FROM usuario u
                INNER JOIN rol r ON u.rolId = r.id
                ORDER BY u.nombre ASC`, 
            (err, rows)=>{
                if(err) return res.status(500).send({
                    'error': 'Error en la base de datos',
                    err
                })
                return res.status(200).send({
                    'data': rows
                })
            })
        })
    },

    add: (req, res) => {

    }

}

module.exports = controller;