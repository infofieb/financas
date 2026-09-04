const router = require('express').Router();
const pool = require('../config/database');

const statusMap = { pending: 'pendente', paid: 'pago', pendente: 'pendente', pago: 'pago' };
const tiposPermitidos = ['receita', 'despesa'];

router.get('/', async (_request, response, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT t.*, c.nome AS conta_nome
            FROM transacoes t
            LEFT JOIN contas c ON c.id = t.conta_id
            ORDER BY t.data DESC, t.id DESC
        `);
        response.json(rows);
    } catch (error) { next(error); }
});

router.post('/', async (request, response, next) => {
    try {
        const { tipo, valor, descricao, categoria, conta_id, data, vencimento, status } = request.body;
        const parsedValue = Number(valor);
        const parsedAccountId = Number(conta_id);
        const normalizedStatus = statusMap[status || 'pending'];

        if (!tipo || !descricao || !categoria || !conta_id || !data) {
            return response.status(400).json({ error: 'Tipo, valor, descrição, categoria, conta, data são obrigatórios.' });
        }
        if (!tiposPermitidos.includes(tipo)) return response.status(400).json({ error: 'Tipo de transação inválido.' });
        if (!Number.isFinite(parsedValue) || parsedValue <= 0) return response.status(400).json({ error: 'Valor inválido.' });
        if (!Number.isInteger(parsedAccountId) || parsedAccountId <= 0) return response.status(400).json({ error: 'Conta inválida.' });
        if (!normalizedStatus) return response.status(400).json({ error: 'Status inválido.' });

        const [result] = await pool.execute(`
            INSERT INTO transacoes (tipo, valor, descricao, categoria, conta_id, data, vencimento, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [tipo, parsedValue, descricao, categoria, parsedAccountId, data, vencimento || null, normalizedStatus]);
        response.status(201).json({ id: result.insertId, ...request.body, valor: parsedValue, conta_id: parsedAccountId, status: normalizedStatus });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            return response.status(400).json({ error: 'Conta não encontrada. Cadastre ou selecione uma conta válida.' });
        }
        next(error);
    }
});

router.patch('/:id/pagamento', async (request, response, next) => {
    try {
        const [result] = await pool.execute("UPDATE transacoes SET status = 'pago' WHERE id = ?", [request.params.id]);
        if (!result.affectedRows) return response.status(404).json({ error: 'Transação não encontrada.' });
        response.json({ id: Number(request.params.id), status: 'pago' });
    } catch (error) { next(error); }
});

module.exports = router;
