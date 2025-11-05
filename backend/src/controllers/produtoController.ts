import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getProdutos = async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.pRODUTO.findMany({
      include: { categoria: true, fornecedor: true },
    });
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};

export const getProdutoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const produto = await prisma.pRODUTO.findUnique({
      where: { id_produto: Number(id) },
      include: { categoria: true, fornecedor: true },
    });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

export const createProduto = async (req: Request, res: Response) => {
  const { nome, descricao, preco, estoque, estoque_minimo, id_fornecedor, id_categoria } = req.body;

  if (!id_categoria || !id_fornecedor) {
    return res.status(400).json({ error: "Categoria ou fornecedor inválido" });
  }

  try {
    const novoProduto = await prisma.pRODUTO.create({
      data: {
        nome,
        descricao,
        preco,
        estoque,
        estoque_minimo,
        id_categoria,
        id_fornecedor,
      },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

export const updateProduto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, estoque_minimo, id_fornecedor, id_categoria } = req.body;

  if (!id_categoria || !id_fornecedor) {
    return res.status(400).json({ error: "Categoria ou fornecedor inválido" });
  }

  try {
    const produtoAtualizado = await prisma.pRODUTO.update({
      where: { id_produto: Number(id) },
      data: {
        nome,
        descricao,
        preco,
        estoque,
        estoque_minimo,
        id_categoria,
        id_fornecedor,
      },
    });
    res.json(produtoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

export const deleteProduto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.pRODUTO.delete({ where: { id_produto: Number(id) } });
    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
};

export const getProdutosByCategoria = async (req: Request, res: Response) => {
  const { id_categoria } = req.params;

  if (!id_categoria) {
    return res.status(400).json({ error: "ID da categoria é obrigatório" });
  }

  try {
    const produtos = await prisma.pRODUTO.findMany({
      where: { id_categoria: Number(id_categoria) },
      include: { categoria: true, fornecedor: true },
    });

    if (produtos.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado para essa categoria" });
    }

    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos por categoria" });
  }
};