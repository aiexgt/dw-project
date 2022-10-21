"use strict";

const permiso = require("./permiso");
const regEx = require("./regEx");

const controller = {
  read: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "lectura");
      if (result.permiso == true) {
        const word = req.query.word;
        let query = "";
        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          if (word != "" && word != null && word != "undefined") {
            query = `WHERE c.nombre LIKE '%${word}%' OR
                    p.fecha = '${word}' OR
                    p.direccionEntrega LIKE '%${word}%' OR 
                    P.observacion LIKE '%${word}%'`;
          }
          conn.query(
            `
                        SELECT p.id, 
                        p.clienteId, CONCAT(c.nombre, ' ',c.primerApellido) AS clienteNombre,
                        p.fecha, p.direccionEntrega, 
                        p.tipoPagoId, tp.nombre AS tipoPagoNombre,
                        p.usuarioId, CONCAT(u.nombre, ' ',u.primerApellido) AS usuarioNombre,
                        p.estadoPedidoId, ep.nombre AS estadoPedidoNombre,
                        p.observacion
                        FROM pedido p
                        INNER JOIN cliente c ON c.id = p.clienteId
                        INNER JOIN tipoPago tp ON tp.id = tipoPagoId
                        INNER JOIN usuario u ON u.id = usuarioId
                        INNER JOIN estadoPedido ep ON ep.id = estadoPedidoId
                        ${query}
                        ORDER BY p.fecha DESC`,
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
            SELECT p.id, 
            p.clienteId, CONCAT(c.nombre, ' ',c.primerApellido) AS clienteNombre,
            p.fecha, p.direccionEntrega, 
            p.tipoPagoId, tp.nombre AS tipoPagoNombre,
            p.usuarioId, CONCAT(u.nombre, ' ',u.primerApellido) AS usuarioNombre,
            p.estadoPedidoId, ep.nombre AS estadoPedidoNombre,
            p.observacion
            FROM pedido p
            INNER JOIN cliente c ON c.id = p.clienteId
            INNER JOIN tipoPago tp ON tp.id = tipoPagoId
            INNER JOIN usuario u ON u.id = usuarioId
            INNER JOIN estadoPedido ep ON ep.id = estadoPedidoId
            WHERE p.id = ?`,
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
        const clienteId = req.body.clienteId;
        const direccion = req.body.direccion;
        const tipoPagoId = req.body.tipoPagoId;
        const observacion = req.body.observacion;
        let data = {
          fecha: new Date(),
          usuarioId: result.token.id,
          estadoPedidoId: 1,
        };

        if (
          regEx.numeros.test(clienteId) &&
          clienteId != "undefined" &&
          clienteId != null &&
          clienteId > 0
        ) {
          data.clienteId = clienteId;
        } else {
          return res.status(400).send({
            error: "El cliente no es válido",
          });
        }

        if (
          regEx.direccion.test(direccion) &&
          direccion != "undefined" &&
          direccion != null
        ) {
          data.direccionEntrega = direccion;
        } else {
          return res.status(400).send({
            error: "La direccion no es válido",
          });
        }

        if (
          regEx.numeros.test(tipoPagoId) &&
          tipoPagoId != "undefined" &&
          tipoPagoId != null &&
          tipoPagoId > 0
        ) {
          data.tipoPagoId = tipoPagoId;
        } else {
          return res.status(400).send({
            error: "El tipo de pago no es válido",
          });
        }

        if (observacion != "undefined" && observacion != null) {
          data.observacion = observacion;
        }

        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        INSERT INTO pedido SET ?`,
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

  update: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "editar");
      if (result.permiso == true) {
        const estado = req.body.estado;

        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        UPDATE pedido SET estadoPedidoId = ? WHERE id = ?`,
            [estado, req.params.id],
            (err, rows) => {
              if (err) {
                return res.status(500).send({
                  error: "Error interno",
                  err,
                });
              }
              return res.status(200).send({
                id: req.params.id,
                updatedAt: new Date(),
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
            `DELETE FROM pedido WHERE id = ?`,
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
