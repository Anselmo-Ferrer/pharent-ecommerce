import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getPagamentos = async (req: Request, res: Response) => {
  try {
    const pagamentos = await prisma.pAGAMENTO.findMany();
    res.json(pagamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pagamentos" });
  }
};

export const createPagamento = async (req: Request, res: Response) => {
  const { id_pedido, valor_pago, forma_pagamento, status } = req.body;
  try {
    const pagamento = await prisma.pAGAMENTO.create({
      data: { id_pedido, valor_pago, forma_pagamento, status },
    });
    res.status(201).json(pagamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
};