import { Router } from "express";
import { loginCliente } from "../controllers/loginController";

const router = Router();

router.post("/", loginCliente);

export default router;