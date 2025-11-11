import { Router } from "express";
import {
  getAlertas,
  getAlertasNaoVisualizados,
  marcarAlertaComoVisualizado,
  marcarTodosAlertasComoVisualizados,
  deleteAlerta,
  getAlertasPorProduto,
} from "../controllers/alertaEstoqueController";

const router = Router();

router.get("/", getAlertas);
router.get("/nao-visualizados", getAlertasNaoVisualizados);
router.patch("/:id/visualizar", marcarAlertaComoVisualizado);
router.patch("/visualizar-todos", marcarTodosAlertasComoVisualizados);
router.delete("/:id", deleteAlerta);
router.get("/produto/:id_produto", getAlertasPorProduto);

export default router;