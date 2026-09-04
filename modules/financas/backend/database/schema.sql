CREATE DATABASE IF NOT EXISTS keeperhub;
USE keeperhub;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NULL,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('Conta corrente', 'Poupança', 'Carteira', 'Cartão') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS transacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NULL,
    conta_id INT UNSIGNED NULL,
    categoria_id INT UNSIGNED NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    valor DECIMAL(12, 2) NOT NULL,
    descricao VARCHAR(180) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    data DATE NOT NULL,
    vencimento DATE NULL,
    status ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_transacoes_conta FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE SET NULL,
    CONSTRAINT fk_transacoes_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

INSERT IGNORE INTO categorias (nome) VALUES
    ('Alimentação'), ('Transporte'), ('Renda'), ('Lazer'), ('Assinaturas'), ('Transferência');
