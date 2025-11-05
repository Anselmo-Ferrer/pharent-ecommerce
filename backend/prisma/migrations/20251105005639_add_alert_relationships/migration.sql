-- CreateTable
CREATE TABLE `ALERTA_ESTOQUE` (
    `id_alerta` INTEGER NOT NULL AUTO_INCREMENT,
    `data_alerta` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mensagem` TEXT NOT NULL,
    `visualizado` BOOLEAN NULL DEFAULT false,
    `id_produto` INTEGER NOT NULL,

    INDEX `fk_alerta_produto`(`id_produto`),
    PRIMARY KEY (`id_alerta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CATEGORIA` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `imagem` VARCHAR(191) NULL,

    UNIQUE INDEX `CATEGORIA_nome_key`(`nome`),
    UNIQUE INDEX `CATEGORIA_slug_key`(`slug`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CLIENTE` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(15) NULL,
    `endereco` VARCHAR(255) NULL,
    `senha` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `CLIENTE_cpf_key`(`cpf`),
    UNIQUE INDEX `CLIENTE_email_key`(`email`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FORNECEDOR` (
    `id_fornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `FORNECEDOR_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id_fornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ITEM_PEDIDO` (
    `id_item` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `id_pedido` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,

    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PAGAMENTO` (
    `id_pagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `valor_pago` DECIMAL(10, 2) NOT NULL,
    `forma_pagamento` VARCHAR(30) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    `id_pedido` INTEGER NOT NULL,

    UNIQUE INDEX `PAGAMENTO_id_pedido_key`(`id_pedido`),
    PRIMARY KEY (`id_pagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PEDIDO` (
    `id_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `data_pedido` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    `id_cliente` INTEGER NOT NULL,

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PRODUTO` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `estoque` INTEGER NOT NULL DEFAULT 0,
    `estoque_minimo` INTEGER NOT NULL DEFAULT 10,
    `imagem` VARCHAR(191) NULL,
    `featured` BOOLEAN NULL DEFAULT false,
    `tamanhos` VARCHAR(191) NULL,
    `id_fornecedor` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,

    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ITEM_PEDIDO` ADD CONSTRAINT `ITEM_PEDIDO_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `PEDIDO`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAGAMENTO` ADD CONSTRAINT `PAGAMENTO_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `PEDIDO`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PEDIDO` ADD CONSTRAINT `PEDIDO_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `CLIENTE`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PRODUTO` ADD CONSTRAINT `PRODUTO_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `CATEGORIA`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PRODUTO` ADD CONSTRAINT `PRODUTO_id_fornecedor_fkey` FOREIGN KEY (`id_fornecedor`) REFERENCES `FORNECEDOR`(`id_fornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;
