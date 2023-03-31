import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

//se monta el servidor
const app = express()
app.use(express.json())

//para llamar las variables de entorno
dotenv.config()
conectarDB()

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API

      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};


app.use(cors({ origin: process.env.FRONTEND_URL }))
//routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)




//puerto en el que corre el servidor
const PORT = process.env.PORT || 4000
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})



// socket io

import { Server, Socket } from 'socket.io'

const io = new Server(servidor, {

  pingTimeout: 6000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', (socket) => {

  socket.on('abrir proyecto', (proyecto) => {
    socket.join(proyecto);
  })

  socket.on('nueva tarea', (tarea) => {
    socket.to(tarea.proyecto).emit('tarea agregada', tarea)
  })
  socket.on('eliminar tarea', (tarea) => {
    socket.to(tarea.proyecto).emit('tarea eliminada', tarea)
  })

  socket.on('actualizar tarea', (tarea) => {
    socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea)
  })
  socket.on('cambiar estado', (tarea) => {
    socket.to(tarea.proyecto._id).emit('nuevo estado', tarea)
  })
})

















/* juansesdvsf
mnI8GEMdnCP1pbXP */