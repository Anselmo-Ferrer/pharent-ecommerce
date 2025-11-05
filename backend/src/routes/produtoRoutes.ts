import { Router } from "express";
import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosByCategoria,
} from "../controllers/produtoController";

const router = Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoById);
router.get("/categoria/:id_categoria", getProdutosByCategoria);
router.post("/", createProduto);
router.put("/:id", updateProduto);
router.delete("/:id", deleteProduto);

export default router;