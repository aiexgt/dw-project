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
                        SELECT dp.id, 
                        dp.articuloId, a.codigo AS articuloCodigo,
                        a.nombre AS articuloNombre, dp.cantidad
                        FROM detallePedido dp
                        INNER JOIN articulo a ON a.id = dp.articuloId
                        WHERE pedidoId = ?
                        ORDER BY dp.id ASC`,
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
        const pedidoId = req.body.pedidoId;
        const articuloId = req.body.articuloId;
        const cantidad = req.body.cantidad;
        let data = {};

        if (
          regEx.numeros.test(pedidoId) &&
          pedidoId != "undefined" &&
          pedidoId != null &&
          pedidoId > 0
        ) {
          data.pedidoId = pedidoId;
        } else {
          return res.status(400).send({
            error: "El pedido no es válido",
          });
        }

        if (
          regEx.numeros.test(articuloId) &&
          articuloId != "undefined" &&
          articuloId != null &&
          articuloId > 0
        ) {
          data.articuloId = articuloId;
        } else {
          return res.status(400).send({
            error: "El articulo no es válido",
          });
        }

        if (
          regEx.numeros.test(cantidad) &&
          cantidad != "undefined" &&
          cantidad != null &&
          cantidad > 0
        ) {
          data.cantidad = cantidad;
        } else {
          return res.status(400).send({
            error: "La cantidad no es válida",
          });
        }

        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        INSERT INTO detallePedido SET ?`,
            [data],
            (err, rows) => {
              if (err) {
                return res.status(500).send({
                  error: "Error interno",
                  err,
                });
              }
              return res.status(200).send({
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

  remove: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "eliminar");
      if (result.permiso == true) {
        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `DELETE FROM detallePedido WHERE id = ?`,
            [req.params.id],
            (err) => {
              if (err)
                return res.status(500).send({
                  error: "Error interno",
                  err,
                });
              else {
                return res.status(204).send();
              }
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
};

module.exports = controller;
