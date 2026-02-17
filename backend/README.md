# Cia de Condimentos — Backend

Este backend fornece endpoints de autenticação para o site (register, login, me). Planejado para deploy no Render com Postgres.

Instalação local:

```bash
cd backend
npm install
# criar migrations no banco
psql "$DATABASE_URL" -f migrations/create_users.sql
npm start
```

Variáveis de ambiente (use o painel do Render):
- `DATABASE_URL` — URL de conexão do Postgres
- `JWT_SECRET` — segredo JWT
- `PORT` — porta (opcional)

No Render: defina `DATABASE_URL` apontando para a base Postgres criada e `JWT_SECRET`. Execute a migration com `psql $DATABASE_URL -f backend/migrations/create_users.sql`.
