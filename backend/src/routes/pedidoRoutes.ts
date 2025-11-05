import { Router } from "express";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidoController";

const router = Router();

router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.post("/", createPedido);
router.put("/:id", updatePedido);
router.delete("/:id", deletePedido);

export default router;