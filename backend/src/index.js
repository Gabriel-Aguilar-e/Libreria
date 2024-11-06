const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//Midleware
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI;

try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch (error) {
    console.error("Error de conexión", error);
}

const libroSchema = new mongoose.Schema({
    titulo: String,
    autor : String,
});

const Libro = mongoose.model("Libro", libroSchema);

//Rutas de la API

// Traer el listado de todos los libros

app.get("/libros", async (req, res) => {
    try {
        const libros = await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).send("Error al traer los libros")
    }
});

//Token

app.use((req, res, next)=>{
    const authToken = req.headers["authorization"]
    if (authToken === "miTokenSecreto123"){
        next();
    } else {
        res.status(401).send("Acceso no autorizado")
    }
});

//Crear un nuevo libro

app.post("/libros", async(req, res) => {
    const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor    
    });

    try {
        await libro.save();
        res.json(libro);
    } catch (error) {
        res.status(500).send("Error al guardar el libro");
    }
});

//Traer un libro por id

app.get ("/libros/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const libro =await Libro.findById(id);

        if (libro){
            res.json(libro);
        } else {
            res.status(404).send("Libro no encontrado");
        }
    } catch (error) {
        res.status(505).send("Error al buscar el libro")
    }
});

//Ruta para actualizar un libro findByIdUpdate

app.put("/libros/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const libro = await Libro.findByIdAndUpdate(
        id,
        { titulo: req.body.titulo, autor: req.body.autor },
        { new: true }
      );
      if (libro) {
        res.json(libro);
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al actualizar el libro");
    }
  });

  //Ruta para eliminar un libro

app.delete("/libros/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await Libro.findByIdAndDelete(id);
    if (libro) {
      res.json({ message: "Libro eliminado con éxito", libro });
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el libro");
  }
});

  



app.listen(3000, () => {
    console.log("Servidor ejecutandose en http://localhost:3000");
  });