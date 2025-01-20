/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
// eslint-disable-next-line no-undef
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

// eslint-disable-next-line no-undef
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://pablogalvil53:RiG4pxKOvlIU5UTF@cluster0.6xvae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    // eslint-disable-next-line no-undef
    process.exit(1); // Finaliza la aplicación si no se puede conectar
  }
}
run();

// Lista todos los coches
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await client
      .db("Cluster0")
      .collection("concesionarios")
      .find()
      .toArray();
    res.json(concesionarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener concesionarios", error });
  }
});

// Añadir un nuevo coche
app.post("/concesionarios", async (req, res) => {
  try {
    const { nombre, direccion, coches } = req.body;

    const cochesConIds = coches.map((coche) => ({
      _id: new ObjectId(), // Generar un ObjectId único para cada coche
      ...coche, // Mantener las propiedades del coche (modelo, cv, precio, etc.)
    }));

    const nuevoConcesionario = {
      nombre,
      direccion,
      coches: cochesConIds,
    };
    client
      .db("Cluster0")
      .collection("concesionarios")
      .insertOne(nuevoConcesionario);
    res.json({
      message: "Concesionario creado",
      concesionario: nuevoConcesionario,
    });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear concesionario", error });
  }
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId });
    if (concesionario) {
      res.json(concesionario);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener concesionario", error });
  }
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);

    const { nombre, direccion, coches } = req.body;
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { nombre, direccion, coches } }
      );

    if (!concesionario) {
      res.status(404).json({ message: "Concesionario no encontrado" });
    } else {
      res.json({
        message: "Concesionario actualizado",
        concesionario: concesionario,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al actualizar concesionario", error });
  }
});

// Borrar un concesionario
app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);

    const concesionarioBorrado = await client
      .db("Cluster0")
      .collection("concesionarios")
      .deleteOne({ _id: objectId });

    if (concesionarioBorrado.deletedCount == 0) {
      return res.status(404).json({ mensaje: "Concesionario no encontrado" });
    } else {
      res.json({ message: "Concesionario eliminado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar concesionario", error });
  }
});

// Obtener todos los coches de un concesionario
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const coches = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId }, { projection: { coches: 1 } });
    if (coches) {
      res.json(coches);
    } else {
      res.status(404).json({ message: "Coches no encontrados" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener coches", error });
  }
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const { modelo, cv, precio } = req.body;
    const nuevoCoche = { modelo, cv, precio };
    const { id } = req.params;
    const objectId = new ObjectId(id);
    client
      .db("Cluster0")
      .collection("concesionarios")
      .updateOne({ _id: objectId }, { $push: { coches: nuevoCoche } });
    res.json({
      message: "Concesionario creado",
      concesionario: nuevoCoche,
    });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear concesionario", error });
  }
});

// Obtener un coche por ID de un concesionario
app.get("/concesionarios/:id/coches/:idCoche", async (req, res) => {
  try {
    const { id, cocheId } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId }, { projection: { coches: 1 } });
    if (!concesionario) {
      return res.status(404).json({ mensaje: "Concesionario no encontrado" });
    }

    // Buscamos el coche específico dentro del array coches
    const coche = concesionario.coches.find(
      (c) => c._id && c._id.toString() === cocheId
    );

    // Verificar si se encontró el coche
    if (!coche) {
      return res.status(404).json({ mensaje: "Coche no encontrado" });
    }

    // Responder con el coche encontrado
    res.json(coche);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener coches", error });
  }
});

// Actualizar un coche por ID en un concesionario
app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const { id, cocheId } = req.params;
    const { modelo, cv, precio } = req.body;

    const objectId = new ObjectId(id); // Convertimos el id del concesionario en ObjectId

    // Buscar el concesionario
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId });

    // Verificar si el concesionario existe
    if (!concesionario) {
      return res.status(404).json({ mensaje: "Concesionario no encontrado" });
    }

    // Buscar el coche específico dentro del array coches
    const cocheIndex = concesionario.coches.findIndex(
      (c) => c._id && c._id.toString() === cocheId
    );

    // Verificar si se encontró el coche
    if (cocheIndex === -1) {
      return res.status(404).json({ mensaje: "Coche no encontrado" });
    }

    // Actualizar los datos del coche
    concesionario.coches[cocheIndex] = {
      ...concesionario.coches[cocheIndex], // Mantener los otros campos del coche
      modelo, // Actualizar el modelo
      cv, // Actualizar los caballos de fuerza
      precio, // Actualizar el precio
    };

    // Actualizar el concesionario en la base de datos
    await client
      .db("Cluster0")
      .collection("concesionarios")
      .updateOne(
        { _id: objectId }, // Filtrar por concesionario
        { $set: { coches: concesionario.coches } } // Actualizar el array de coches
      );

    // Responder con el coche actualizado
    res.json({
      message: "Coche actualizado",
      coche: concesionario.coches[cocheIndex],
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener coches", error });
  }
});

// Borrar un coche por ID en un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const { id, cocheId } = req.params;
    const objectId = new ObjectId(id); // Convertir el id del concesionario en ObjectId

    // Buscar el concesionario
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId });

    // Verificar si el concesionario existe
    if (!concesionario) {
      return res.status(404).json({ mensaje: "Concesionario no encontrado" });
    }

    // Buscar el índice del coche dentro del array coches
    const cocheIndex = concesionario.coches.findIndex(
      (c) => c._id && c._id.toString() === cocheId
    );

    // Verificar si se encontró el coche
    if (cocheIndex === -1) {
      return res.status(404).json({ mensaje: "Coche no encontrado" });
    }

    // Eliminar el coche del array
    concesionario.coches.splice(cocheIndex, 1);

    // Actualizar el concesionario en la base de datos
    await client
      .db("Cluster0")
      .collection("concesionarios")
      .updateOne(
        { _id: objectId }, // Filtrar por concesionario
        { $set: { coches: concesionario.coches } } // Actualizar el array de coches
      );

    // Responder con un mensaje de éxito
    res.json({
      message: "Coche eliminado",
      cocheId: cocheId,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar coche", error });
  }
});

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
