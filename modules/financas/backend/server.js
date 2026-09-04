require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const contasRoutes = require('./src/routes/contas.routes');
const transacoesRoutes = require('./src/routes/transacoes.routes');
const relatoriosRoutes = require('./src/routes/relatorios.routes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'keeperhub-financas-api' });
});

app.use('/api/contas', contasRoutes);
app.use('/api/transacoes', transacoesRoutes);
app.use('/api/relatorios', relatoriosRoutes);

app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
