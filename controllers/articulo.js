"use strict";

const permiso = require("./permiso");
const regEx = require("./regEx");

const controller = {
  read: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "lectura");
      if (result.permiso == true) {
        const categoria = req.query.categoria;
        let query = "";
        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          if (categoria != "" && categoria != null && categoria != "undefined") {
            query = `WHERE a.categoriaId = ${categoria}`;
          }
          conn.query(
            `
                        SELECT a.id, ta.nombre AS tipoArticulo,
                        a.codigo, a.nombre, a.descripcion, a.stock,
                        c.nombre AS categoria, a.stock
                        FROM articulo a
                        INNER JOIN tipoArticulo ta ON ta.id = a.tipoArticuloId
                        INNER JOIN categoria c ON c.id = a.categoriaId
                        ${query}
                        ORDER BY a.nombre ASC`,
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
            SELECT a.id, ta.nombre AS tipoArticulo,
            a.codigo, a.nombre, a.descripcion, a.stock,
            c.nombre AS categoria, a.stock
            FROM articulo a
            INNER JOIN tipoArticulo ta ON ta.id = a.tipoArticuloId
            INNER JOIN categoria c ON c.id = a.categoriaId
            WHERE a.id = ?`,
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
        const tipoArticuloId = req.body.tipoArticuloId;
        const codigo = req.body.codigo;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const precio = req.body.precio;
        const categoriaId = req.body.categoriaId;
        const stock = req.body.stock;
        let data = {};

        if (
          regEx.numeros.test(tipoArticuloId) &&
          tipoArticuloId != "undefined" &&
          tipoArticuloId != null &&
          tipoArticuloId > 0
        ) {
          data.tipoArticuloId = tipoArticuloId;
        } else {
          return res.status(400).send({
            error: "El tipo articulo no es válido",
          });
        }

        if (
          regEx.codigo.test(codigo) &&
          codigo != "undefined" &&
          codigo != null
        ) {
          data.codigo = codigo;
        } else {
          return res.status(400).send({
            error: "El codigo no es válido",
          });
        }

        if (
          regEx.nombreA.test(nombre) &&
          nombre != "undefined" &&
          nombre != null
        ) {
          data.nombre = nombre;
        } else {
          return res.status(400).send({
            error: "Nombre no es válido",
          });
        }

        if (descripcion != "undefined" && descripcion != null) {
          data.descripcion = descripcion;
        }

        if (
          regEx.monto.test(precio) &&
          precio != "undefined" &&
          precio != null
        ) {
          data.precio = precio;
        } else {
          return res.status(400).send({
            error: "Precio no es válido",
          });
        }

        if (
          regEx.numeros.test(categoriaId) &&
          categoriaId != "undefined" &&
          categoriaId != null &&
          categoriaId > 0
        ) {
          data.categoriaId = categoriaId;
        } else {
          return res.status(400).send({
            error: "La categoria no es válido",
          });
        }

        if (regEx.monto.test(stock) && stock != "undefined" && stock != null) {
          data.stock = stock;
        } else {
          return res.status(400).send({
            error: "Stock no es válido",
          });
        }

        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        INSERT INTO articulo SET ?`,
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

  update: async (req, res) => {
    try {
      const result = await permiso.checkPermiso(req, "editar");
      if (result.permiso == true) {
        const tipoArticuloId = req.body.tipoArticuloId;
        const codigo = req.body.codigo;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const precio = req.body.precio;
        const categoriaId = req.body.categoriaId;
        const stock = req.body.stock;
        let data = {};

        console.log(nombre);

        if (
          regEx.numeros.test(tipoArticuloId) &&
          tipoArticuloId != "undefined" &&
          tipoArticuloId != null &&
          tipoArticuloId > 0
        ) {
          data.tipoArticuloId = tipoArticuloId;
        } else {
          return res.status(400).send({
            error: "El tipo articulo no es válido",
          });
        }

        if (
          regEx.codigo.test(codigo) &&
          codigo != "undefined" &&
          codigo != null
        ) {
          data.codigo = codigo;
        } else {
          return res.status(400).send({
            error: "El codigo no es válido",
          });
        }

        if (
          regEx.nombreA.test(nombre) &&
          nombre != "undefined" &&
          nombre != null
        ) {
          data.nombre = nombre;
        } else {
          return res.status(400).send({
            error: "Nombre no es válido",
          });
        }

        if (descripcion != "undefined" && descripcion != null) {
          data.descripcion = descripcion;
        }

        if (
          regEx.monto.test(precio) &&
          precio != "undefined" &&
          precio != null
        ) {
          data.precio = precio;
        } else {
          return res.status(400).send({
            error: "Precio no es válido",
          });
        }

        if (
          regEx.numeros.test(categoriaId) &&
          categoriaId != "undefined" &&
          categoriaId != null &&
          categoriaId > 0
        ) {
          data.categoriaId = categoriaId;
        } else {
          return res.status(400).send({
            error: "La categoria no es válido",
          });
        }

        if (regEx.monto.test(stock) && stock != "undefined" && stock != null) {
          data.stock = stock;
        } else {
          return res.status(400).send({
            error: "Stock no es válido",
          });
        }


        req.getConnection((err, conn) => {
          if (err)
            return res.status(500).send({
              error: "Error interno",
            });
          conn.query(
            `
                        UPDATE articulo SET ? WHERE id = ?`,
            [data, req.params.id],
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
            `DELETE FROM articulo WHERE id = ?`,
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

  readCategoria: async (req, res) => {
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
                SELECT * FROM categoria`,
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
  }
};

module.exports = controller;
