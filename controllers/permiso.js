'use strict'

const jwt = require('jsonwebtoken');
require('dotenv').config();

const getToken = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token, process.env.KEYJWT, (err, data) => {
            if(err){
                reject(false);
            }else{
                resolve(data);
            }
        })
    })  
};

const getPermiso = (req, tipo, rol) => {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if(err) reject (false);
            conn.query(`SELECT id FROM rol WHERE id = ? AND ? = 1`,
            [rol, tipo],
            (err, rows) => {
                if(err){
                    reject(false);
                }
                else if( rows == ''){
                    reject(false);
                }
                else if(rows[0].id > 0){
                    resolve(true);
                }
            })
        })
    })
}

const checkPermiso = async (req, tipo) => {
    try{
        const bearerHeader = req.headers['authorization'];
        if(bearerHeader != 'undefined' && bearerHeader != null && bearerHeader != ''){
            const bearerToken = bearerHeader.split(' ')[1];
            const token = await getToken(bearerToken);
            const permiso = await getPermiso(req, tipo, token.rolId );
            return {
                permiso,
                token
            }
        }else{
            return ({
                'permiso': false
            })
        }
        
    }catch (err){
        return ({
            'permiso': false
        })
    }
}

module.exports = { checkPermiso };