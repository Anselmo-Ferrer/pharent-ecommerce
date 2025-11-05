import { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

export const loginCliente = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    // Buscar cliente pelo email
    const cliente = await prisma.cLIENTE.findUnique({ 
      where: { email },
      select: {
        id_cliente: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        endereco: true,
        role: true,
        senha: true,
      },
    });

    if (!cliente) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    
    if (!senhaValida) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // Remover senha do objeto de resposta
    const { senha: _, ...clienteSemSenha } = cliente;

    // Aqui você poderia gerar um token JWT
    // const token = jwt.sign({ id: cliente.id_cliente }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retornar dados do cliente (sem a senha)
    res.json({ 
      message: "Login realizado com sucesso",
      cliente: clienteSemSenha,
      // token // Se implementar JWT
    });
  } catch (error) {
    console.error("Erro ao autenticar cliente:", error);
    res.status(500).json({ error: "Erro ao autenticar cliente" });
  }
};