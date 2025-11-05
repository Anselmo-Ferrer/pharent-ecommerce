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

// Buscar todos os alertas
router.get("/", getAlertas);

// Buscar apenas alertas não visualizados
router.get("/nao-visualizados", getAlertasNaoVisualizados);

// Marcar um alerta específico como visualizado
router.patch("/:id/visualizar", marcarAlertaComoVisualizado);

// Marcar todos os alertas como visualizados
router.patch("/visualizar-todos", marcarTodosAlertasComoVisualizados);

// Deletar um alerta
router.delete("/:id", deleteAlerta);

// Buscar alertas de um produto específico
router.get("/produto/:id_produto", getAlertasPorProduto);

export default router;