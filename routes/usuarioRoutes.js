import express from "express";
import UsuarioController from "../controller/usuarioController.js";

const router = express.Router();

router.get("/", UsuarioController.getUsuarios);
router.get("/:cpf", UsuarioController.getUsuarioById);
router.post("/", UsuarioController.createUsuario);
router.put("/:cpf", UsuarioController.updateUsuario);
router.delete("/:cpf", UsuarioController.deleteUsuario);

router.post("/votar", UsuarioController.createVoto);
router.get("/verificar/:cpf", UsuarioController.verificarVoto);

export default router;