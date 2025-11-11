import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pEDIDO.findMany({
      include: {
        itens: true,
        cliente: true,
        pagamento: true,
      },
    });
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

export const getPedidoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pedido = await prisma.pEDIDO.findUnique({
      where: { id_pedido: Number(id) },
      include: {
        itens: true,
        cliente: true,
        pagamento: true,
      },
    });
    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
};

export const createPedido = async (req: Request, res: Response) => {
  const { id_cliente, items, valor_total, forma_pagamento } = req.body;

  console.log("📥 Recebendo pedido:", { id_cliente, items, valor_total, forma_pagamento });

  try {
    if (!id_cliente) {
      return res.status(400).json({ error: "ID do cliente é obrigatório" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Lista de itens inválida ou vazia" });
    }

    if (!valor_total || valor_total <= 0) {
      return res.status(400).json({ error: "Valor total inválido" });
    }

    if (!forma_pagamento) {
      return res.status(400).json({ error: "Forma de pagamento é obrigatória" });
    }

    const cliente = await prisma.cLIENTE.findUnique({
      where: { id_cliente: Number(id_cliente) },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ 
          error: "Dados do item inválidos. Cada item deve ter productId e quantity" 
        });
      }

      const produto = await prisma.pRODUTO.findUnique({
        where: { id_produto: Number(item.productId) },
      });

      if (!produto) {
        return res.status(404).json({ 
          error: `Produto com ID ${item.productId} não encontrado` 
        });
      }

      if (produto.estoque < item.quantity) {
        return res.status(400).json({
          error: `Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.estoque}, Solicitado: ${item.quantity}`,
        });
      }
    }

    console.log("Validações concluídas. Iniciando transação...");

    // Criar o pedido com transação para garantir integridade
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Criar o pedido
      const pedido = await tx.pEDIDO.create({
        data: {
          id_cliente: Number(id_cliente),
          valor_total: Number(valor_total),
          status: "PENDENTE",
        },
      });

      console.log("Pedido criado:", pedido.id_pedido);

      // 2. Criar os itens do pedido E atualizar estoque
      const itensCriados = [];
      const alertasGerados = [];

      for (const item of items) {
        // Buscar o produto atual
        const produto = await tx.pRODUTO.findUnique({
          where: { id_produto: Number(item.productId) },
        });

        if (!produto) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        // Converter preço para número
        const precoUnitario = Number(produto.preco);
        const subtotal = precoUnitario * item.quantity;

        // Criar item do pedido
        const itemPedido = await tx.iTEM_PEDIDO.create({
          data: {
            id_pedido: pedido.id_pedido,
            id_produto: Number(item.productId),
            quantidade: Number(item.quantity),
            preco_unitario: precoUnitario,
            subtotal: subtotal,
          },
        });
        itensCriados.push(itemPedido);

        console.log(`📋 Item criado: ${produto.nome} x${item.quantity}`);

        // Atualizar estoque (diminuir)
        const novoEstoque = produto.estoque - Number(item.quantity);
        
        await tx.pRODUTO.update({
          where: { id_produto: Number(item.productId) },
          data: { estoque: novoEstoque },
        });

        console.log(`📊 Estoque atualizado: ${produto.nome} | Anterior: ${produto.estoque} → Novo: ${novoEstoque}`);

        // Verificar se atingiu estoque mínimo e gerar alerta
        if (novoEstoque <= produto.estoque_minimo) {
          const alerta = await tx.aLERTA_ESTOQUE.create({
            data: {
              id_produto: Number(item.productId),
              mensagem: `ATENÇÃO: O produto "${produto.nome}" atingiu o estoque mínimo! Estoque atual: ${novoEstoque}, Estoque mínimo: ${produto.estoque_minimo}`,
              visualizado: false,
            },
          });
          alertasGerados.push(alerta);
          console.log(`⚠️ Alerta gerado para: ${produto.nome}`);
        }
      }

      // 3. Criar o pagamento
      const pagamento = await tx.pAGAMENTO.create({
        data: {
          id_pedido: pedido.id_pedido,
          valor_pago: Number(valor_total),
          forma_pagamento: forma_pagamento,
          status: "PENDENTE",
        },
      });

      console.log("💳 Pagamento criado:", pagamento.id_pagamento);

      return { pedido, itensCriados, pagamento, alertasGerados };
    });

    console.log("✅ Pedido completo criado com sucesso!");

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Pedido criado com sucesso!",
      pedido: resultado.pedido,
      itens: resultado.itensCriados,
      pagamento: resultado.pagamento,
      alertas: resultado.alertasGerados.length > 0 
        ? `${resultado.alertasGerados.length} alerta(s) de estoque gerado(s)` 
        : "Nenhum alerta gerado",
    });

  } catch (error: any) {
    console.error("❌ Erro ao criar pedido:", error);
    res.status(500).json({ 
      error: "Erro ao criar pedido", 
      details: error.message 
    });
  }
};

export const updatePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, valor_total } = req.body;

  try {
    const pedidoAtualizado = await prisma.pEDIDO.update({
      where: { id_pedido: Number(id) },
      data: {
        ...(status && { status }),
        ...(valor_total && { valor_total: Number(valor_total) }),
      },
      include: {
        itens: true,
        cliente: true,
        pagamento: true,
      },
    });

    res.json(pedidoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
};

export const deletePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Deletar em transação para garantir integridade
    await prisma.$transaction(async (tx) => {
      // Deletar pagamento se existir
      await tx.pAGAMENTO.deleteMany({
        where: { id_pedido: Number(id) },
      });

      // Deletar itens do pedido
      await tx.iTEM_PEDIDO.deleteMany({
        where: { id_pedido: Number(id) },
      });

      // Deletar o pedido
      await tx.pEDIDO.delete({
        where: { id_pedido: Number(id) },
      });
    });

    res.json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar pedido" });
  }
};