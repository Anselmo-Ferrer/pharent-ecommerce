import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.cATEGORIA.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

export const getCategoriaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.cATEGORIA.findUnique({ where: { id_categoria: Number(id) } });
    if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

const generateSlug = (nome: string) =>
  nome.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export const createCategoria = async (req: Request, res: Response) => {
  const { nome, descricao } = req.body;
  try {
    const slug = generateSlug(nome);
    const novaCategoria = await prisma.cATEGORIA.create({
      data: { nome, slug, descricao },
    });
    res.status(201).json(novaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

export const updateCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const categoriaAtualizada = await prisma.cATEGORIA.update({
      where: { id_categoria: Number(id) },
      data: { nome, descricao },
    });
    res.json(categoriaAtualizada);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

export const deleteCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.cATEGORIA.delete({ where: { id_categoria: Number(id) } });
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
};