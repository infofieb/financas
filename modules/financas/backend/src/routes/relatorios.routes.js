const router = require('express').Router();
const pool = require('../config/database');

const periodFilters = {
    0: 'data >= DATE_FORMAT(CURDATE(), "%Y-%m-01")',
    1: 'data >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)',
    2: 'YEAR(data) = YEAR(CURDATE())'
};

const typeFilters = {
    1: "tipo = 'receita'",
    2: "tipo = 'despesa'"
};

router.get('/resumo', async (request, response, next) => {
    try {
        const conditions = [];
        const periodFilter = periodFilters[request.query.periodo];
        const typeFilter = typeFilters[request.query.tipo];

        if (periodFilter) conditions.push(periodFilter);
        if (typeFilter) conditions.push(typeFilter);

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await pool.query(`
            SELECT
                COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS receitas,
                COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) AS despesas,
                COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END), 0) AS saldo
            FROM transacoes
            ${where}
        `);
        response.json(rows[0]);
    } catch (error) { next(error); }
});

module.exports = router;
