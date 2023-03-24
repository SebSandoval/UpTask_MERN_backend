import express from "express";
import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()
//autenticacion, registro y confirmacion de usuairos



router.post("/", registrar) // crea un nuevo usuario
router.post("/login", autenticar) // autenticar
router.get("/confirmar/:token", confirmar) // confirmar
router.post("/olvide-password", olvidePassword) // olvide contraseña
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)
router.get("/perfil", checkAuth, perfil) // confirmar




export default router