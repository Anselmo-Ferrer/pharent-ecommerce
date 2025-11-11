import { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cLIENTE.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cLIENTE.findUnique({ where: { id_cliente: Number(id) } });
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  const { nome, cpf, email, telefone, endereco, senha, role } = req.body;

  try {
    // verifica CPF existente
    const CpfExistente = await prisma.cLIENTE.findUnique({ where: { cpf } });
    if (CpfExistente) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    const EmailExistente = await prisma.cLIENTE.findUnique({ where: { email } });
    if (EmailExistente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const cpfLimpo = cpf.replace(/\D/g, ""); // remove tudo que não for número
    const telefoneLimpo = telefone.replace(/\D/g, "");

    const hashSenha = await bcrypt.hash(senha, 10);

    const novoCliente = await prisma.cLIENTE.create({
      data: {
        nome,
        cpf: cpfLimpo,
        email,
        telefone: telefoneLimpo,
        endereco,
        senha: hashSenha,
        role: 'customer'
      },
    });
    return res.status(201).json(novoCliente);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "CPF ou email duplicado" });
    }
    return res.status(500).json({ error: "Erro ao criar cliente" });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, cpf, email, telefone, endereco } = req.body;
  try {
    const clienteAtualizado = await prisma.cLIENTE.update({
      where: { id_cliente: Number(id) },
      data: { nome, cpf, email, telefone, endereco },
    });
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.cLIENTE.delete({ where: { id_cliente: Number(id) } });
    res.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar cliente" });
  }
};

export const updateSenha = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ error: "A nova senha deve ter no mínimo 6 caracteres" });
  }

  try {
    // Buscar cliente
    const cliente = await prisma.cLIENTE.findUnique({
      where: { id_cliente: Number(id) },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, cliente.senha);
    
    if (!senhaValida) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    // Hashear nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await prisma.cLIENTE.update({
      where: { id_cliente: Number(id) },
      data: { senha: novaSenhaHash },
    });

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ error: "Erro ao alterar senha" });
  }
};