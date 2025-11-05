import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rotas
import loginRoutes from "./routes/loginRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import pedidoRoutes from "./routes/pedidoRoutes";
import categoriaRoutes from "./routes/categoriaRoutes";
import alertaEstoqueRoutes from "./routes/alertaEstoqueRoutes"
import fornecedorRoutes from "./routes/fornecedorRoutes"
import itemPedidoRoutes from "./routes/itemPedidoRoutes"
import pagamentoRoutes from "./routes/pagamentoRoutes"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/clientes", clienteRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/alertas", alertaEstoqueRoutes)
app.use("/api/fornecedores", fornecedorRoutes)
app.use("/api/itemPedido", itemPedidoRoutes)
app.use("/api/pagamentos", pagamentoRoutes)



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

// ligar server: 
// npm install typescript ts-node @types/node @types/express --save-dev
// npx tsc --init
// "dev": "ts-node src/server.ts"
// npm run dev