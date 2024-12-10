/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario A",
    direccion: "Calle 123",
    coches: [
      { id: 1, modelo: "Clio", cv: 90, precio: 12000 },
      { id: 2, modelo: "Skyline R34", cv: 280, precio: 35000 },
    ],
  },
  {
    id: 2,
    nombre: "Concesionario B",
    direccion: "Calle 321",
    coches: [
      { id: 1, modelo: "Clio", cv: 90, precio: 12000 },
      { id: 2, modelo: "Skyline R34", cv: 280, precio: 35000 },
    ],
  },
];

// Lista todos los coches
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Añadir un nuevo coche
app.post("/concesionarios", (req, res) => {
  const nuevoConcesionario = { ...req.body, coches: [] };
  concesionarios.push(nuevoConcesionario);
  res.json({
    message: "Concesionario creado",
    concesionario: nuevoConcesionario,
  });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", (req, res) => {
  const index = concesionarios.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (index !== -1) {
    concesionarios[index] = { ...concesionarios[index], ...req.body };
    res.json({
      message: "Concesionario actualizado",
      concesionario: concesionarios[index],
    });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borrar un concesionario
app.delete("/concesionarios/:id", (req, res) => {
  concesionarios = concesionarios.filter(
    (c) => c.id !== parseInt(req.params.id)
  );
  res.json({ message: "Concesionario eliminado" });
});

// Obtener todos los coches de un concesionario
app.get("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    res.json(concesionario.coches);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    const nuevoCoche = { id: Date.now(), ...req.body };
    concesionario.coches.push(nuevoCoche);
    res.json({ message: "Coche añadido", coche: nuevoCoche });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener un coche por ID de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    const coche = concesionario.coches.find(
      (c) => c.id === parseInt(req.params.cocheId)
    );
    if (coche) {
      res.json(coche);
    } else {
      res.status(404).json({ message: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un coche por ID en un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    const cocheIndex = concesionario.coches.findIndex(
      (c) => c.id === parseInt(req.params.cocheId)
    );
    if (cocheIndex !== -1) {
      concesionario.coches[cocheIndex] = {
        ...concesionario.coches[cocheIndex],
        ...req.body,
      };
      res.json({
        message: "Coche actualizado",
        coche: concesionario.coches[cocheIndex],
      });
    } else {
      res.status(404).json({ message: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borrar un coche por ID en un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (concesionario) {
    concesionario.coches = concesionario.coches.filter(
      (c) => c.id !== parseInt(req.params.cocheId)
    );
    res.json({ message: "Coche eliminado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});
