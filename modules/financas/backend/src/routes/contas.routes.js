const router = require('express').Router();
const pool = require('../config/database');

const tiposPermitidos = ['Conta corrente', 'Poupança', 'Carteira', 'Cartão'];
const removedAccount = { nome: 'Conta removida', tipo: 'Carteira' };

async function unlinkTransactionsFromAccount(connection, accountId) {
    try {
        await connection.execute('UPDATE transacoes SET conta_id = NULL WHERE conta_id = ?', [accountId]);
    } catch (error) {
        if (error.code !== 'ER_BAD_NULL_ERROR') throw error;

        const [accounts] = await connection.execute(
            'SELECT id FROM contas WHERE nome = ? AND tipo = ? LIMIT 1',
            [removedAccount.nome, removedAccount.tipo]
        );
        const removedAccountId = accounts[0]?.id || (await connection.execute(
            'INSERT INTO contas (nome, tipo) VALUES (?, ?)',
            [removedAccount.nome, removedAccount.tipo]
        ))[0].insertId;

        await connection.execute('UPDATE transacoes SET conta_id = ? WHERE conta_id = ?', [removedAccountId, accountId]);
    }
}

router.get('/', async (_request, response, next) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, nome, tipo, criado_em FROM contas WHERE NOT (nome = ? AND tipo = ?) ORDER BY nome',
            [removedAccount.nome, removedAccount.tipo]
        );
        response.json(rows);
    } catch (error) { next(error); }
});

router.post('/', async (request, response, next) => {
    try {
        const { nome, tipo } = request.body;
        if (!nome || !tipo) return response.status(400).json({ error: 'Nome e tipo são obrigatórios.' });
        if (!tiposPermitidos.includes(tipo)) return response.status(400).json({ error: 'Tipo de conta inválido.' });
        const [result] = await pool.execute('INSERT INTO contas (nome, tipo) VALUES (?, ?)', [nome, tipo]);
        response.status(201).json({ id: result.insertId, nome, tipo });
    } catch (error) { next(error); }
});

router.put('/:id', async (request, response, next) => {
    try {
        const { nome, tipo } = request.body;
        if (!nome || !tiposPermitidos.includes(tipo)) return response.status(400).json({ error: 'Nome ou tipo de conta inválido.' });
        const [result] = await pool.execute('UPDATE contas SET nome = ?, tipo = ? WHERE id = ?', [nome, tipo, request.params.id]);
        if (!result.affectedRows) return response.status(404).json({ error: 'Conta não encontrada.' });
        response.json({ id: Number(request.params.id), nome, tipo });
    } catch (error) { next(error); }
});

router.delete('/:id', async (request, response, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        await unlinkTransactionsFromAccount(connection, request.params.id);
        const [result] = await connection.execute('DELETE FROM contas WHERE id = ?', [request.params.id]);
        if (!result.affectedRows) {
            await connection.rollback();
            return response.status(404).json({ error: 'Conta não encontrada.' });
        }
        await connection.commit();
        response.status(204).send();
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
