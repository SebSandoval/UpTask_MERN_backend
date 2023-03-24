import express from "express";
import checkAuth from "../middleware/checkAuth.js";

import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}
    from "../controllers/tareasController.js";

const router = express.Router()


router.post("/",checkAuth, agregarTarea) // crea un nuevo usuario
router
    .route("/:id")
    .get(checkAuth,obtenerTarea)
    .put(checkAuth,actualizarTarea)
    .delete(checkAuth,eliminarTarea)

router.post("/estado/:id", checkAuth,cambiarEstado) // autenticar


export default router