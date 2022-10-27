"use strict";

const permiso = require("./permiso");
const regEx = require("./regEx");

const controller = {
  read: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "lectura");
      if (result.permiso == true) {
        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                SELECT * FROM cliente`,
            (err, rows) => {
              if (err)
                return res.status(500).send({
                  error: "Error interno",
                  err,
                });
              return res.status(200).send({
                data: rows,
              });
            }
          );
        });
      } else {
        return res.status(403).send({
          error: "Sin permisos",
        });
      }
    } catch (err) {
      console.log(err);
      if (err)
        return res.status(500).send({
          error: "Error interno",
        });
    }
  },

  readOne: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "lectura");
      if (result.permiso == true) {
        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
            SELECT * FROM cliente WHERE id = ?`,
            [req.params.id],
            (err, rows) => {
              if (err)
                return res.status(500).send({
                  error: "Error interno",
                  err,
                });
              return res.status(200).send({
                data: rows,
              });
            }
          );
        });
      } else {
        return res.status(403).send({
          error: "Sin permisos",
        });
      }
    } catch (err) {
      console.log(err);
      if (err)
        return res.status(500).send({
          error: "Error interno",
        });
    }
  },

  add: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "crear");
      if (result.permiso == true) {
        
        let data = {
        nombre : req.body.nombre || null,
        primerApellido : req.body.primerApellido || null,
        segundoApellido : req.body.segundoApellido || null,
        nit : req.body.nit || null,
        numeroPrincipal : req.body.numeroPrincipal || null,
        correo : req.body.correo || null,
        direccion : req.body.direccion || null}


        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        INSERT INTO cliente SET ?`,
            [data],
            (err, rows) => {
              if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                  return res.status(400).send({
                    error: "Ya existe código artículo",
                  });
                } else {
                  return res.status(500).send({
                    error: "Error interno",
                    err,
                  });
                }
              }
              return res.status(200).send({
                usuario: data.usuario,
                id: rows.insertId,
                createdAt: new Date(),
              });
            }
          );
        });
      } else {
        return res.status(403).send({
          error: "Sin permisos",
        });
      }
    } catch (err) {
      console.log(err);
      if (err)
        return res.status(500).send({
          error: "Error interno",
        });
    }
  },
}

module.exports = controller;
