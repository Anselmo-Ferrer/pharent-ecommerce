// src/controllers/fornecedorController.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";

// Listar fornecedores com contagem de produtos
export const getFornecedores = async (req: Request, res: Response) => {
  try {
    const fornecedores = await prisma.fORNECEDOR.findMany({
      include: { produtos: true }, // inclui produtos
    });
    res.json(fornecedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
};

export const getFornecedorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const fornecedor = await prisma.fORNECEDOR.findUnique({
      where: { id_fornecedor: Number(id) },
      include: { produtos: true },
    });
    if (!fornecedor) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar fornecedor" });
  }
};

export const createFornecedor = async (req: Request, res: Response) => {
  const { nome, cnpj, telefone, email } = req.body;
  try {
    const cleanCnpj = cnpj.replace(/\D/g, "");
    const novoFornecedor = await prisma.fORNECEDOR.create({
      data: { nome, cnpj: cleanCnpj, telefone, email },
    });
    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
};

export const updateFornecedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, cnpj, telefone, email } = req.body;
  try {
    const cleanCnpj = cnpj.replace(/\D/g, "");
    const fornecedorAtualizado = await prisma.fORNECEDOR.update({
      where: { id_fornecedor: Number(id) },
      data: { nome, cnpj: cleanCnpj, telefone, email },
    });
    res.json(fornecedorAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
};

export const deleteFornecedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.fORNECEDOR.delete({ where: { id_fornecedor: Number(id) } });
    res.json({ message: "Fornecedor deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar fornecedor" });
  }
};