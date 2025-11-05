import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getItensPedido = async (req: Request, res: Response) => {
  try {
    const itens = await prisma.iTEM_PEDIDO.findMany();
    res.json(itens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar itens de pedido" });
  }
};

export const createItemPedido = async (req: Request, res: Response) => {
  const { id_pedido, id_produto, quantidade, preco_unitario, subtotal } = req.body;
  try {
    const novoItem = await prisma.iTEM_PEDIDO.create({
      data: { id_pedido, id_produto, quantidade, preco_unitario, subtotal },
    });
    res.status(201).json(novoItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item de pedido" });
  }
};