import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getAlertas = async (req: Request, res: Response) => {
  try {
    const alertas = await prisma.aLERTA_ESTOQUE.findMany({
      include: {
        produto: {
          select: {
            id_produto: true,
            nome: true,
            estoque: true,
            estoque_minimo: true,
          },
        },
      },
      orderBy: {
        data_alerta: "desc",
      },
    });
    res.json(alertas);
  } catch (error) {
    console.error("❌ Erro ao buscar alertas:", error);
    res.status(500).json({ error: "Erro ao buscar alertas" });
  }
};

export const getAlertasNaoVisualizados = async (req: Request, res: Response) => {
  try {
    const alertas = await prisma.aLERTA_ESTOQUE.findMany({
      where: {
        visualizado: false,
      },
      include: {
        produto: {
          select: {
            id_produto: true,
            nome: true,
            estoque: true,
            estoque_minimo: true,
          },
        },
      },
      orderBy: {
        data_alerta: "desc",
      },
    });
    res.json(alertas);
  } catch (error) {
    console.error("❌ Erro ao buscar alertas não visualizados:", error);
    res.status(500).json({ error: "Erro ao buscar alertas não visualizados" });
  }
};

export const marcarAlertaComoVisualizado = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const alerta = await prisma.aLERTA_ESTOQUE.update({
      where: { id_alerta: Number(id) },
      data: {
        visualizado: true,
      },
      include: {
        produto: true,
      },
    });
    res.json(alerta);
  } catch (error) {
    console.error("❌ Erro ao atualizar alerta:", error);
    res.status(500).json({ error: "Erro ao atualizar alerta" });
  }
};

export const marcarTodosAlertasComoVisualizados = async (req: Request, res: Response) => {
  try {
    const resultado = await prisma.aLERTA_ESTOQUE.updateMany({
      where: {
        visualizado: false,
      },
      data: {
        visualizado: true,
      },
    });
    res.json({
      message: `${resultado.count} alertas marcados como visualizados`,
      count: resultado.count,
    });
  } catch (error) {
    console.error("❌ Erro ao marcar alertas como visualizados:", error);
    res.status(500).json({ error: "Erro ao marcar alertas como visualizados" });
  }
};

export const deleteAlerta = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.aLERTA_ESTOQUE.delete({
      where: { id_alerta: Number(id) },
    });
    res.json({ message: "Alerta deletado com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar alerta:", error);
    res.status(500).json({ error: "Erro ao deletar alerta" });
  }
};

export const getAlertasPorProduto = async (req: Request, res: Response) => {
  const { id_produto } = req.params;
  try {
    const alertas = await prisma.aLERTA_ESTOQUE.findMany({
      where: {
        id_produto: Number(id_produto),
      },
      include: {
        produto: true,
      },
      orderBy: {
        data_alerta: "desc",
      },
    });
    res.json(alertas);
  } catch (error) {
    console.error("❌ Erro ao buscar alertas do produto:", error);
    res.status(500).json({ error: "Erro ao buscar alertas do produto" });
  }
};