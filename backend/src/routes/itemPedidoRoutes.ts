import { Router } from "express";
import {
  getItensPedido,
  createItemPedido,
} from "../controllers/itemPedidoController";

const router = Router();

router.get("/", getItensPedido);
router.post("/", createItemPedido);

export default router;